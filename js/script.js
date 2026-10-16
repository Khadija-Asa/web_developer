const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

function introAnimation() {
  gsap.timeline()
    .to([".first", ".third"], { left: "-100%", duration: 1.4, ease: "expo.inOut" }, 0)
    .to(".second", { left: "-100%", duration: 1.4, ease: "expo.inOut" }, 0.1)
    .from(".hero_line_inner", { yPercent: 110, duration: 1.6, stagger: 0.2, ease: "expo.out" }, 0.8)
    .from([".menu_brand", ".menu_list li"], { y: -20, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" }, 1)
    .from(".hero_badge", { y: 15, opacity: 0, duration: 0.9, stagger: 0.15, ease: "power3.out" }, 1.2)
    .from(".glow", { opacity: 0, duration: 2, ease: "power2.out" }, 1)
    .from(".hero_text", { y: 20, opacity: 0, duration: 1.2, ease: "power3.out" }, 1.4)
    .from(".hero_paint", { clipPath: "inset(0 50% 0 50%)", duration: 1.8, ease: "expo.out" }, 1.4)
    .fromTo(".hero_text .highlight", { backgroundSize: "0% 1px" }, { backgroundSize: "100% 1px", duration: 1, stagger: 0.25, ease: "power2.out" }, 2.1)
    .fromTo(".hero_button a", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: "power3.out", clearProps: "opacity" }, 1.8)
    .from(".social_line", { scaleY: 0, duration: 1.2, ease: "expo.out" }, 2)
    .from(".social_media li", { y: 15, opacity: 0, duration: 0.8, stagger: { each: 0.15, from: "end" }, ease: "power3.out" }, 2.3)
    .from([".hero_time", ".hero_scroll > *"], { opacity: 0, duration: 1.2 }, 2.4);
}

function heroScrollAnimation() {
  gsap.timeline({
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  })
    .to(".hero_badges", { yPercent: -300, opacity: 0, ease: "none" }, 0)
    .to(".hero_title h1", { scale: 0.85, opacity: 0.2, yPercent: -25, ease: "none" }, 0)
    .to(".hero_text", { yPercent: -40, ease: "none" }, 0);
}

function starAnimation() {
  const star = document.querySelector(".hero_star");
  const spin = gsap.to(star, { rotation: 360, duration: 12, ease: "none", repeat: -1 });
  star.addEventListener("mouseenter", () => gsap.to(spin, { timeScale: 6, duration: 0.4 }));
  star.addEventListener("mouseleave", () => gsap.to(spin, { timeScale: 1, duration: 0.8 }));
}

function magneticButtons() {
  document.querySelectorAll(".hero_button a, .footer_button a, #submitBtn").forEach(button => {
    button.classList.add("is_magnetic");
    button.addEventListener("mousemove", (e) => {
      const rect = button.getBoundingClientRect();
      gsap.to(button, {
        x: (e.clientX - rect.left - rect.width / 2) * 0.35,
        y: (e.clientY - rect.top - rect.height / 2) * 0.35,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true
      });
    });
    button.addEventListener("mouseleave", () => {
      gsap.to(button, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)", overwrite: true });
    });
  });
}

function heroPointer() {
  const heroTitle = document.querySelector(".hero_title");
  const glow = document.querySelector(".glow");
  gsap.set(glow, { xPercent: -50, yPercent: -50, x: 0, y: 0 });

  if (!finePointer) {
    gsap.to(glow, { xPercent: -20, yPercent: -70, duration: 6, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return;
  }

  const glowX = gsap.quickTo(glow, "x", { duration: 1.5, ease: "power3.out" });
  const glowY = gsap.quickTo(glow, "y", { duration: 1.5, ease: "power3.out" });
  const lines = [...document.querySelectorAll(".hero_line")].map((line, i) => ({
    x: gsap.quickTo(line, "x", { duration: 2, ease: "power2.out" }),
    y: gsap.quickTo(line, "y", { duration: 2, ease: "power2.out" }),
    strength: 5 - i * 2
  }));
  const paintX = gsap.quickTo(".hero_paint", "x", { duration: 1.2, ease: "power3.out" });

  window.addEventListener("mousemove", (e) => {
    glowX(e.clientX - window.innerWidth / 2);
    glowY(e.clientY - window.innerHeight / 2);
    if (heroTitle.getBoundingClientRect().bottom < 0) return;
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    lines.forEach(line => {
      line.x(-nx * line.strength);
      line.y(-ny * line.strength * 0.3);
    });
    paintX(nx * 3);
  });
}

function splitWords(element) {
  const units = [];
  [...element.childNodes].forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.append(part);
          return;
        }
        const word = document.createElement("span");
        word.className = "word";
        word.textContent = part;
        fragment.append(word);
        units.push(word);
      });
      node.replaceWith(fragment);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "BR") {
      node.classList.add("word");
      units.push(node);
    }
  });
  return units;
}

function headerAndProgress() {
  gsap.to(".scroll_progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 }
  });

  const menu = document.querySelector(".menu");
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const hide = self.direction === 1 && self.scroll() > window.innerHeight;
      gsap.to(menu, { yPercent: hide ? -100 : 0, duration: 0.5, ease: "power3.out", overwrite: true });
    }
  });
}

function sectionTitles() {
  gsap.utils.toArray(".introduce_title h2, .accordion_intro h2").forEach(title => {
    gsap.fromTo(title,
      { yPercent: 60, opacity: 0, clipPath: "inset(0 0 100% 0)" },
      {
        yPercent: 0,
        opacity: 1,
        clipPath: "inset(0 0 0% 0)",
        duration: 1.4,
        ease: "expo.out",
        clearProps: "clipPath",
        scrollTrigger: { trigger: title, start: "top 85%" }
      }
    );
  });

  gsap.utils.toArray(".introduce_paragraph, .accordion_intro p").forEach(paragraph => {
    gsap.from(splitWords(paragraph), {
      yPercent: 100,
      opacity: 0,
      duration: 0.9,
      stagger: 0.015,
      ease: "power3.out",
      scrollTrigger: { trigger: paragraph, start: "top 85%" }
    });
  });
}

function galleryAnimation() {
  gsap.utils.toArray(".gallery_box").forEach((box, i) => {
    const image = box.querySelector(".gallery_img");
    gsap.timeline({ scrollTrigger: { trigger: box, start: "top bottom" } })
      .fromTo(image, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 2.4, delay: i * 0.35, ease: "expo.inOut" })
      .from(box.querySelector(".box_title").children, { y: 40, opacity: 0, duration: 1.4, stagger: 0.2, ease: "power3.out" }, "-=1.4");
    gsap.fromTo(image, { backgroundPosition: "50% 0%" }, {
      backgroundPosition: "50% 100%",
      ease: "none",
      scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true }
    });
  });
}

function statementAnimation() {
  const statement = document.querySelector(".work_text p");
  gsap.fromTo(splitWords(statement), { opacity: 0.12 }, {
    opacity: 1,
    stagger: 0.05,
    ease: "none",
    scrollTrigger: { trigger: statement, start: "top 80%", end: "bottom 50%", scrub: true }
  });
}

function skillsAnimation() {
  const skills = gsap.utils.toArray(".skills li");
  gsap.from(skills, {
    x: () => gsap.utils.random(-300, 300),
    y: () => gsap.utils.random(-200, 200),
    rotation: () => gsap.utils.random(-45, 45),
    scale: 0.6,
    opacity: 0,
    duration: 1.6,
    ease: "expo.out",
    stagger: { each: 0.03, from: "center" },
    scrollTrigger: { trigger: ".skills", start: "top 80%" },
    onStart: () => gsap.set(skills, { transition: "none" }),
    onComplete: () => gsap.set(skills, { clearProps: "transform,transition" })
  });
}

function projectsAnimation() {
  gsap.utils.toArray(".accordion_list li").forEach(row => {
    gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%" } })
      .fromTo(row, { "--line": 0 }, { "--line": 1, duration: 1.4, ease: "expo.inOut" })
      .from(row.querySelector(".accordion_number"), { yPercent: 100, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.3)
      .from(row.querySelectorAll(".accordion_info > *"), { y: 30, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }, 0.4)
      .from(row.querySelector(".accordion_links"), { x: 30, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.55);
  });

  gsap.matchMedia().add("(min-width: 1024px) and (pointer: fine)", () => {
    const cleanups = gsap.utils.toArray(".accordion_list li").map(row => {
      const tooltip = row.querySelector(".tooltip_image");
      const links = row.querySelector(".accordion_links");
      gsap.set(tooltip, { left: 0, top: 0, bottom: "auto", xPercent: -50, yPercent: -50 });
      const text = row.querySelector(".accordion_element");
      const clampX = (x) => {
        const rowLeft = row.getBoundingClientRect().left;
        const half = tooltip.offsetWidth / 2 + 24;
        const min = text.getBoundingClientRect().right - rowLeft + half;
        const max = links.getBoundingClientRect().left - rowLeft - half;
        return min > max ? (min + max) / 2 : gsap.utils.clamp(min, max, x);
      };
      const xTo = gsap.quickTo(tooltip, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(tooltip, "y", { duration: 0.6, ease: "power3.out" });
      const rotationTo = gsap.quickTo(tooltip, "rotation", { duration: 0.8, ease: "power3.out" });
      let lastX = 0;
      let resetTimer;
      const enter = (e) => {
        const rect = row.getBoundingClientRect();
        lastX = clampX(e.clientX - rect.left);
        gsap.set(tooltip, { x: lastX, y: e.clientY - rect.top, rotation: 0 });
      };
      const move = (e) => {
        const rect = row.getBoundingClientRect();
        const x = clampX(e.clientX - rect.left);
        xTo(x);
        yTo(e.clientY - rect.top);
        rotationTo(gsap.utils.clamp(-12, 12, (x - lastX) * 0.6));
        lastX = x;
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => rotationTo(0), 100);
      };
      const hideTooltip = () => row.classList.add("is_on_links");
      const showTooltip = () => row.classList.remove("is_on_links");
      row.addEventListener("mouseenter", enter);
      row.addEventListener("mousemove", move);
      links.addEventListener("mouseenter", hideTooltip);
      links.addEventListener("mouseleave", showTooltip);
      return () => {
        row.removeEventListener("mouseenter", enter);
        row.removeEventListener("mousemove", move);
        links.removeEventListener("mouseenter", hideTooltip);
        links.removeEventListener("mouseleave", showTooltip);
        showTooltip();
      };
    });
    return () => cleanups.forEach(cleanup => cleanup());
  });
}

function marqueeAnimation() {
  const skewTo = gsap.quickTo(".marquee", "skewY", { duration: 0.6, ease: "power3.out" });
  let resetTimer;
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      skewTo(gsap.utils.clamp(-5, 5, self.getVelocity() / -300));
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => skewTo(0), 120);
    }
  });
}

function contactAnimation() {
  gsap.from(".contact_details li", {
    y: 40,
    opacity: 0,
    duration: 1.6,
    stagger: 0.25,
    ease: "expo.out",
    scrollTrigger: { trigger: ".contact_details", start: "top 90%" }
  });

  const fields = gsap.utils.toArray(".form_wrapper .field:not(.gdpr-field), #field-gdpr");
  const button = document.getElementById("submitBtn");
  gsap.timeline({
    scrollTrigger: { trigger: ".form_wrapper", start: "top 85%" },
    onStart: () => gsap.set([...fields, button], { transition: "none" }),
    onComplete: () => gsap.set([...fields, button], { clearProps: "transition,clipPath" })
  })
    .fromTo(fields,
      { y: 60, opacity: 0, clipPath: "inset(0 0 100% 0)" },
      { y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 1.6, stagger: 0.2, ease: "expo.out" }
    )
    .from(button, { scale: 0.8, opacity: 0, duration: 1.2, ease: "back.out(1.7)" }, "-=0.9");
}

function footerAnimation() {
  const words = splitWords(document.querySelector(".footer_heading"));
  const buttons = gsap.utils.toArray(".footer_button a");
  gsap.timeline({ scrollTrigger: { trigger: ".footer", start: "top 75%" } })
    .from(words, { yPercent: 120, rotation: 8, opacity: 0, duration: 1.3, stagger: 0.08, ease: "expo.out" })
    .from(".footer_subtitle", { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, 0.4)
    .from(buttons, {
      y: 30,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "power3.out",
      onStart: () => gsap.set(buttons, { transition: "none" }),
      onComplete: () => gsap.set(buttons, { clearProps: "transition" })
    }, 0.6);
}

document.addEventListener("DOMContentLoaded", () => {
  if (reduceMotion) {
    gsap.set([".first", ".second", ".third"], { left: "-100%" });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.defaults({ toggleActions: "restart reset restart reset" });
  introAnimation();
  heroScrollAnimation();
  starAnimation();
  heroPointer();
  headerAndProgress();
  sectionTitles();
  galleryAnimation();
  statementAnimation();
  skillsAnimation();
  projectsAnimation();
  marqueeAnimation();
  contactAnimation();
  footerAnimation();
  if (finePointer) magneticButtons();
});

const localTime = document.getElementById("localTime");
const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

function updateTime() {
  localTime.textContent = timeFormat.format(new Date());
}

updateTime();
setInterval(updateTime, 30000);

const heroScroll = document.querySelector(".hero_scroll");

// Scroll to top
const mybutton = document.getElementById("btn-back-to-top");

function scrollFunction() {
  mybutton.style.display = window.scrollY > window.innerHeight / 2 ? "block" : "none";
  heroScroll.classList.toggle("is_hidden", window.scrollY > 20);
}

window.addEventListener("scroll", scrollFunction, { passive: true });

const scrollBehavior = reduceMotion ? "auto" : "smooth";

mybutton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: scrollBehavior });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: scrollBehavior });
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

// Form contact
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const toast = document.getElementById('toast');

// show toast message
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

// validate a field
function validate(id, condition) {
  const field = document.getElementById('field-' + id);
  document.getElementById(id).setAttribute('aria-invalid', String(!condition));
  if (!condition) { field.classList.add('invalid'); return false; }
  field.classList.remove('invalid');
  return true;
}

// check email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// validate text fields on blur
['name', 'subject', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('blur', () => {
    validate(id, document.getElementById(id).value.trim() !== '');
  });
});

// validate email on blur
document.getElementById('email').addEventListener('blur', () => {
  validate('email', isValidEmail(document.getElementById('email').value.trim()));
});

// validate RGPD on change
document.getElementById('gdpr').addEventListener('change', () => {
  validate('gdpr', document.getElementById('gdpr').checked);
});

// handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get field values
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
  const gdpr = document.getElementById('gdpr').checked;
  const _gotcha = form.elements._gotcha.value;

  // run all validations
  const valid = [
    validate('name', name !== ''),
    validate('email', isValidEmail(email)),
    validate('subject', subject !== ''),
    validate('message', message !== ''),
    validate('gdpr', gdpr),
  ].every(Boolean);

  // stop if invalid
  if (!valid) return;

  // disable button while sending
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    // send to Formspree
    const res = await fetch('https://formspree.io/f/xgopkelr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, subject, message, _gotcha })
    });

    // handle response
    if (res.ok) {
      form.reset();
      showToast('Message sent successfully !');
    } else {
      showToast('❌ Something went wrong, please try again.');
    }
  } catch {
    // handle network error
    showToast('❌ Connection error, please try again.');
  } finally {
    // re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send message';
  }
});

const GA_ID = 'G-7XBSHTDGN6';
const CONSENT_KEY = 'cookie-consent';
const CONSENT_DURATION = 395 * 24 * 60 * 60 * 1000;
const cookieBanner = document.getElementById('cookieBanner');

function getConsent() {
  try {
    const consent = JSON.parse(localStorage.getItem(CONSENT_KEY));
    if (consent && Date.now() - consent.date < CONSENT_DURATION) return consent.value;
  } catch {}
  return null;
}

function saveConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, date: Date.now() }));
  } catch {}
}

function loadAnalytics() {
  window['ga-disable-' + GA_ID] = false;
  if (window.gtag) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID, { cookie_expires: CONSENT_DURATION / 1000 });
}

function removeAnalytics() {
  window['ga-disable-' + GA_ID] = true;
  document.cookie.split(';')
    .map(cookie => cookie.split('=')[0].trim())
    .filter(name => name.startsWith('_ga'))
    .forEach(name => {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.' + location.hostname.replace(/^www\./, '');
    });
}

function setConsent(value) {
  saveConsent(value);
  cookieBanner.hidden = true;
  value === 'accepted' ? loadAnalytics() : removeAnalytics();
}

document.getElementById('cookieAccept').addEventListener('click', () => setConsent('accepted'));
document.getElementById('cookieRefuse').addEventListener('click', () => setConsent('refused'));
document.getElementById('cookieSettings').addEventListener('click', () => {
  cookieBanner.hidden = false;
});

if (getConsent() === 'accepted') {
  loadAnalytics();
} else if (getConsent() === null) {
  cookieBanner.hidden = false;
}
