    // Inicializa EmailJS:
    emailjs.init("service_od0ostg");

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

    // Envío
    document.getElementById("reservationForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const sendBtn = document.getElementById("sendBtn");
      sendBtn.disabled = true;
      sendBtn.textContent = "EnviandooOOO.";

      // Recolectar datos
      const nombre = document.getElementById("nombre").value.trim();
      const email_cliente = document.getElementById("email_cliente").value.trim();
      const fecha_hora = document.getElementById("fecha_hora").value;
      const personas = document.getElementById("personas").value;
      const menu = document.getElementById("menu").value;

      // Validación mínima
      if (!nombre || !email_cliente || !fecha_hora || !personas || !menu) {
        showStatus("Por favor completa todos los campos.", "error");
        sendBtn.disabled = false;
        sendBtn.textContent = "Enviar reserva";
        return;
      }

      // Preparar parámetros para la plantilla en EmailJS
      const templateParams = {
        nombre,
        email_cliente,
        fecha_hora,
        personas,
        menu
      };

      emailjs.send("service_od0ostg", "template_sttez4h", templateParams)
        .then(function(response) {
          showStatus("Reserva enviada con éxito. Te contactaremos pronto para confirmar.", "success");
          sendBtn.textContent = "Enviado";
          // opcional: limpiar formulario tras unos segundos
          setTimeout(() => {
            document.getElementById("reservationForm").reset();
            closeModal();
            sendBtn.disabled = false;
            sendBtn.textContent = "Enviar reserva";
          }, 1500);
        }, function(error) {
          console.error("Fallo envío:", error);
          showStatus("Ocurrió un error al enviar. Intenta de nuevo más tarde.", "error");
          sendBtn.disabled = false;
          sendBtn.textContent = "Enviar reserva";
        });
    });

    function showStatus(msg, type) {
      const status = document.getElementById("statusMessage");
      status.textContent = msg;
      status.className = "status " + (type === "success" ? "success" : "error");
    }

    // Cerrar si se da clic fuera del modal
    document.getElementById("modalOverlay").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) closeModal();
    });