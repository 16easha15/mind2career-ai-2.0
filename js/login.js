async function login() {

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({email, password})
    });

    let data = await res.json();

    if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location = "dashboard.html";
    } else {
        alert(data.message);
    }
}