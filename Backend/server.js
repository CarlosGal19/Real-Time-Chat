import express from 'express';
import logger from 'morgan';

import { Server } from 'socket.io';
import { createServer } from 'node:http'

const app = express();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    },
    connectionStateRecovery: {}
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
    socket.on('client-message', (msg) => {
        console.log('Client message: ' + msg);
        io.emit('server-message', 'Server response');
    });
});

app.use(logger('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send({msg: 'Hello World'});
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
