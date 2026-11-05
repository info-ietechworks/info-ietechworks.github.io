
/* =========================================
   IE TechWorks - Website JavaScript
   ========================================= */

// Mobile navigation
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

// Automatic copyright year
const yearElement = document.querySelector('#year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Contact form
const form = document.querySelector('#contactForm');
const status = document.querySelector('#formStatus');

if (form && status) {
  const emailInput = form.querySelector('input[type="email"]');
  const phoneInput = form.querySelector('input[type="tel"]');
  const submitButton = form.querySelector('button[type="submit"]');

  // Email is required
  if (emailInput) {
    emailInput.required = true;

    emailInput.addEventListener('input', () => {
      emailInput.setCustomValidity('');
    });
  }

  // Phone is optional, but must be valid if entered
  if (phoneInput) {
    phoneInput.required = false;
    phoneInput.setAttribute('inputmode', 'tel');
    phoneInput.setAttribute('maxlength', '14');
    phoneInput.setAttribute('placeholder', '(909) 555-1234');

    // Automatically format US phone numbers
    phoneInput.addEventListener('input', () => {
      let digits = phoneInput.value.replace(/\D/g, '');

      // Allow pasted US numbers beginning with 1
      if (digits.length === 11 && digits.startsWith('1')) {
        digits = digits.slice(1);
      }

      digits = digits.slice(0, 10);

      if (digits.length > 6) {
        phoneInput.value =
          `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else if (digits.length > 3) {
        phoneInput.value =
          `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else {
        phoneInput.value = digits;
      }

      phoneInput.setCustomValidity('');
    });
  }

  // Validate and submit contact form
  form.addEventListener('submit', async event => {
    event.preventDefault();

    // Validate email
    if (emailInput) {
      emailInput.setCustomValidity('');

      emailInput.value = emailInput.value.trim();

      if (!emailInput.value || !emailInput.validity.valid) {
        emailInput.setCustomValidity(
          'Please enter a valid email address.'
        );
        emailInput.reportValidity();
        return;
      }
    }

    // Validate phone if provided
    if (phoneInput) {
      phoneInput.setCustomValidity('');

      const phoneDigits = phoneInput.value.replace(/\D/g, '');

      if (phoneDigits.length > 0) {
        const validPhone =
          phoneDigits.length === 10 &&
          /^[2-9]\d{2}[2-9]\d{6}$/.test(phoneDigits);

        if (!validPhone) {
          phoneInput.setCustomValidity(
            'Please enter a valid 10-digit US phone number.'
          );
          phoneInput.reportValidity();
          return;
        }
      }
    }

    // Validate other required form fields
    if (!form.reportValidity()) {
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    status.textContent = 'Sending your inquiry…';
    status.className = 'form-status';

    const data = new FormData(form);

    try {
      const response = await fetch(
        'https://formspree.io/f/xqppnwyd',
        {
          method: 'POST',
          body: data,
          headers: {
            Accept: 'application/json'
          }
        }
      );

      const result = await response.json();

      if (
        !response.ok ||
        result.success === false ||
        result.success === 'false'
      ) {
        throw new Error('Submission failed');
      }

      status.textContent =
        'Thank you. Your inquiry was submitted. We will follow up soon.';

      status.className = 'form-status success';

      form.reset();

      if (emailInput) {
        emailInput.setCustomValidity('');
      }

      if (phoneInput) {
        phoneInput.setCustomValidity('');
      }

    } catch (error) {
      console.error('Contact form error:', error);

      status.textContent =
        'Your message could not be sent. Please email info@ietechworks.com or call (909) 278-1990.';

      status.className = 'form-status error';

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}
