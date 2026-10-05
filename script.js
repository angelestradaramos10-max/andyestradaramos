const STORAGE_KEY = "andy_portafolio_actividades_v1";
const SESSION_KEY = "andy_portafolio_admin";

const defaults = [
  {
    id: crypto.randomUUID(),
    course: "Algoritmos",
    unit: "1",
    week: "1",
    date: "2026-09-01",
    title: "Actividad de introducción a algoritmos",
    description: "Desarrollo de ejercicios básicos usando lógica secuencial, variables y estructura de solución.",
    link: "",
    files: []
  },
  {
    id: crypto.randomUUID(),
    course: "Aplicaciones",
    unit: "1",
    week: "2",
    date: "2026-09-08",
    title: "Diseño de interfaz web académica",
    description: "Creación de una ventana web organizada con estilos CSS, estructura HTML y diseño responsive.",
    link: "",
    files: []
  }
];

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

let activities = loadActivities();
let pendingFiles = [];

function loadActivities() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(saved);
}

function saveActivities() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
}

function fillWeeks() {
  const weekInput = $("#weekInput");
  weekInput.innerHTML = "";
  for (let i = 1; i <= 16; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `Semana ${i}`;
    weekInput.appendChild(option);
  }
}

function renderActivities() {
  const grid = $("#activityGrid");
  const empty = $("#emptyState");
  const course = $("#courseFilter").value;
  const search = $("#searchInput").value.toLowerCase().trim();
  const filtered = activities.filter(item => {
    const byCourse = course === "todos" || item.course === course;
    const bySearch = item.title.toLowerCase().includes(search) || item.description.toLowerCase().includes(search);
    return byCourse && bySearch;
  });

  grid.innerHTML = "";
  empty.style.display = filtered.length ? "none" : "block";
  $("#totalActivities").textContent = activities.length;

  filtered
    .sort((a, b) => Number(a.week) - Number(b.week))
    .forEach(item => {
      const card = document.createElement("article");
      card.className = "activityCard reveal visible";
      card.innerHTML = `
        <div class="activityMeta">
          <span>${item.course}</span>
          <span>Unidad ${item.unit}</span>
          <span>Semana ${item.week}</span>
          <span>${formatDate(item.date)}</span>
        </div>
        <h3>${escapeHTML(item.title)}</h3>
        <p>${escapeHTML(item.description)}</p>
        <div class="chips">${item.files.map(file => `<span>${escapeHTML(file.name)}</span>`).join("")}</div>
        <div class="cardActions">
          <button onclick="openPreview('${item.id}')">Ver detalles</button>
          ${item.link ? `<a href="${escapeAttribute(item.link)}" target="_blank" rel="noopener">Abrir enlace</a>` : ""}
        </div>
      `;
      grid.appendChild(card);
    });
}

function renderAdminList() {
  const list = $("#adminActivities");
  list.innerHTML = "";

  if (!activities.length) {
    list.innerHTML = `<p class="hint">Todavía no hay actividades guardadas.</p>`;
    return;
  }

  activities.forEach(item => {
    const row = document.createElement("div");
    row.className = "adminItem";
    row.innerHTML = `
      <div>
        <strong>${escapeHTML(item.title)}</strong>
        <p class="hint">${item.course} | Unidad ${item.unit} | Semana ${item.week}</p>
      </div>
      <div class="cardActions">
        <button onclick="editActivity('${item.id}')">Editar</button>
        <button class="danger" onclick="deleteActivity('${item.id}')">Eliminar</button>
      </div>
    `;
    list.appendChild(row);
  });
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text || "";
  return div.innerHTML;
}

function escapeAttribute(text) {
  return String(text || "").replaceAll('"', "&quot;");
}

function openModal(id) {
  $(`#${id}`).classList.add("show");
}

function closeModal(id) {
  $(`#${id}`).classList.remove("show");
}

function openAdmin() {
  if (sessionStorage.getItem(SESSION_KEY) === "true") {
    openModal("adminModal");
    renderAdminList();
  } else {
    openModal("loginModal");
  }
}

function clearForm() {
  $("#activityForm").reset();
  $("#editId").value = "";
  pendingFiles = [];
  $("#selectedFiles").innerHTML = "";
  $("#saveBtn").textContent = "Guardar actividad";
}

function fileToData(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      name: file.name,
      type: file.type,
      data: reader.result
    });
    reader.readAsDataURL(file);
  });
}

async function handleFiles(event) {
  const files = Array.from(event.target.files);
  const converted = await Promise.all(files.map(fileToData));
  pendingFiles = [...pendingFiles, ...converted];
  renderSelectedFiles();
  event.target.value = "";
}

function renderSelectedFiles() {
  $("#selectedFiles").innerHTML = pendingFiles.map((file, index) => `
    <button type="button" class="filePill" onclick="removePendingFile(${index})">${escapeHTML(file.name)} ×</button>
  `).join("");
}

function removePendingFile(index) {
  pendingFiles.splice(index, 1);
  renderSelectedFiles();
}

function saveActivity(event) {
  event.preventDefault();
  const id = $("#editId").value || crypto.randomUUID();
  const previous = activities.find(item => item.id === id);
  const activity = {
    id,
    course: $("#courseInput").value,
    unit: $("#unitInput").value,
    week: $("#weekInput").value,
    date: $("#dateInput").value,
    title: $("#titleInput").value.trim(),
    description: $("#descriptionInput").value.trim(),
    link: $("#linkInput").value.trim(),
    files: pendingFiles.length ? pendingFiles : (previous?.files || [])
  };

  if (previous) {
    activities = activities.map(item => item.id === id ? activity : item);
  } else {
    activities.push(activity);
  }

  saveActivities();
  clearForm();
  renderActivities();
  renderAdminList();
}

function editActivity(id) {
  const item = activities.find(activity => activity.id === id);
  if (!item) return;
  $("#editId").value = item.id;
  $("#courseInput").value = item.course;
  $("#unitInput").value = item.unit;
  $("#weekInput").value = item.week;
  $("#dateInput").value = item.date;
  $("#titleInput").value = item.title;
  $("#descriptionInput").value = item.description;
  $("#linkInput").value = item.link || "";
  pendingFiles = [...item.files];
  renderSelectedFiles();
  $("#saveBtn").textContent = "Actualizar actividad";
}

function deleteActivity(id) {
  const confirmDelete = confirm("¿Deseas eliminar esta actividad?");
  if (!confirmDelete) return;
  activities = activities.filter(activity => activity.id !== id);
  saveActivities();
  renderActivities();
  renderAdminList();
}

function openPreview(id) {
  const item = activities.find(activity => activity.id === id);
  if (!item) return;
  const files = item.files.map(file => {
    if (file.type.startsWith("image/")) {
      return `<img src="${file.data}" alt="${escapeAttribute(file.name)}">`;
    }
    return `<a class="filePill" href="${file.data}" download="${escapeAttribute(file.name)}">${escapeHTML(file.name)}</a>`;
  }).join("");

  $("#previewContent").innerHTML = `
    <div class="activityMeta">
      <span>${item.course}</span>
      <span>Unidad ${item.unit}</span>
      <span>Semana ${item.week}</span>
      <span>${formatDate(item.date)}</span>
    </div>
    <h2>${escapeHTML(item.title)}</h2>
    <p>${escapeHTML(item.description)}</p>
    ${item.link ? `<p><a class="filePill" href="${escapeAttribute(item.link)}" target="_blank" rel="noopener">Abrir enlace externo</a></p>` : ""}
    <div class="previewFiles">${files || `<p class="hint">Esta actividad no tiene archivos adjuntos.</p>`}</div>
  `;
  openModal("previewModal");
}

function bindEvents() {
  $("#openLogin").addEventListener("click", openAdmin);
  $("#quickAdmin").addEventListener("click", openAdmin);
  $("#courseFilter").addEventListener("change", renderActivities);
  $("#searchInput").addEventListener("input", renderActivities);
  $("#activityForm").addEventListener("submit", saveActivity);
  $("#fileInput").addEventListener("change", handleFiles);
  $("#resetForm").addEventListener("click", clearForm);
  $("#logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    closeModal("adminModal");
  });

  $("#loginForm").addEventListener("submit", event => {
    event.preventDefault();
    if ($("#userInput").value === "admin" && $("#passInput").value === "12345") {
      sessionStorage.setItem(SESSION_KEY, "true");
      closeModal("loginModal");
      openModal("adminModal");
      renderAdminList();
      $("#loginForm").reset();
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  });

  $$(".close").forEach(button => {
    button.addEventListener("click", () => closeModal(button.dataset.close));
  });

  $$(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      $$(".tab").forEach(item => item.classList.remove("active"));
      tab.classList.add("active");
      $("#courseFilter").value = tab.dataset.course;
      renderActivities();
    });
  });

  $$(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target === modal) modal.classList.remove("show");
    });
  });
}

function initRevealAnimations() {
  const revealItems = $$(".reveal");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach(item => observer.observe(item));
}

fillWeeks();
bindEvents();
initRevealAnimations();
renderActivities();
