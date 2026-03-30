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

// form contact
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const toast = document.getElementById('toast');
 
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}
 
function validate(id, condition) {
  const field = document.getElementById('field-' + id);
  if (!condition) { field.classList.add('invalid'); return false; }
  field.classList.remove('invalid');
  return true;
}
 
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
 
['name', 'subject', 'message'].forEach(id => {
  document.getElementById(id).addEventListener('blur', () => {
    validate(id, document.getElementById(id).value.trim() !== '');
  });
});
 
document.getElementById('email').addEventListener('blur', () => {
  validate('email', isValidEmail(document.getElementById('email').value.trim()));
});
 
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
 
  const valid = [
    validate('name', name !== ''),
    validate('email', isValidEmail(email)),
    validate('subject', subject !== ''),
    validate('message', message !== ''),
  ].every(Boolean);
 
  if (!valid) return;
 
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending';
 
  try {
    const res = await fetch('https://formspree.io/f/xgopkelr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });
 
    if (res.ok) {
      form.reset();
        showToast('Message sent successfully !');
      } else {
        showToast('❌ Something went wrong, please try again.');
      }
    } catch {
      showToast('❌ Connection error, please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send';
    }
  });