import { createRestSubmitter, validateContact, campaignFromSearch } from './submission.mjs';
import { config } from './config.mjs';
import { privacyHtml } from './privacy.mjs';

const form = document.getElementById('access-form');
const email = document.getElementById('email');
const name = document.getElementById('full-name');
const button = document.getElementById('request-button');
const label = document.getElementById('button-label');
const errorBox = document.getElementById('submission-error');
const fields = { email: [email, document.getElementById('email-error')], full_name: [name, document.getElementById('name-error')] };
let pending = false;
let submitter;
let touched = new Set();

function setFieldError(key, message) {
  const [input, error] = fields[key];
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  error.textContent = message || '';
  error.hidden = !message;
}
function values() {
  return { email: email.value, full_name: name.value, campaign: campaignFromSearch(location.search) };
}
function clearError() { errorBox.hidden = true; errorBox.textContent = ''; }
function fail(message) { errorBox.textContent = message; errorBox.hidden = false; }
function setPending(state) {
  pending = state;
  button.disabled = state;
  button.setAttribute('aria-busy', String(state));
  form.setAttribute('aria-busy', String(state));
  label.textContent = state ? 'Sending request…' : 'Request access';
  email.readOnly = state;
  name.readOnly = state;
}
function showSuccess() {
  document.getElementById('form-content').hidden = true;
  document.getElementById('success-content').hidden = false;
  document.getElementById('success-heading').focus({ preventScroll: true });
}

for (const key of Object.keys(fields)) {
  const input = fields[key][0];
  input.addEventListener('blur', () => {
    // Do not show errors simply because focus passed through an empty field.
    if (input.value || touched.has(key)) {
      touched.add(key);
      setFieldError(key, validateContact(values()).errors[key]);
    }
  });
  input.addEventListener('input', () => {
    clearError();
    if (touched.has(key)) setFieldError(key, validateContact(values()).errors[key]);
  });
}
try {
  submitter = createRestSubmitter({ url: config.supabaseUrl, apiKey: config.publicKey });
  button.disabled = false;
} catch {
  fail('The request form is temporarily unavailable. Please email hello@olumi.ai.');
}
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (pending || !submitter) return;
  clearError();
  const input = values();
  const validation = validateContact(input);
  for (const key of Object.keys(fields)) { touched.add(key); setFieldError(key, validation.errors[key]); }
  if (!validation.valid) { fields[Object.keys(validation.errors)[0]][0].focus(); return; }
  // Basic browser-side honeypot. The existing insert policy remains authoritative.
  // Do not claim that client-side controls are server-side spam protection.
  if (document.getElementById('website').value) {
    fail('We couldn’t submit this request. Please reload the page or email hello@olumi.ai.');
    return;
  }
  setPending(true);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  try {
    const response = await submitter(input, { signal: controller.signal });
    if (response?.ok !== true) throw new Error('Unconfirmed submission');
    showSuccess();
  } catch (error) {
    fail(error?.kind === 'rate_limit'
      ? 'Please wait a moment before trying again.'
      : 'We couldn’t confirm your request. Please try again, or email hello@olumi.ai.');
  } finally {
    clearTimeout(timeout);
    setPending(false);
  }
});
document.getElementById('reset-form').addEventListener('click', () => {
  form.reset(); touched.clear(); clearError();
  for (const key of Object.keys(fields)) setFieldError(key, '');
  document.getElementById('success-content').hidden = true;
  document.getElementById('form-content').hidden = false;
  email.focus({ preventScroll: true });
});

// Fixed policy content copied from the existing site, never user input.
const dialog = document.getElementById('privacy-dialog');
document.getElementById('privacy-copy').innerHTML = privacyHtml;
for (const control of document.querySelectorAll('[data-open-privacy]')) {
  control.addEventListener('click', () => dialog.showModal());
}
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
});
if (location.pathname.replace(/\/$/, '') === '/privacy') dialog.showModal();
