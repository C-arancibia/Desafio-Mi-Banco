// src/queries.js

import pool from './db';

async function registrarTransferencia(descripcion, fecha, monto, cuenta_origen, cuenta_destino) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Registrar la transferencia
        const queryInsert = {
            text: 'INSERT INTO transferencias (descripcion, fecha, monto, cuenta_origen, cuenta_destino) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            values: [descripcion, fecha, monto, cuenta_origen, cuenta_destino]
        };
        const resultInsert = await client.query(queryInsert);
        const nuevaTransferencia = resultInsert.rows[0];

        await client.query('COMMIT');

        console.log('Última transferencia registrada:', nuevaTransferencia);
        return nuevaTransferencia;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en registrarTransferencia:', error.message);
        throw error;
    } finally {
        client.release();
    }
}

async function consultarUltimasTransferencias(cuenta_destino, cantidad = 10) {
    const query = {
        text: 'SELECT * FROM transferencias WHERE cuenta_destino = $1 ORDER BY fecha DESC LIMIT $2',
        values: [cuenta_destino, cantidad]
    };

    const client = await pool.connect();
    try {
        const result = await client.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error en consultarUltimasTransferencias:', error.message);
        throw error;
    } finally {
        client.release();
    }
}

async function consultarSaldoCuenta(idCuenta) {
    const query = {
        text: 'SELECT saldo FROM cuentas WHERE id = $1',
        values: [idCuenta]
    };

    const client = await pool.connect();
    try {
        const result = await client.query(query);
        if (result.rows.length > 0) {
            return result.rows[0].saldo;
        } else {
            throw new Error(`No se encontró la cuenta con ID ${idCuenta}`);
        }
    } catch (error) {
        console.error('Error en consultarSaldoCuenta:', error.message);
        throw error;
    } finally {
        client.release();
    }
}

export { registrarTransferencia, consultarUltimasTransferencias, consultarSaldoCuenta };
