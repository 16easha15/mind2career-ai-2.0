//Save Profile
async function saveProfile(){

    let user =
    JSON.parse(localStorage.getItem("user"));

    let name =
    document.getElementById("fullname").value.trim();

    let college =
    document.getElementById("college").value.trim();

    let skills =
    document.getElementById("skills").value.trim();

    let role =
    document.getElementById("careerRole").value.trim();

    if(!name || !college || !skills || !role){
        alert("Please fill all fields");
        return;
    }

    let res = await fetch(
        "http://127.0.0.1:5000/save-profile",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                user_id:user.id,
                name:name,
                college:college,
                skills:skills,
                career_role:role
            })
        }
    );

    let data = await res.json();

    if(res.ok){
        alert(data.msg);

        localStorage.setItem(
            "careerRole",
            role
        );
    }
    else{
        alert(data.error);
    }
}

//editProfile
async function editProfile(){

    let user = JSON.parse(localStorage.getItem("user"));

    let name = prompt("Enter name");
    let college = prompt("Enter college");
    let skills = prompt("Enter skills");

    let res = await fetch("http://127.0.0.1:5000/update-profile", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            user_id:user.id,
            name:name,
            college:college,
            skills:skills,
            career_role:
                document.getElementById("careerRole").value
        })
    });

    let data = await res.json();
    alert(data.msg);

    loadProfile();
}