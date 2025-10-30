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

    // --- Redirección si no hay sesión (excepto login/signup)
    const path = window.location.pathname;
    const isAuthPage = path.endsWith("login.html") || path.endsWith("signup.html");
    if (!user && !isAuthPage) {
        alert("Debe iniciar sesión para acceder.");
        location.href = "login.html";
        return;
    }

    // --- Si NO es admin → bloquear edición/eliminación en TODA la app ---
    if (user && user.role !== "admin") {
        // 2.1 Oculta botones típicos de mutación si existieran en la página
        document.querySelectorAll(".btn-danger, .btn-primary[data-action='edit'], [data-action='del']").forEach(btn => {
            btn.style.display = "none";
        });

        // 2.2 Deshabilita formularios de creación/edición (deja buscadores)
        document.querySelectorAll("form").forEach(f => {
            if (!/formBuscador/i.test(f.id)) {
                f.style.display = "none";
            }
        });

        // 2.3 Captura clicks a nivel captura para frenar cualquier botón de eliminar que se escape
        document.addEventListener("click", (e) => {
            const danger = e.target.closest('[data-action="del"], .btn-danger');
            if (danger) {
                e.stopPropagation();
                e.preventDefault();
                alert("Solo el administrador puede eliminar o modificar datos.");
            }
        }, true);

        // 2.4 Capa dura: envuelve fetch para impedir POST/PUT/PATCH/DELETE
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


