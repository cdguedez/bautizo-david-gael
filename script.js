// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Scroll indicator functionality
const scrollIndicator = document.querySelector(".scroll-indicator");
if (scrollIndicator) {
  scrollIndicator.addEventListener("click", () => {
    const aboutSection = document.querySelector(".about");
    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
}

// Form handling
const rsvpForm = document.getElementById("rsvpForm");
const formMessage = document.getElementById("formMessage");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form data
    const formData = {
      nombre: document.getElementById("nombre").value.trim(),
      apellido: document.getElementById("apellido").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      email: document.getElementById("email").value.trim(),
      acompanantes: document.getElementById("acompanantes").value,
      mensaje: document.getElementById("mensaje").value.trim(),
    };

    // Validate form
    if (!validateForm(formData)) {
      return;
    }

    // Disable submit button
    const submitBtn = rsvpForm.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    try {
      // Send email using FormSubmit.co (free service)
      const response = await sendEmail(formData);

      if (response.success) {
        showMessage(
          "¡Gracias por confirmar tu asistencia! Nos vemos pronto.",
          "success",
        );
        rsvpForm.reset();
      } else {
        showMessage(
          "Hubo un error al enviar el formulario. Por favor, intenta nuevamente.",
          "error",
        );
      }
    } catch (error) {
      console.error("Error:", error);
      showMessage(
        "Hubo un error al enviar el formulario. Por favor, intenta nuevamente.",
        "error",
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// Form validation
function validateForm(data) {
  // Validate name
  if (data.nombre.length < 2) {
    showMessage("Por favor, ingresa un nombre válido.", "error");
    return false;
  }

  // Validate last name
  if (data.apellido.length < 2) {
    showMessage("Por favor, ingresa un apellido válido.", "error");
    return false;
  }

  // Validate phone
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(data.telefono) || data.telefono.length < 7) {
    showMessage("Por favor, ingresa un número de teléfono válido.", "error");
    return false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showMessage("Por favor, ingresa un correo electrónico válido.", "error");
    return false;
  }

  return true;
}

// Send email function
async function sendEmail(data) {
  // Enviar al backend local
  const backendUrl = "http://localhost:3000/api/confirmacion";

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("Error enviando confirmación:", error);
    return { success: false };
  }
}

// Show message function
function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = "block";

  // Scroll to message
  formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });

  // Hide message after 5 seconds for error messages
  if (type === "error") {
    setTimeout(() => {
      formMessage.style.display = "none";
    }, 5000);
  }
}

// Add animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".detail-card, .blessing-quote, .rsvp-form",
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
});
