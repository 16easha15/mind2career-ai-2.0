async function generate() {

    document.getElementById("output").innerHTML =
        "⏳ Generating...";

    let res = await fetch("http://127.0.0.1:5000/ai_roadmap", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            name: document.getElementById("name").value,
            branch: document.getElementById("branch").value,
            career_role: document.getElementById("career_role").value,
            skills: document.getElementById("skills").value
        })
    });

    let data = await res.json();

    document.getElementById("output").innerHTML =
        marked.parse(data.report);   // ⭐ FIX HERE
}

