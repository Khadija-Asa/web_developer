// load fast
function loadGSAP() {
  var script = document.createElement('script');
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js";
  document.body.appendChild(script);
}

// Overlay
document.addEventListener("DOMContentLoaded", (event) => {
  gsap.to(".first", {
    duration: 2.5,
    delay: 0,
    left: "-100%",
    ease: "expo.inOut"
  });
  gsap.to(".second", {
    duration: 2.5,
    delay: 0.2,
    left: "-100%",
    ease: "expo.inOut"
  });
  gsap.to(".third", {
    duration: 2.5,
    delay: 0, 
    left: "-100%",
    ease: "expo.inOut"
  });
});

// Scroll to top
let mybutton = document.getElementById("btn-back-to-top");

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
mybutton.addEventListener("click", backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}