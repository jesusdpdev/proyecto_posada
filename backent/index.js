const express = require('express');
const cors = require('cors');
const pool = require('./db'); 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

process.on('uncaughtException', (err) => {
    console.error('❌ uncaughtException:', err);
});

process.on('unhandledRejection', (reason) => {
    console.error('❌ unhandledRejection:', reason);
});

// --- 1. RUTA DE LOGIN (CON REGISTRO DE AUDITORÍA) ---
app.post('/login', async (req, res) => {
    const { usuario, clave } = req.body;
    try {
        // Buscamos al usuario
        const queryBusqueda = 'SELECT * FROM usuarios WHERE usuario = $1 AND clave = $2';
        const resultado = await pool.query(queryBusqueda, [usuario, clave]);

        if (resultado.rows.length > 0) {
            const user = resultado.rows[0];

            // --- BLOQUE DE REGISTRO DE ACCESO ---
            // Insertamos en la nueva tabla quién entró. 
            // La fecha se pone sola gracias al DEFAULT CURRENT_TIMESTAMP
            const queryLog = `
                INSERT INTO registros_acceso (usuario_id, nombre_usuario) 
                VALUES ($1, $2)
            `;
            await pool.query(queryLog, [user.id, user.nombre]);
            // ------------------------------------

            console.log(`✅ Acceso registrado: ${user.nombre} ha iniciado sesión.`);

            res.json({
                success: true,
                id_usuario: user.id,
                rol: user.rol,
                nombre: user.nombre
            });
        } else {
            res.json({ success: false, mensaje: "Usuario o clave incorrectos" });
        }
    } catch (err) {
        console.error("Error en Login:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 2. RUTA PARA VER LOS INGRESOS RECIENTES (EL WHERE QUE PEDISTE) ---
app.get('/historial-accesos', async (req, res) => {
    try {
        // Traemos los últimos 20 ingresos, ordenados por los más recientes
        const query = `
            SELECT id, nombre_usuario, TO_CHAR(fecha_hora, 'DD/MM/YYYY HH:MI:SS AM') as fecha_formateada
            FROM registros_acceso 
            ORDER BY fecha_hora DESC 
            LIMIT 20
        `;
        const resultado = await pool.query(query);
        res.json({ 
            success: true, 
            datos: resultado.rows 
        });
    } catch (error) {
        console.error("Error en Historial:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- 3. REGISTRO DE GASTOS (Luz y Agua) ---
app.post('/registrogasto', async (req, res) => {
    try {
        const { tipo, lectura_valor, registrado_por } = req.body;
        const query = `
            INSERT INTO consumos_recursos (tipo, lectura_valor, fecha_registro, registrado_por) 
            VALUES ($1, $2, NOW(), $3)
        `;
        await pool.query(query, [tipo, lectura_valor, registrado_por]);
        res.status(201).json({ success: true, mensaje: 'Gasto registrado con éxito' });
    } catch (error) {
        console.error("Error en Registro:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- 4. LISTADO DE GASTOS ---
app.post('/listagastos', async (req, res) => {
    try {
        const query = `
            SELECT 
                c.id, 
                c.tipo, 
                c.lectura_valor, 
                TO_CHAR(c.fecha_registro, 'DD/MM/YYYY HH:MI AM') as fecha_lista,
                u.nombre 
            FROM consumos_recursos c
            JOIN usuarios u ON c.registrado_por = u.id
            ORDER BY c.fecha_registro DESC
            LIMIT 30
        `;
        const resultado = await pool.query(query);
        res.json({ 
            success: true, 
            datos: resultado.rows 
        });
    } catch (error) {
        console.error("Error en ListaGastos:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- 5. VERIFICAR ÚLTIMA FECHA ---
app.post('/verificarfecha', async (req, res) => {
    try {
        const query = `
            SELECT tipo, MAX(fecha_registro) as ultima_fecha
            FROM consumos_recursos
            GROUP BY tipo
        `;
        const resultado = await pool.query(query);
        res.json({ 
            success: true, 
            datos: resultado.rows 
        });
    } catch (error) {
        console.error("Error en VerificarFecha:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- 6. RUTA PARA CREAR NUEVOS USUARIOS ---
app.post('/crearusuario', async (req, res) => {
    const { nombre, usuario, clave, rol } = req.body;

    if (!nombre || !usuario || !clave || !rol) {
        return res.status(400).json({ 
            success: false, 
            mensaje: "Faltan datos obligatorios para el registro." 
        });
    }

    try {
        const existeUser = await pool.query('SELECT id FROM usuarios WHERE usuario = $1', [usuario]);
        
        if (existeUser.rows.length > 0) {
            return res.json({ 
                success: false, 
                mensaje: "El nombre de usuario ya está en uso. Intenta con otro." 
            });
        }

        const query = `
            INSERT INTO usuarios (nombre, usuario, clave, rol) 
            VALUES ($1, $2, $3, $4)
        `;
        
        await pool.query(query, [nombre, usuario, clave, rol]);

        res.status(201).json({ 
            success: true, 
            mensaje: "¡Usuario registrado con éxito!" 
        });

    } catch (err) {
        console.error("Error al crear usuario:", err.message);
        res.status(500).json({ 
            success: false, 
            mensaje: "Error interno en el servidor de la posada." 
        });
    }
});

// --- 7. RUTA PARA OBTENER LISTA DE USUARIOS (SIN CLAVE) ---
app.get('/listausuarios', async (req, res) => {
    try {
        const query = 'SELECT id, nombre, usuario, rol FROM usuarios ORDER BY id DESC';
        const resultado = await pool.query(query);
        res.json({
            success: true,
            datos: resultado.rows
        });
    } catch (error) {
        console.error("Error en ListaUsuarios:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Configuración del puerto y arranque
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`
==========================================
🚀 Servidor del Software Informático Corriendo
📍 URL Local: http://localhost:${PORT}
📍 Red Local: http://192.168.0.108:${PORT}
==========================================
    `);
});

server.on('error', (err) => {
    console.error('❌ Error en el servidor HTTP:', err);
});

process.on('SIGINT', () => {
    console.warn('⚠️ Señal SIGINT recibida, cerrando servidor...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.warn('⚠️ Señal SIGTERM recibida, cerrando servidor...');
    process.exit(0);
});

process.on('exit', (code) => {
    console.log('⚠️ Proceso Node terminado con código:', code);
});
