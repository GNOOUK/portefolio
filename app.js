function show(page){
  document.querySelectorAll(".page").forEach(p=>{
    p.classList.remove("active");
  });

  document.getElementById(page).classList.add("active");
}

/* LOAD PROJECTS */
let proj = document.getElementById("projects");
projects.forEach(p=>{
  proj.innerHTML += `
    <div class="card">
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
    </div>
  `;
});

/* LOAD FEEDBACKS */
let fb = document.getElementById("feedbacks");
feedbacks.forEach(f=>{
  fb.innerHTML += `
    <div class="card">
      <b>${f.user}</b>
      <p>${f.text}</p>
    </div>
  `;
});
