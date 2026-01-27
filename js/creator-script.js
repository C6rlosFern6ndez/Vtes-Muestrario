document.addEventListener("DOMContentLoaded", () => {
  const vtesCard = document.getElementById("vtesCard");

  // Inputs
  const inputName = document.getElementById("inputName");
  const inputText = document.getElementById("inputText");
  const inputCapacidad = document.getElementById("inputCapacidad");
  const inputImage = document.getElementById("inputImage");
  const selectClan = document.getElementById("selectClan");
  const inputGrupo = document.getElementById("selectGrupo");
  const cardCrypt = document.getElementById("cardCrypt");
  const selectDisciplina = document.getElementById("selectDisciplina");
  const imageSize = document.getElementById("imageSize");
  const fontSizeInput = document.getElementById("fontSize");

  // Elementos de la carta
  const cardName = document.getElementById("cardName");
  const cardText = document.getElementById("cardText");
  const capacityValue = document.getElementById("capacityValue");
  const cardClan = document.getElementById("cardClan");
  const cardIllustration = document.getElementById("cardIllustration");
  const disciplinesContainer = document.getElementById("disciplinesContainer");

  // Sincronizar Texto y Nombre
  inputName.addEventListener(
    "input",
    (e) => (cardName.textContent = e.target.value),
  );
  // inputText.addEventListener(
  //   "input",
  //   (e) => (cardText.textContent = e.target.value),
  // );
  inputText.addEventListener("input", (e) => {
    // Usamos innerHTML en lugar de textContent
    cardText.innerHTML = e.target.value.replace(/\n/g, "<br>");
  });

  fontSizeInput.addEventListener("input", (e) => {
    cardText.style.fontSize = `${e.target.value}px`;
  });
  
  inputCapacidad.addEventListener(
    "input",
    (e) => (capacityValue.textContent = e.target.value),
  );

  // Cambiar Clan
  selectClan.addEventListener("change", (e) => {
    cardClan.src = `Imagenes/iconos/Clan/${e.target.value}`;
  });

  // Añadir Disciplinas (una encima de otra)
  selectDisciplina.addEventListener("change", (e) => {
    if (!e.target.value) return;

    const img = document.createElement("img");
    img.src = `Imagenes/iconos/Disciplina/${e.target.value}`;
    img.alt = "Disciplina";

    disciplinesContainer.appendChild(img);
    e.target.value = ""; // Reset select
  });

  document
    .getElementById("btnClearDisciplines")
    .addEventListener("click", () => {
      disciplinesContainer.innerHTML = "";
    });

  // Manejar Imagen de fondo
  inputImage.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        cardIllustration.style.backgroundImage = `url('${event.target.result}')`;
      };
      reader.readAsDataURL(file);
    }
  });

  imageSize.addEventListener("input", (e) => {
    cardIllustration.style.backgroundSize = `${e.target.value}%`;
  });

  // Actualizar el número del grupo en tiempo real
  inputGrupo.addEventListener("change", (e) => {
    cardCrypt.textContent = e.target.value;
  });

  // Función de Descarga
  document.getElementById("btnDownload").addEventListener("click", () => {
    html2canvas(vtesCard, {
      useCORS: true, // Para permitir imágenes externas si las hubiera
      scale: 2, // Mayor calidad
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `vtes-card-${inputName.value || "vampiro"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  });
});
