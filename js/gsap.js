// var gsap = gsap.timeline({ defaults: { duration: 2, ease: "power3.out" } });
// gsap.from(".hero_year", { 
//   opacity: 0,
//   x: 300 
// }, 1.5);
// gsap.from(".hero_img", {
//   opacity: 0,
//   x: 500
// }, 1);
// gsap.from(".grid_text", {
//   opacity: 0,
//   y: 400
// }, 2);
// gsap.from(".grid_name", {
//   opacity: 0,
//   y: 400
// }, 2.1);
// gsap.from(".grid_asterisque", {
//   opacity: 0,
//   y: 400
// }, 2.2);

gsap.registerPlugin(ScrollTrigger);

gsap.to(".asterisque", {
  scrollTrigger: {
    trigger: ".asterisque",
    scrub: true,
    start: "left center",
    end: "+=5000",
    pin: true,
  },
  x: 400,
  rotation: 720,
  ease: "linear"
});