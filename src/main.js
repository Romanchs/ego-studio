import { initIcons } from './js/icons.js';
import { initParticles } from './js/particles.js';
import { initForm } from './js/form.js';
import { initMetrics } from './js/metrics.js';

document.addEventListener('DOMContentLoaded', () => {
  // Capture and cache query ID for analytics & metrics
  const metricId = initMetrics();
  if (metricId) {
    console.log(`[Metrics] Lead tracking initialized with ID: ${metricId}`);
  }

  // Initialize icons library (Lucide + Simple Icons)
  initIcons();

  // Initialize interactive gold canvas particles
  const cleanupParticles = initParticles('gold-particles-canvas');

  // Initialize form validation, phone mask, and success modal
  initForm();

  // Gentle desktop subtle tilt interaction
  const appShell = document.getElementById('app-shell');
  if (window.innerWidth > 768 && appShell) {
    window.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      
      appShell.style.transform = `perspective(1000px) rotateY(${x * 1.8}deg) rotateX(${-y * 1.8}deg)`;
    });

    window.addEventListener('mouseleave', () => {
      appShell.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
  }

  // Log confirmation
  console.log('EGO STUDIO Landing Page initialized with gold particles and reactive form.');
});
