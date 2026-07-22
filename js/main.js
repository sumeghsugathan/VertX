/* VertX Energies and Electrical Systems - Interactive JavaScript */
document.addEventListener('DOMContentLoaded', () => {
  // Contact Form Handling with Direct WhatsApp Submission
  const quoteForm = document.getElementById('quoteForm');
  const successAlert = document.getElementById('formSuccessAlert');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form values
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const propertyType = document.getElementById('propertyType').value;
      const message = document.getElementById('message').value.trim();

      // Construct formatted WhatsApp message
      const formattedMessage = 
`☀️ *New Solar Quote Request - VertX Energies*

👤 *Name:* ${name}
📞 *Phone:* ${phone}
✉️ *Email:* ${email}
🏠 *Property Type:* ${propertyType}
💬 *Details:* ${message ? message : 'No additional details provided.'}`;

      // Encode for WhatsApp URL
      const whatsappNumber = '919496395506'; // WhatsApp Target Number
      const encodedText = encodeURIComponent(formattedMessage);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

      // Show success alert on page
      if (successAlert) {
        successAlert.innerHTML = '✅ <strong>Thank you!</strong> Opening WhatsApp to send your quote request...';
        successAlert.style.display = 'block';
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Open WhatsApp chat in a new tab / app window
      window.open(whatsappUrl, '_blank');

      // Reset form fields
      quoteForm.reset();

      // Auto-hide alert after 8 seconds
      setTimeout(() => {
        if (successAlert) {
          successAlert.style.display = 'none';
        }
      }, 8000);
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
