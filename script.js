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

const rsvpForm = document.getElementById("rsvpForm");
const formMessage = document.getElementById("formMessage");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      nombre: document.getElementById("nombre").value.trim(),
      apellido: document.getElementById("apellido").value.trim(),
      telefono: document.getElementById("telefono").value.trim(),
      email: document.getElementById("email").value.trim(),
      acompanantes: document.getElementById("acompanantes").value,
      mensaje: document.getElementById("mensaje").value.trim(),
    };

    if (!validateForm(formData)) {
      return;
    }

    const submitBtn = rsvpForm.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    try {
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

function validateForm(data) {
  if (data.nombre.length < 2) {
    showMessage("Por favor, ingresa un nombre válido.", "error");
    return false;
  }

  if (data.apellido.length < 2) {
    showMessage("Por favor, ingresa un apellido válido.", "error");
    return false;
  }

  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(data.telefono) || data.telefono.length < 7) {
    showMessage("Por favor, ingresa un número de teléfono válido.", "error");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showMessage("Por favor, ingresa un correo electrónico válido.", "error");
    return false;
  }

  return true;
}

async function sendEmail(data) {
  const backendUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:3000/api/confirmacion"
      : "/api/confirmacion";

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

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
  formMessage.style.display = "block";

  formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });

  if (type === "error") {
    setTimeout(() => {
      formMessage.style.display = "none";
    }, 5000);
  }
}

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
