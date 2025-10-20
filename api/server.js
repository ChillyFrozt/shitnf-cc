const { exec } = require('child_process');
const fs = require('fs');
const path = './db.json';

// Función que actualiza los IDs de inquilinos a secuenciales
const updateIds = () => {
    let db = JSON.parse(fs.readFileSync(path, 'utf-8'));

    // Asignar un ID numérico secuencial a cada inquilino
    db.tenants.forEach((tenant, index) => {
        if (typeof tenant.id !== 'number') {
            tenant.id = index + 1; // Comienza desde 1
        }
    });

    // Escribir el archivo db.json con los IDs actualizados
    fs.writeFileSync(path, JSON.stringify(db, null, 2), 'utf-8');
    console.log('IDs actualizados a números consecutivos');
};

// Ejecutar json-server usando npx
const startJsonServer = () => {
    exec('npx json-server --watch db.json --port 3001', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error ejecutando json-server: ${stderr}`);
            return;
        }
        console.log(`json-server está corriendo en: http://localhost:3001`);
    });
};

// Middleware para escuchar cambios en el archivo db.json
const fsWatcher = fs.watch(path, (eventType, filename) => {
    if (filename && eventType === 'change') {
        console.log(`${filename} ha cambiado. Ejecutando actualización de IDs.`);
        updateIds(); // Actualizar IDs si hay un cambio
    }
});

// Iniciar el servidor
startJsonServer();

