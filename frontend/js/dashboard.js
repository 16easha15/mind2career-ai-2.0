let user = JSON.parse(localStorage.getItem("user"));
let currentRoadmap = "";
if (!user) {
    window.location = "login.html";
}

// welcome text
document.getElementById("welcome").innerText =
    "Welcome, " + user.name;

// PROFILE DATA
let profile = JSON.parse(localStorage.getItem("profile"));
let selectedRole = "";

async function loadProfile(){

    let res = await fetch(
        `http://127.0.0.1:5000/get-profile/${user.id}`
    );

    let data = await res.json();

    console.log(data);

    if(data && data.career_role){

        document.getElementById("userRole").innerHTML =
        "<b>Career Role:</b> " + data.career_role;

        document.getElementById("userSkills").innerHTML =
        "<b>Skills:</b> " + data.skills;
    }
}
loadProfile();

//load quiz history

async function loadQuizHistory() {

    let user =
        JSON.parse(localStorage.getItem("user"));

    if(!user) return;

    let res = await fetch(
        `http://127.0.0.1:5000/quiz-history/${user.id}`
    );

    let data = await res.json();

    let html = "";

    if(data.length === 0){

        html = "<p>No quiz attempts yet.</p>";

    } else {

        data.forEach(q => {

            html += `
            <div class="history-card">

                <h4>${q.quiz_type}</h4>

                <p>Role : ${q.role}</p>

                <p>
                Score :
                ${q.score}/${q.total_questions}
                </p>

            </div>
            `;
        });
    }

    document.getElementById(
        "quizHistory"
    ).innerHTML = html;
}

loadQuizHistory();


// logout FIXED
function logout() {
    localStorage.removeItem("user");   // ✅ FIXED KEY
    localStorage.removeItem("profile");
    localStorage.removeItem("roadmap");

    window.location.href = "login.html";  // ✅ more reliable
}