from flask import Blueprint, request, jsonify
from db import get_db

auth = Blueprint("auth", __name__)

# ---------------- REGISTER ----------------
@auth.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO users (name, email, password)
        VALUES (%s, %s, %s)
    """, (data["name"], data["email"], data["password"]))

    db.commit()

    return jsonify({"message": "User registered successfully"})


# ---------------- LOGIN ----------------
@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM users
        WHERE email=%s AND password=%s
    """, (data["email"], data["password"]))

    user = cursor.fetchone()

    if user:
        return jsonify({
            "message": "Login success",
            "user": user
        })

    return jsonify({"message": "Invalid credentials"})