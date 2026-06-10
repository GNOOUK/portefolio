const text = "Salut, je suis Développeur";
const typing = document.querySelector(".typing");

let i = 0;

function typeEffect() {
  if (i < text.length) {
    typing.innerHTML += text.charAt(i);
    i++;
    setTimeout(typeEffect, 80);
  }
}

typeEffect();
