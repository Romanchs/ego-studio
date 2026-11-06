/**
 * Form handling: Phone Mask (+380 (XX) XXX-XX-XX), validation,
 * loading states, micro-interactions, and luxury success modal.
 */

import { sendLeadToEmail } from './api.js';
import { getMetricPayload } from './metrics.js';

export function initForm() {
  const form = document.getElementById('contact-form');
  const phoneInput = document.getElementById('phone-input');
  const nameInput = document.getElementById('name-input');
  const ageInput = document.getElementById('age-input');
  const cityInput = document.getElementById('city-input');
  const submitBtn = document.getElementById('submit-btn');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('modal-close-btn');

  if (!form) return;

  // --- Phone Mask (+380 (XX) XXX-XX-XX) ---
  function formatPhoneNumber(value) {
    // Keep only digits
    let digits = value.replace(/\D/g, '');
    
    // If user starts with 380, strip it to avoid duplication
    if (digits.startsWith('380')) {
      digits = digits.substring(3);
    } else if (digits.startsWith('0')) {
      digits = digits.substring(1);
    }

    // Limit to 9 digits after +380
    digits = digits.substring(0, 9);

    let formatted = '+380';
    if (digits.length > 0) {
      formatted += ' (' + digits.substring(0, 2);
    }
    if (digits.length >= 2) {
      formatted += ') ';
    }
    if (digits.length > 2) {
      formatted += digits.substring(2, 5);
    }
    if (digits.length >= 5) {
      formatted += '-';
    }
    if (digits.length > 5) {
      formatted += digits.substring(5, 7);
    }
    if (digits.length >= 7) {
      formatted += '-';
    }
    if (digits.length > 7) {
      formatted += digits.substring(7, 9);
    }

    return formatted;
  }

  if (phoneInput) {
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value || phoneInput.value.trim() === '') {
        phoneInput.value = '+380 ';
      }
    });

    phoneInput.addEventListener('input', (e) => {
      const input = e.target;
      const formatted = formatPhoneNumber(input.value);
      input.value = formatted;
    });

    phoneInput.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && phoneInput.value.length <= 5) {
        e.preventDefault();
      }
    });

    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value === '+380 ' || phoneInput.value === '+380') {
        phoneInput.value = '';
        clearError(phoneInput);
      }
    });
  }

  // --- Field Validation & Error Highlighting ---
  function showError(input, message) {
    const parent = input.closest('.input-wrapper');
    if (!parent) return;
    parent.classList.add('has-error');
    parent.classList.remove('is-valid');
    
    // Trigger subtle shake
    parent.classList.remove('shake');
    void parent.offsetWidth; // Force reflow
    parent.classList.add('shake');
  }

  function clearError(input) {
    const parent = input.closest('.input-wrapper');
    if (!parent) return;
    parent.classList.remove('has-error');
    if (input.value.trim().length > 0) {
      parent.classList.add('is-valid');
    } else {
      parent.classList.remove('is-valid');
    }
  }

  [nameInput, ageInput, cityInput, phoneInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => clearError(input));
    input.addEventListener('focus', () => {
      const parent = input.closest('.input-wrapper');
      if (parent) parent.classList.add('is-focused');
    });
    input.addEventListener('blur', () => {
      const parent = input.closest('.input-wrapper');
      if (parent) parent.classList.remove('is-focused');
    });
  });

  // --- Form Submission ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showError(nameInput);
      isValid = false;
    }

    // Validate Age
    const ageVal = parseInt(ageInput.value, 10);
    if (isNaN(ageVal) || ageVal < 16 || ageVal > 90) {
      showError(ageInput);
      isValid = false;
    }

    // Validate City
    if (!cityInput.value.trim() || cityInput.value.trim().length < 2) {
      showError(cityInput);
      isValid = false;
    }

    // Validate Phone (must contain all 9 digits after +380)
    const rawPhoneDigits = phoneInput.value.replace(/\D/g, '');
    if (rawPhoneDigits.length < 12) { // 380 + 9 digits = 12
      showError(phoneInput);
      isValid = false;
    }

    if (!isValid) return;

    // Show loading state
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    const metricDetails = getMetricPayload();
    const leadData = {
      name: nameInput.value.trim(),
      age: parseInt(ageInput.value, 10),
      city: cityInput.value.trim(),
      phone: phoneInput.value.trim(),
      metricDetails
    };

    try {
      const result = await sendLeadToEmail(leadData);

      if (result.success) {
        showSuccessModal();
        form.reset();
        [nameInput, ageInput, cityInput, phoneInput].forEach(inp => {
          const parent = inp.closest('.input-wrapper');
          if (parent) parent.classList.remove('is-valid', 'has-error');
        });
      } else {
        alert(result.message || 'Не вдалося надіслати заявку. Будь ласка, спробуйте ще раз або напишіть нам у месенджери.');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      alert('Виникла помилка зʼєднання. Спробуйте пізніше або звʼяжіться з нами через месенджери.');
    } finally {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  });

  // --- Modal Control ---
  function showSuccessModal() {
    if (!successModal) return;
    successModal.classList.add('is-active');
    triggerGoldConfetti();
  }

  function hideSuccessModal() {
    if (!successModal) return;
    successModal.classList.remove('is-active');
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideSuccessModal);
  }

  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        hideSuccessModal();
      }
    });
  }

  // --- Gold Confetti Celebration Effect ---
  function triggerGoldConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    if (!confettiContainer) return;
    confettiContainer.innerHTML = '';

    const colors = ['#f5dfa8', '#dfb872', '#ffeec9', '#d19f56', '#ffffff'];
    const count = 36;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-piece';
      particle.style.left = 50 + (Math.random() - 0.5) * 60 + '%';
      particle.style.top = '45%';
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      const size = Math.random() * 7 + 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size * (Math.random() > 0.5 ? 1.6 : 1)}px`;
      particle.style.transform = `rotate(${Math.random() * 360}deg)`;

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 180 + 70;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 60;

      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.setProperty('--rot', `${(Math.random() - 0.5) * 720}deg`);

      confettiContainer.appendChild(particle);

      setTimeout(() => particle.remove(), 1200);
    }
  }

  // --- Micro-interaction for Contact Cards ---
  const contactLinks = document.querySelectorAll('.contact-btn');
  contactLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}
