// load fast
function loadGSAP() {
  var script = document.createElement('script');
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js";
  document.body.appendChild(script);
}

// Overlay
document.addEventListener("DOMContentLoaded", (event) => {
  gsap.to(".first", {
    duration: 1,
    delay: 1,
    left: "-100%",
    ease: "expo.inOut"
  });
  
  gsap.to(".second", {
    duration: 1,
    delay: 1.2,
    left: "-100%",
    ease: "expo.inOut"
  }); 
  gsap.to(".uno", {
    duration: 1,
    delay: 1,
    left: "-100%",
    ease: "expo.inOut"
  });
  gsap.to(".dos", {
    duration: 1,
    delay: 1.2,
    left: "-100%",
    ease: "expo.inOut"
  }); 
});