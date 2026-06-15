async function register(){

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    // EMPTY CHECK
    if(!name || !email || !password){
        alert("⚠ Please fill all fields");
        return;
    }

    // NAME VALIDATION (no numbers, no spaces)
    let namePattern = /^[A-Za-z]+ [A-Za-z]+ [A-Za-z]+$/;

    if(!namePattern.test(name)){
    alert(
        "⚠ Enter Full Name in format:\n" +
        "FirstName MiddleName LastName\n" +
        "Example: Rohit Rahul Sharma"
    );
    return;
    }

    let parts = name.split(" ");
    let firstName = parts[0];
    let middleName = parts[1];
    let lastName = parts[2];

    if(firstName.toLowerCase() === middleName.toLowerCase()){

        alert(
            "⚠ First name and Middle name cannot be same"
        );
        return;
    }

    if(middleName.toLowerCase() === lastName.toLowerCase()){

        alert(
            "⚠ Middle name and Last name cannot be same"
        );
        return;
    }

    // EMAIL VALIDATION
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(email)){
        alert("⚠ Enter valid email address");
        return;
    }

    // PASSWORD VALIDATION
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if(!passwordPattern.test(password)){
        alert(
            "⚠ Password must be:\n" +
            "- At least 6 characters\n" +
            "- 1 uppercase letter\n" +
            "- 1 lowercase letter\n" +
            "- 1 number\n" +
            "- 1 special character"
        );
        return;
    }

    try{
        let res = await fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ name, email, password })
        });

        let data = await res.json();

        if(res.ok){
            alert("✅ Registration successful");
            window.location = "login.html";
        } else {
            alert(data.error || "Registration failed");
        }

    } catch(err){
        alert("Server not responding");
    }
}