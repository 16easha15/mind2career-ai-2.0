function generateRoadmap() {

    let career =
    document.getElementById("career").value;

    let roadmap = "";

    if(career==="AI Engineer"){

        roadmap = `
        ✅ Month 1: Python Basics<br>
        ✅ Month 2: Data Structures<br>
        ✅ Month 3: Machine Learning<br>
        ✅ Month 4: Deep Learning<br>
        ✅ Month 5: AI Projects
        `;
    }

    else if(career==="Software Engineer"){

        roadmap = `
        ✅ Month 1: Java Basics<br>
        ✅ Month 2: OOP Concepts<br>
        ✅ Month 3: SQL & Database<br>
        ✅ Month 4: Web Development<br>
        ✅ Month 5: Projects
        `;
    }

    else if(career==="Data Scientist"){

        roadmap = `
        ✅ Month 1: Python<br>
        ✅ Month 2: Statistics<br>
        ✅ Month 3: Pandas & NumPy<br>
        ✅ Month 4: Machine Learning<br>
        ✅ Month 5: Data Projects
        `;
    }

    else if(career==="Web Developer"){

        roadmap = `
        ✅ Month 1: HTML<br>
        ✅ Month 2: CSS<br>
        ✅ Month 3: JavaScript<br>
        ✅ Month 4: React<br>
        ✅ Month 5: Full Projects
        `;
    }

    else{
        roadmap="Please select a career.";
    }

    document.getElementById("roadmap").innerHTML =
    roadmap;
}

function showQuestions(){

    document.getElementById("questions").innerHTML=`

    1. Tell me about yourself?<br>
    2. What are your strengths?<br>
    3. Explain OOP Concepts.<br>
    4. What is SQL?<br>
    5. Why should we hire you?<br>

    `;
}

function chatBot(){

    let msg =
    document.getElementById("userInput")
    .value.toLowerCase();

    let response = "";

    if(msg.includes("resume")){

        response =
        "Add skills, projects, certifications and keep your resume concise.";
    }

    else if(msg.includes("interview")){

        response =
        "Practice communication, aptitude and technical questions daily.";
    }

    else if(msg.includes("career")){

        response =
        "Choose a career based on your interests, strengths and goals.";
    }

    else{

        response =
        "I can help with career guidance, resume building and interview preparation.";
    }

    document.getElementById("chatResponse")
    .innerHTML = response;
}