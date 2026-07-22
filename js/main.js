/* VertX Energies and Electrical Systems - Interactive JavaScript */
document.addEventListener('DOMContentLoaded', () => {
  // Contact Form Handling
  const quoteForm = document.getElementById('quoteForm');
  const successAlert = document.getElementById('formSuccessAlert');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show success alert
      if (successAlert) {
        successAlert.style.display = 'block';
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Reset form fields
      quoteForm.reset();

      // Auto-hide alert after 6 seconds
      setTimeout(() => {
        if (successAlert) {
          successAlert.style.display = 'none';
        }
      }, 6000);
    });
  }

  // Smooth Scroll for links with hashes
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});
