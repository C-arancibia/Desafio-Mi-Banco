// src/index.js

import dotenv from 'dotenv';
import { registrarTransferencia, consultarUltimasTransferencias, consultarSaldoCuenta } from './queries';

dotenv.config(); // Cargar variables de entorno desde .env si es necesario

async function iniciarApp() {
    try {
        // Ejemplo de registro de transferencia
        const nuevaTransferencia = await registrarTransferencia('Compra', '2023-06-30', 5000, 1, 2);

        // Ejemplo de consulta de últimas transferencias de una cuenta
        const ultimasTransferencias = await consultarUltimasTransferencias(2);
        console.log('Últimas transferencias:', ultimasTransferencias);

        // Ejemplo de consulta de saldo de una cuenta
        const saldoCuenta = await consultarSaldoCuenta(1);
        console.log(`Saldo de la cuenta 1: $${saldoCuenta}`);
    } catch (error) {
        console.error('Error en la aplicación:', error.message);
    }
}

iniciarApp();

