function validateEmail(email) {
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// LOGIN
async function login(){

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let msg = document.getElementById("msg");

    // CLEAR MESSAGE
    msg.innerText = "";

    // VALIDATION 1: EMPTY FIELDS
    if(!email || !password){
        msg.innerText = "⚠ Please enter email and password";
        return;
    }

    // VALIDATION 2: EMAIL FORMAT
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(email)){
        msg.innerText = "⚠ Enter valid email address";
        return;
    }

    try{
        let res = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ email, password })
        });

        let data = await res.json();

        if(res.ok){
            localStorage.setItem("user", JSON.stringify(data));
            window.location = "dashboard.html";
        } else {
            msg.innerText = data.error || "Invalid login credentials";
        }

    } catch(err){
        msg.innerText = "Server not responding";
    }
}



// RESET PASSWORD
async function resetPassword() {

    let email = document.getElementById("resetEmail").value;
    let new_password = document.getElementById("newPassword").value;

    let res = await fetch("http://127.0.0.1:5000/forgot-password", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ email, new_password })
    });

    let data = await res.json();

    if (res.ok) {
        alert("Password changed successfully");
        window.location = "login.html";
    } else {
        alert(data.error);
    }
}