function login(){
  let u = document.getElementById("user").value;
  let p = document.getElementById("pass").value;

  if(u === "Gnoouk" && p === "GNOOUK_9x7!Secure2026"){
    document.getElementById("login").style.display = "none";
    document.getElementById("panel").style.display = "block";
  } else {
    alert("Mauvais identifiants");
  }
}

function addProject(){
  let t = document.getElementById("ptitle").value;
  let d = document.getElementById("pdesc").value;

  projects.push({title:t, desc:d});
  alert("Projet ajouté (refresh site)");
}

function addFeedback(){
  let u = document.getElementById("fuser").value;
  let t = document.getElementById("ftext").value;

  feedbacks.push({user:u, text:t});
  alert("Feedback ajouté (refresh site)");
}
