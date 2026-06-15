async function loadRole(){

    let res =
    await fetch(
      `http://127.0.0.1:5000/get-profile/${user.id}`
    );

    let data = await res.json();

    document.getElementById("roleSelect").value =
        data.career_role || "";

    
}

loadRole();