// =========================================================
// KOENIGSEGG - Interactividad
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  initMenuMovil();
  initFiltrosModelos();
  initLinkActivo();
  initAparicionSecciones();
});

// ---------------------------------------------------------
// 1. Menú hamburguesa (móvil)
// ---------------------------------------------------------
function initMenuMovil() {
  const boton = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".main-nav");
  if (!boton || !menu) return;

  const cerrarMenu = () => {
    menu.classList.remove("open");
    boton.setAttribute("aria-expanded", "false");
    boton.textContent = "☰";
  };

  boton.addEventListener("click", () => {
    const abierto = menu.classList.toggle("open");
    boton.setAttribute("aria-expanded", String(abierto));
    boton.textContent = abierto ? "✕" : "☰";
  });

  // Cierra el menú al tocar un enlace
  menu.querySelectorAll("a").forEach((enlace) => {
    enlace.addEventListener("click", cerrarMenu);
  });

  // Cierra el menú con la tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarMenu();
  });

  // Si se agranda la pantalla, deja el menú en estado limpio
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) cerrarMenu();
  });
}

// ---------------------------------------------------------
// 2. Filtros de modelos por serie
// ---------------------------------------------------------
function initFiltrosModelos() {
  const botones = document.querySelectorAll(".filtro");
  const tarjetas = document.querySelectorAll(".modelo-card");
  if (!botones.length || !tarjetas.length) return;

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const filtro = boton.dataset.filtro;

      // Marca el botón activo
      botones.forEach((b) => b.classList.remove("active"));
      boton.classList.add("active");

      // Muestra u oculta tarjetas según su serie
      tarjetas.forEach((tarjeta) => {
        const coincide = filtro === "todos" || tarjeta.dataset.serie === filtro;
        tarjeta.classList.toggle("oculto", !coincide);
      });
    });
  });
}

// ---------------------------------------------------------
// 3. Resalta en el menú la sección que se está viendo
// ---------------------------------------------------------
function initLinkActivo() {
  const secciones = document.querySelectorAll("main section[id]");
  const enlaces = document.querySelectorAll(".main-nav a");
  if (!secciones.length || !enlaces.length || !("IntersectionObserver" in window)) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        enlaces.forEach((enlace) => {
          const activo = enlace.getAttribute("href") === `#${entrada.target.id}`;
          enlace.style.color = activo ? "var(--accent)" : "";
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  secciones.forEach((seccion) => observador.observe(seccion));
}

// ---------------------------------------------------------
// 4. Las secciones aparecen suavemente al hacer scroll
// ---------------------------------------------------------
function initAparicionSecciones() {
  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducirMovimiento || !("IntersectionObserver" in window)) return;

  const secciones = document.querySelectorAll(".section");

  secciones.forEach((seccion) => {
    seccion.style.opacity = "0";
    seccion.style.transform = "translateY(40px)";
    seccion.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  });

  const observador = new IntersectionObserver(
    (entradas, obs) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.style.opacity = "1";
        entrada.target.style.transform = "translateY(0)";
        obs.unobserve(entrada.target); // solo anima la primera vez
      });
    },
    { threshold: 0.08 }
  );

  secciones.forEach((seccion) => observador.observe(seccion));
}
