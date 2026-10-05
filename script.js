// ===== Edita aquí tus actividades publicadas =====
const PROYECTOS = [
  // { curso: "Algoritmos", titulo: "Semana 1 - Ejercicios", descripcion: "Resumen breve", url: "archivos/semana1.pdf" }
];
// =================================================
const $ = s => document.querySelector(s);
let curso = "Algoritmos", filtro = "Todos";

function renderUnits(){
  $("#courseTitle").textContent = `${curso} · 4 unidades`;
  $("#units").innerHTML = [1,2,3,4].map(u => `
    <div class="unit"><h3>Unidad ${u}</h3>
    <ul>${[1,2,3,4].map(i => `<li>Semana ${(u-1)*4+i}<i>Pendiente</i></li>`).join("")}</ul></div>`).join("");
}
function renderProjects(){
  const list = PROYECTOS.filter(p => filtro === "Todos" || p.curso === filtro);
  $("#count").textContent = list.length;
  $("#projects").innerHTML = list.length ? list.map(p => `
    <div class="card proj"><small>${p.curso}</small><h3>${p.titulo}</h3><p>${p.descripcion||""}</p>
    <a href="${p.url}" target="_blank" rel="noopener">Abrir / descargar →</a></div>`).join("")
    : `<div class="empty">Aún no hay actividades publicadas.</div>`;
}
function tabs(sel, attr, cb){
  $(sel).addEventListener("click", e => {
    const b = e.target.closest("button"); if(!b) return;
    $(sel).querySelectorAll("button").forEach(x => x.classList.remove("active"));
    b.classList.add("active"); cb(b.dataset[attr]);
  });
}
tabs("#courseTabs","c", v => { curso = v; renderUnits(); });
tabs("#filterTabs","f", v => { filtro = v; renderProjects(); });
$("#burger").onclick = () => $("#menu").classList.toggle("open");
$("#menu").onclick = () => $("#menu").classList.remove("open");
$("#openLogin").onclick = () => $("#modal").classList.add("open");
$("#closeLogin").onclick = () => $("#modal").classList.remove("open");
$("#modal").onclick = e => { if(e.target.id === "modal") $("#modal").classList.remove("open"); };
renderUnits(); renderProjects();
