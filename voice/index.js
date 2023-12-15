const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const OpusScript = require("opusscript");
const sodium = require("libsodium")
const { Server } = require("socket.io");
const io = new Server(server);

const lobbyDefault = new Set();
const lobbyGame = new Set();



app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    lobbyDefault.add(socket.id);
  
    socket.on('joinGame', () => {
      lobbyDefault.delete(socket.id);
      lobbyGame.add(socket.id);

      // Gérez ici la logique de connexion au jeu
    });
  
    socket.on('leaveGame', () => {
      lobbyGame.delete(socket.id);
      lobbyDefault.add(socket.id);

      // Gérez ici la logique de déconnexion du jeu
    });
  
    // Créez un encodeur Opus
    const encoder = new OpusScript(48000, 2);

    socket.on('audioMessage', (audioData) => {
        // Encodez l'audio avec Opus
        const encoded = encoder.encode(audioData);

        lobbyGame.forEach((clientId) => {
        if (clientId !== socket.id) {
            io.to(clientId).emit('receiveAudio', encoded);
        }
        });
    });


    socket.on('disconnect', () => {
      lobbyDefault.delete(socket.id);
      lobbyGame.delete(socket.id);
    });
  });


server.listen(28469, () => {
  console.log('listening on *:28469');
});

