// auth.js
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    alert("Debe iniciar sesión");
    location.href = "login.html";
}

// Si NO es admin → bloquear edición y eliminación
if (user.role !== "admin") {
    document.querySelectorAll(".btn-danger, .btn-primary[data-action='edit']").forEach(btn => {
        btn.style.display = "none";
    });

    const form = document.querySelector("form");
    if (form) {
        form.style.display = "none"; // El usuario solo puede ver
    }
}
