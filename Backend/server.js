import express from 'express';
import logger from 'morgan';
import { configDotenv } from 'dotenv';
import { createClient } from '@libsql/client';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

const app = express();
const server = createServer(app);

configDotenv();

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    },
    connectionStateRecovery: {}
});

const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

// Función para crear la tabla de mensajes si no existe
async function initializeDatabase() {
    try {
        console.log('Creando tabla de mensajes...');
        console.log(db);
        await db.execute(`
            CREATE TABLE IF NOT EXISTS messages(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL
            )
        `);
        console.log('Tabla de mensajes creada o ya existe');
    } catch (error) {
        console.error('Error al crear la tabla de mensajes:', error);
        if (error.code === 'SERVER_ERROR' && error.cause && error.cause.status === 401) {
            console.error('Error de autenticación: Verifica las credenciales y permisos en el servidor de la base de datos.');
        }
    }
}

// Llamar a la función de inicialización de la base de datos
initializeDatabase();

io.on('connection', async (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
    socket.on('client-message', async (msg) => {
        let result;
        try {
            result = await db.execute({
                sql: `INSERT INTO messages(content) VALUES(:content)`,
                args: {
                    content: msg
                }
            });
            io.emit('server-message', msg, result.lastInsertRowid.toString());
        } catch (error) {
            console.error('Error al insertar mensaje:', error);
            if (error.code === 'SERVER_ERROR' && error.cause && error.cause.status === 401) {
                console.error('Error de autenticación: Verifica las credenciales y permisos en el servidor de la base de datos.');
            }
        }
    });
    if(!socket.recovered){
        try {
            const results = await db.execute({
                sql: `SELECT * FROM messages WHERE id > ?`,
                args: [socket.handshake.auth.serverOffset ?? 0]
            })

            results.rows.forEach(row => {
                socket.emit('server-message', row.content, row.id.toString())
            });

        } catch (error) {
            console.log(error);
            return;
        }
    }
});

app.use(logger('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send({ msg: 'Hello World' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
