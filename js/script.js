// Overlay
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set([".first", ".second", ".third"], { left: "-100%" });
    return;
  }
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
const mybutton = document.getElementById("btn-back-to-top");

function scrollFunction() {
  mybutton.style.display = window.scrollY > 20 ? "block" : "none";
}

window.addEventListener("scroll", scrollFunction, { passive: true });

mybutton.addEventListener("click", () => {
  window.scrollTo({ top: 0 });
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
  submitBtn.textContent = 'Sending';

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
    submitBtn.textContent = 'Send';
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
