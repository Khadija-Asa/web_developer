var tl = gsap.timeline({ defaults: { duration: 2, ease: "ease-in-out" } });
tl.from(".hero_year", { 
  x: -100 
}, 1.5);
tl.from(".hero_img", {
  x: 500
}, 1);
tl.from(".grid_text", {
  y: 400
}, 1);