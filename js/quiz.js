let quizData = [];
let currentQ = 0;
let score = 0;
let selectedAnswer = "";
let quizResults = [];
let user =
JSON.parse(localStorage.getItem("user"));
let role =
localStorage.getItem("quizRole");

async function loadQuiz(type) {
    console.log("Quiz Type =", type);
    console.log("Role =", role);
    document.getElementById("quizBox").innerHTML = "Loading quiz...";

    let res = await fetch("http://127.0.0.1:5000/quiz", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
        role: role?.career_role || "Software Engineer",
        type: type
        })   
    });
    
    let data = await res.json();
    console.log(data);
    console.log(data.questions);

    // FIX: convert Gemini string → JSON
    if(data.error){
    document.getElementById("quizBox").innerHTML =
        `<h3>${data.error}</h3>`;
    return;
    }

    quizData = data.questions;

    currentQ = 0;
    score = 0;
    quizResults = [];

    showQuestion();
}

function showQuestion() {

    if(currentQ >= quizData.length){

    let wrong = quizData.length - score;

    let explanationHTML = "";

    quizResults.forEach((q,index)=>{

        explanationHTML += `
        <div class="result-card">

            <h4>Q${index+1}. ${q.question}</h4>

            <p>
            Your Answer:
            <b>${q.user_answer || "Not Answered"}</b>
            </p>

            <p>
            Correct Answer:
            <b>${q.answer}</b>
            </p>

            <p>
            Explanation:
            ${q.explanation}
            </p>

        </div>
        `;
    });

    document.getElementById("quizBox").innerHTML = `

        <div class="flash-card">

            <h2>Quiz Completed 🎉</h2>

            <h3>Correct Answers : ${score}</h3>

            <h3>Incorrect Answers : ${wrong}</h3>

            <h3>
            Final Score :
            ${score}/${quizData.length}
            </h3>

            <button onclick="saveScore()">
            Save Score
            </button>

            <button onclick="downloadQuizPDF()">
            Download PDF
            </button>

        </div>

        ${explanationHTML}

    `;

    return;
}
    let q = quizData[currentQ];

    document.getElementById("quizBox").innerHTML = `
        <div class="flash-card">

            <div class="quiz-header">
                Question ${currentQ+1} / ${quizData.length}
            </div>

            <h3>${q.question}</h3>

            <button class="option-btn"
                    onclick="selectOption('A',this)">
                A. ${q.options[0]}
            </button>

            <button class="option-btn"
                    onclick="selectOption('B',this)">
                B. ${q.options[1]}
            </button>

            <button class="option-btn"
                    onclick="selectOption('C',this)">
                C. ${q.options[2]}
            </button>

            <button class="option-btn"
                    onclick="selectOption('D',this)">
                D. ${q.options[3]}
            </button>

            <button class="next-btn"
                    onclick="nextQuestion()">
                Next →
            </button>

        </div>
    `;
}

function selectOption(option, btn) {

    document.querySelectorAll(".option-btn")
        .forEach(x => x.classList.remove("selected"));

    btn.classList.add("selected");

    selectedAnswer = btn.innerText.substring(3).trim();
}

function nextQuestion() {

    if(selectedAnswer===""){
        alert("Please select an option");
        return;
    }

    let correct = quizData[currentQ].answer;

    if (selectedAnswer === correct) {
        score++;
    }
    quizResults.push({

        question: quizData[currentQ].question,

        user_answer: selectedAnswer,

        answer: quizData[currentQ].answer,

        explanation: quizData[currentQ].explanation

    });
    currentQ++;
    selectedAnswer = "";
    showQuestion();
}

async function saveScore(){
    console.log("USER =", user);

    let res = await fetch(
        "http://127.0.0.1:5000/save-quiz-score",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({

                user_id:user.id,

                quiz_type:
                localStorage.getItem("quizType"),

                role: role || "Unknown",

                score:score,

                total:quizData.length
            })
        }
    );

    let data = await res.json();

    console.log(data);

    if(res.ok){
        alert("Score Saved Successfully");
    }else{
        alert("Failed to save score");
    }
}

async function downloadQuizPDF(){

    let res = await fetch(
        "http://127.0.0.1:5000/download-quiz-pdf",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({

                quiz_type:
                localStorage.getItem("quizType"),

                score:score,

                total:quizData.length,

                questions:quizResults

            })
        }
    );

    let blob = await res.blob();

    let url =
    window.URL.createObjectURL(blob);

    let a =
    document.createElement("a");

    a.href = url;

    a.download =
    "Quiz_Report.pdf";

    a.click();
}

window.onload = function(){

    let quizType =
        localStorage.getItem("quizType");

    // Quiz title change karega
    function capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
    }

    document.getElementById("quizTitle").innerText =
    capitalize(quizType) + " Quiz";

    if(quizType){

        loadQuiz(quizType);

    }else{

        alert("No quiz selected");

        window.location =
            "prepare.html";
    }
}