const btnConfirmarAsistencia = document.getElementById(
  "btnConfirmarAsistencia",
);
const btnVerUbicacion = document.getElementById("btnVerUbicacion");
const rsvpSection = document.querySelector(".rsvp");
const locationSection = document.querySelector(".location");

if (btnConfirmarAsistencia) {
  btnConfirmarAsistencia.addEventListener("click", () => {
    if (!rsvpSection.classList.contains("show")) {
      rsvpSection.classList.add("show");
      setTimeout(() => {
        rsvpSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } else {
      rsvpSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
}

if (btnVerUbicacion) {
  btnVerUbicacion.addEventListener("click", () => {
    if (!locationSection.classList.contains("show")) {
      locationSection.classList.add("show");
      setTimeout(() => {
        locationSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } else {
      locationSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
}

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

const telefonoInput = document.getElementById("telefono");
if (telefonoInput) {
  telefonoInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.startsWith("0")) {
      value = value.substring(1);
    }

    if (value.length > 0) {
      const validPrefixes = ["412", "424", "414", "426", "416"];
      const prefix = value.substring(0, 3);

      if (value.length >= 3 && !validPrefixes.includes(prefix)) {
        value = value.substring(0, 2);
      }
    }

    if (value.length > 10) {
      value = value.substring(0, 10);
    }

    if (value.length > 3) {
      value = value.substring(0, 3) + "-" + value.substring(3);
    }

    e.target.value = value;
  });

  telefonoInput.addEventListener("blur", function (e) {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length > 0 && value.length < 10) {
      showMessage(
        "El teléfono debe tener 10 dígitos (ej: 412-1234567)",
        "error",
      );
    }
  });
}

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const telefonoRaw = document
      .getElementById("telefono")
      .value.replace(/\D/g, "");
    const telefonoFormateado = "+58" + telefonoRaw;

    const formData = {
      nombre: document.getElementById("nombre").value.trim(),
      apellido: document.getElementById("apellido").value.trim(),
      telefono: telefonoFormateado,
      email: document.getElementById("email").value.trim(),
      acompanantes: document.getElementById("acompanantes").value,
      mensaje: document.getElementById("mensaje").value.trim(),
    };

    if (!validateForm(formData)) {
      return;
    }

    if (checkLocalConfirmation()) {
      showMessage(
        "Ya has confirmado tu asistencia desde este dispositivo. Si necesitas hacer cambios, por favor contáctanos.",
        "error",
      );
      return;
    }

    const submitBtn = rsvpForm.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    try {
      const response = await sendEmail(formData);

      if (response.success) {
        saveLocalConfirmation(formData);
        showMessage(
          "¡Gracias por confirmar tu asistencia! Nos vemos pronto.",
          "success",
        );
        rsvpForm.reset();
      } else if (response.duplicate) {
        showMessage(
          response.message || "Ya existe una confirmación con estos datos.",
          "error",
        );
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

  const phoneRegex = /^\+58\d{10}$/;
  if (!phoneRegex.test(data.telefono)) {
    showMessage("Por favor, ingresa un número de teléfono válido.", "error");
    return false;
  }

  const areaCode = data.telefono.substring(3, 6);
  const validAreaCodes = ["412", "424", "414", "426", "416"];
  if (!validAreaCodes.includes(areaCode)) {
    showMessage(
      "El código de área debe ser 412, 424, 414, 426 o 416.",
      "error",
    );
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
    window.location.hostname === "wsl.localhost"
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
    } else if (response.status === 409 && result.duplicate) {
      return { success: false, duplicate: true, message: result.message };
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

  // Verificar si ya confirmó al cargar la página
  if (checkLocalConfirmation()) {
    const rsvpFormElement = document.getElementById("rsvpForm");
    if (rsvpFormElement) {
      const confirmationData = getLocalConfirmation();
      showMessage(
        `Ya has confirmado tu asistencia como ${confirmationData.nombre} ${confirmationData.apellido}. Si necesitas hacer cambios, por favor contáctanos.`,
        "error",
      );
      // Deshabilitar el formulario
      const inputs = rsvpFormElement.querySelectorAll(
        "input, textarea, button",
      );
      inputs.forEach((input) => {
        input.disabled = true;
      });
    }
  }
});

// Funciones para manejar localStorage
function saveLocalConfirmation(data) {
  try {
    const confirmationData = {
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      telefono: data.telefono,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    localStorage.setItem("rsvp_confirmation", JSON.stringify(confirmationData));
  } catch (error) {
    console.error("Error guardando en localStorage:", error);
  }
}

function checkLocalConfirmation() {
  try {
    const confirmation = localStorage.getItem("rsvp_confirmation");
    return confirmation !== null;
  } catch (error) {
    console.error("Error verificando localStorage:", error);
    return false;
  }
}

function getLocalConfirmation() {
  try {
    const confirmation = localStorage.getItem("rsvp_confirmation");
    return confirmation ? JSON.parse(confirmation) : null;
  } catch (error) {
    console.error("Error obteniendo de localStorage:", error);
    return null;
  }
}
