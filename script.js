function loadProjects(){
  let container = document.getElementById("projects");
  projects.forEach(p=>{
    container.innerHTML += `
      <div class="card">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </div>
    `;
  });
}

function loadFeedbacks(){
  let container = document.getElementById("feedbacks");
  feedbacks.forEach(f=>{
    container.innerHTML += `
      <div class="card">
        <b>${f.user}</b>
        <p>${f.text}</p>
      </div>
    `;
  });
}

function loadSocials(){
  let container = document.getElementById("socials");
  socials.forEach(s=>{
    container.innerHTML += `<p>${s.name}</p>`;
  });
}

loadProjects();
loadFeedbacks();
loadSocials();
