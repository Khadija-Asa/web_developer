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
  submitBtn.textContent = 'Sending';

  try {
    // send to Formspree
    const res = await fetch('https://formspree.io/f/xgopkelr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
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
    submitBtn.textContent = 'Send';
  }
});