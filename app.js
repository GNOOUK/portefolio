function show(page){
  document.querySelectorAll(".page").forEach(p=>{
    p.classList.remove("active");
  });

  document.getElementById(page).classList.add("active");
}

/* PROJETS */
let p = document.getElementById("projects");
projects.forEach(x=>{
  p.innerHTML += `
    <div class="card">
      <h3>${x.title}</h3>
      <p>${x.desc}</p>
    </div>
  `;
});

/* FEEDBACKS */
let f = document.getElementById("feedbacks");
feedbacks.forEach(x=>{
  f.innerHTML += `
    <div class="card">
      <b>${x.user}</b>
      <p>${x.text}</p>
    </div>
  `;
});
