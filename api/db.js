const fs = require('fs');
const path = './db.json';

// Leer la base de datos (si ya existe)
let db = JSON.parse(fs.readFileSync(path, 'utf-8'));

// Asignar un ID numérico secuencial a cada inquilino, manteniendo los existentes
db.tenants.forEach((tenant, index) => {
    // Si el tenant no tiene un id numérico, asignar uno
    if (typeof tenant.id !== 'number') {
        tenant.id = index + 1; // Comienza desde 1
    }
});

// Escribir el archivo db.json con los IDs actualizados
fs.writeFileSync(path, JSON.stringify(db, null, 2), 'utf-8');

console.log('IDs actualizados a números consecutivos');

