from flask import Flask, request, jsonify
from flask_cors import CORS
from google.api_core.exceptions import ResourceExhausted
import json
import os
from db import get_db
from gemini_ai import model
from reportlab.pdfgen import canvas
from flask import send_file
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet

app = Flask(__name__)
CORS(app)

# ---------------- HOME ----------------
@app.route("/")
def home():
    return "Mind2Career Backend Running"

# ---------------- REGISTER ----------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute(
    "SELECT id FROM users WHERE email=%s",
    (data["email"],)
)

    existing_user = cursor.fetchone()

    if existing_user:
        return jsonify({
        "error":"User already registered with this email"
    }), 400
    cursor.execute(
        "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
        (data["name"], data["email"], data["password"])
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"msg": "Registered successfully"})

# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE email=%s AND password=%s",
        (data["email"], data["password"])
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user:
        return jsonify({
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        })
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# ---------------- FORGOT PASSWORD ----------------
@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.json

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email=%s", (data["email"],))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "Email not found"}), 404

    cursor.execute(
        "UPDATE users SET password=%s WHERE email=%s",
        (data["new_password"], data["email"])
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"msg": "Password updated successfully"})

# ---------------- SAVE PROFILE----------------
@app.route("/save-profile", methods=["POST"])
def save_profile():

    data = request.json

    if not data["name"].strip():
        return jsonify({"error":"Name is required"}),400

    if not data["college"].strip():
        return jsonify({"error":"College is required"}),400

    if not data["skills"].strip():
        return jsonify({"error":"Skills are required"}),400

    if not data["career_role"].strip():
        return jsonify({"error":"Career role is required"}),400

    conn = get_db()
    cursor = conn.cursor()
    

    cursor.execute(
        "SELECT id FROM profiles WHERE user_id=%s",
        (data["user_id"],)
    )

    existing = cursor.fetchone()

    if existing:

        cursor.execute("""
        UPDATE profiles
        SET
            name=%s,
            college=%s,
            skills=%s,
            career_role=%s
        WHERE user_id=%s
        """,(
            data["name"],
            data["college"],
            data["skills"],
            data["career_role"],
            data["user_id"]
        ))

        msg = "Profile Updated"

    else:

        cursor.execute("""
        INSERT INTO profiles
        (user_id,name,college,skills,career_role)
        VALUES(%s,%s,%s,%s,%s)
        """,(
            data["user_id"],
            data["name"],
            data["college"],
            data["skills"],
            data["career_role"]
        ))

        msg = "Profile Saved"

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"msg":msg})

# ---------------- GET PROFILE----------------
@app.route("/get-profile/<int:user_id>", methods=["GET"])
def get_profile(user_id):

    conn = get_db()

    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM profiles WHERE user_id=%s LIMIT 1",
        (user_id,)
    )

    profile = cursor.fetchone()

    cursor.fetchall()   # FIX

    cursor.close()
    conn.close()

    if profile:
        return jsonify(profile)

    return jsonify({})

# ---------------- UPDATE PROFILE----------------
@app.route("/update-profile", methods=["POST"])
def update_profile():
    data = request.json

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE profiles
    SET name=%s,
        college=%s,
        skills=%s,
        career_role=%s
    WHERE user_id=%s
""", (
    data["name"],
    data["college"],
    data["skills"],
    data["career_role"],
    data["user_id"]
))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"msg": "Profile updated"})

# ---------------- ROADMAP ----------------
@app.route("/ai_roadmap", methods=["POST"])
def ai_roadmap():
    data = request.json

    prompt = f"""
    Create career roadmap:

    Name: {data.get('name')}
    Branch: {data.get('branch')}
    career_role: {data.get('career_role')}
    Skills: {data.get('skills')}
    """

    try:

        response = model.generate_content(prompt)

        return jsonify({
            "report": response.text
        })

    except ResourceExhausted:

        return jsonify({
            "report":
            "Gemini quota exceeded. Please try again later."
        }), 429

    except Exception as e:

        return jsonify({
            "report": str(e)
        }), 500


# ---------------- QUIZES ----------------
@app.route("/quiz", methods=["POST"])
def quiz():

    try:

        data = request.json

        role = data.get("role")
        quiz_type = data.get("type")

        print("ROLE =", role)
        print("TYPE =", quiz_type)

        prompt = f"""
        Generate EXACTLY 10 MCQ questions.

        Quiz Type:
        {quiz_type}

        Career Role:
        {role}

        Rules:

        Interview Quiz:
        - HR
        - Behavioral
        - Communication

        Aptitude Quiz:
        - Quantitative
        - Reasoning
        - Logical

        Technical Quiz:
        - Technical questions related ONLY to {role}

        Return JSON ONLY

        {{
        "questions":[
            {{
            "question":"",
            "options":["","","",""],
            "answer":"",
            "explanation":""
            }}
        ]
        }}
        """
        response = model.generate_content(prompt)
        print(response.text)
        
        text = response.text.strip()

        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "")

        quiz_data = json.loads(text)

        return jsonify(quiz_data)

    except ResourceExhausted:

        return jsonify({
            "error": "Gemini quota exceeded. Please wait 1 minute."
        }), 429

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- SAVE QUIZ-SCORE ----------------
@app.route("/save-quiz-score", methods=["POST"])
def save_quiz_score():

    data = request.json
    print(data)
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO quiz_scores
        (user_id, quiz_type, role, score, total_questions)
        VALUES (%s,%s,%s,%s,%s)
    """, (
        data["user_id"],
        data["quiz_type"],
        data["role"],
        data["score"],
        data["total"]
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"msg":"saved"})

# ---------------- Download Quiz-PDF ----------------
@app.route("/download-quiz-pdf", methods=["POST"])
def download_quiz_pdf():

    data = request.json

    doc = SimpleDocTemplate("quiz_result.pdf")

    styles = getSampleStyleSheet()

    elements = []

    elements.append(
        Paragraph(
            f"{data['quiz_type']} Quiz Report",
            styles['Title']
        )
    )

    elements.append(
        Paragraph(
            f"Score: {data['score']} / {data['total']}",
            styles['Heading2']
        )
    )

    elements.append(Spacer(1, 20))

    for q in data["questions"]:

        elements.append(
            Paragraph(
                f"<b>Question:</b> {q['question']}",
                styles['BodyText']
            )
        )

        elements.append(
            Paragraph(
                f"<b>Your Answer:</b> {q['user_answer']}",
                styles['BodyText']
            )
        )

        elements.append(
            Paragraph(
                f"<b>Correct Answer:</b> {q['answer']}",
                styles['BodyText']
            )
        )

        elements.append(
            Paragraph(
                f"<b>Explanation:</b> {q['explanation']}",
                styles['BodyText']
            )
        )

        elements.append(Spacer(1, 15))

    doc.build(elements)

    return send_file(
        "quiz_result.pdf",
        as_attachment=True
    )

# ---------------- Quiz-Score History ----------------
@app.route("/quiz-history/<int:user_id>")
def quiz_history(user_id):

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM quiz_scores
        WHERE user_id=%s
        ORDER BY id DESC
    """,(user_id,))

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(rows)
    
# ---------------- CHATBOT ----------------
@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.json
    response = model.generate_content(data["message"])
    return jsonify({"reply": response.text})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)