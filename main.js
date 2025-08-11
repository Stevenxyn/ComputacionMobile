// Inicializa EmailJS con tu Public Key
    emailjs.init("m-Iv2Rh4F0erFcPc-");

    function openModal() {
      document.getElementById("modalOverlay").classList.add("active");
      document.getElementById("modalOverlay").setAttribute("aria-hidden", "false");
      document.getElementById("statusMessage").textContent = "";
    }

    function closeModal() {
      document.getElementById("modalOverlay").classList.remove("active");
      document.getElementById("modalOverlay").setAttribute("aria-hidden", "true");
    }

    // Cierre con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    // Establecer fecha mínima como hoy
    document.addEventListener('DOMContentLoaded', function() {
      const fechaInput = document.getElementById('fecha');
      const hoy = new Date();
      const fechaMinima = hoy.toISOString().split('T')[0];
      fechaInput.setAttribute('min', fechaMinima);
    });

    // Envío del formulario
    document.getElementById("reservationForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const sendBtn = document.getElementById("sendBtn");
      sendBtn.disabled = true;
      sendBtn.textContent = "Enviando...";

      // Recolectar datos - CAMBIADO: usar menuSelect en lugar de menu
      const nombre = document.getElementById("nombre").value.trim();
      const email_cliente = document.getElementById("email_cliente").value.trim();
      const fecha = document.getElementById("fecha").value.trim();
      const personas = document.getElementById("personas").value;
      const menu = document.getElementById("menuSelect").value; // CORREGIDO AQUÍ

      // DEBUG: Mostrar valores en consola
      console.log("Valores del formulario:");
      console.log("nombre:", nombre);
      console.log("email_cliente:", email_cliente);
      console.log("fecha:", fecha);
      console.log("personas:", personas);
      console.log("menu:", menu);

      // Verificar elementos
      console.log("Elemento menuSelect existe:", document.getElementById("menuSelect"));
      console.log("Elemento personas existe:", document.getElementById("personas"));

      // Validación mínima con mensajes específicos
      if (!nombre) {
        showStatus("El nombre es requerido.", "error");
        resetButton(sendBtn);
        return;
      }
      
      if (!email_cliente) {
        showStatus("El correo electrónico es requerido.", "error");
        resetButton(sendBtn);
        return;
      }
      
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email_cliente)) {
        showStatus("Por favor ingresa un correo electrónico válido.", "error");
        resetButton(sendBtn);
        return;
      }
      
      if (!fecha) {
        showStatus("La fecha es requerida.", "error");
        resetButton(sendBtn);
        return;
      }
      
      // Validar que la fecha no sea en el pasado
      const fechaSeleccionada = new Date(fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaSeleccionada < hoy) {
        showStatus("La fecha no puede ser en el pasado.", "error");
        resetButton(sendBtn);
        return;
      }
      
      if (!personas) {
        showStatus("El número de personas es requerido.", "error");
        resetButton(sendBtn);
        return;
      }
      
      if (!menu) {
        showStatus("Debes seleccionar un menú.", "error");
        resetButton(sendBtn);
        return;
      }

      // Parámetros para EmailJS
      const templateParams = {
        nombre,
        email_cliente,
        fecha_hora: fecha,
        personas,
        menu
      };

      console.log("Enviando parámetros:", templateParams);

      // Enviar usando Service ID y Template ID correctos
      emailjs.send("service_od0ostg", "template_sttez4h", templateParams)
        .then(function (response) {
          console.log("Éxito:", response);
          showStatus("Reserva enviada con éxito. Te contactaremos pronto.", "success");
          sendBtn.textContent = "Enviado";
          setTimeout(() => {
            document.getElementById("reservationForm").reset();
            closeModal();
            resetButton(sendBtn);
          }, 1500);
        }, function (error) {
          console.error("Error completo:", error);
          console.error("Status:", error.status);
          console.error("Text:", error.text);
          
          let errorMessage = "Ocurrió un error al enviar. ";
          
          if (error.status === 422) {
            errorMessage += "Verifica tu configuración de EmailJS.";
          } else if (error.status === 400) {
            errorMessage += "Datos del formulario inválidos.";
          } else if (error.status === 401) {
            errorMessage += "Error de autenticación con EmailJS.";
          } else {
            errorMessage += "Intenta de nuevo más tarde.";
          }
          
          showStatus(errorMessage, "error");
          resetButton(sendBtn);
        });
    });

    function showStatus(msg, type) {
      const status = document.getElementById("statusMessage");
      status.textContent = msg;
      status.className = "status " + (type === "success" ? "success" : "error");
    }

    function resetButton(btn) {
      btn.disabled = false;
      btn.textContent = "Enviar reserva";
    }

    // Cerrar si se da clic fuera del modal
    document.getElementById("modalOverlay").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) closeModal();
    });