document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // --- Botón Iniciar/Cerrar Sesión ---
    const loginBtn = document.querySelector(".navbar__button");
    if (loginBtn) {
        if (user) {
            loginBtn.textContent = "Cerrar Sesión";
            loginBtn.removeAttribute("href");
            loginBtn.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("user");
                alert("Sesión cerrada");
                location.href = "login.html";
            });
        } else {
            loginBtn.textContent = "Iniciar Sesión";
            loginBtn.setAttribute("href", "login.html");
        }
    }

    // --- Ocultar botón grande en HOME si hay sesión ---
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "home.html") {
        const mainBtn = document.querySelector(".main_btn");
        if (mainBtn) {
            mainBtn.style.display = user ? "none" : "inline-block";
        }
    }

    // --- Si no hay sesión: convertir botones en accesos al login ---
    const publicPages = new Set(["home.html", "login.html", "signup.html"]);
    if (!user && !publicPages.has(currentPage)) {
        console.log("Sin sesión: ajustando botones para redirigir a login");

        document.querySelectorAll("button, a, .btn").forEach(el => {
            // Evita alterar navbar o footer
            if (!el.closest("nav") && !el.closest(".footer_container")) {
                if (el.tagName === "A") {
                    el.setAttribute("href", "login.html");
                } else {
                    el.addEventListener("click", e => {
                        e.preventDefault();
                        alert("Debe iniciar sesión para usar esta función.");
                        location.href = "login.html";
                    });
                }
            }
        });
    }

    // --- Si NO es admin → bloquear edición/eliminación ---
    if (user && user.role !== "admin") {
        // Oculta botones de mutación
        document.querySelectorAll(".btn-danger, .btn-primary[data-action='edit'], [data-action='del']").forEach(btn => {
            btn.style.display = "none";
        });

        // Deshabilita formularios de creación/edición (deja buscadores)
        document.querySelectorAll("form").forEach(f => {
            if (!/formBuscador/i.test(f.id)) {
                f.style.display = "none";
            }
        });

        // Bloquea clicks de eliminar
        document.addEventListener("click", (e) => {
            const danger = e.target.closest('[data-action="del"], .btn-danger');
            if (danger) {
                e.stopPropagation();
                e.preventDefault();
                alert("Solo el administrador puede eliminar o modificar datos.");
            }
        }, true);

        // Bloquea mutaciones por fetch
        const originalFetch = window.fetch.bind(window);
        window.fetch = (input, init = {}) => {
            const method = (init && init.method ? init.method : "GET").toUpperCase();
            if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
                return Promise.reject(new Error("Solo el administrador puede modificar datos."));
            }
            return originalFetch(input, init);
        };
    }
});




