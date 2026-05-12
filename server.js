const next = require("next");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

//const dev = process.env.NODE_ENV !== "production";

//const dev = true;  PARA (NPM RUN DEV)
//const dev = false; PARA (NPM START DEPOIS DO NPM RUN BUILD)


const dev = true;

const nextApp = next({ dev, hostname: "0.0.0.0", port: 3000 });

const handler = nextApp.getRequestHandler();

const app = express();

const server = http.createServer((req, res) => {
    handler(req, res);
});

const rooms = {};

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const io = new Server(server, {
    cors: { origin: "*" }
});

io.on("connection", (socket) => {
    console.log("Usuário conectado:", socket.id);

    
    socket.on("disconnect", () => {

    console.log("Usuário desconectado:", socket.id);

    for (const roomCode in rooms){

        const room = rooms[roomCode];

        const playerIndex = room.players.findIndex(
            player => player.socketId === socket.id
        );

        if (playerIndex !== -1){

            room.players.splice(playerIndex, 1);

            console.log("Player removido da sala:", roomCode);

            io.to(roomCode).emit("player-left", {
                message: "Jogador saiu da sala"
            });

            if (room.players.length === 0){
                delete rooms[roomCode];
                console.log("Sala removida:", roomCode);
            }

            break;
        }

    }

});


    socket.on("start-game", (data) => {

        const { roomCode, quiz } = data;
        const room = rooms[roomCode];
        if (!room){
            return;
        }
        room.quiz = quiz;
        room.currentQuestion = 0;
        room.started = true;
        console.log("Partida iniciada:", roomCode);
        io.to(roomCode).emit("started-game", {
            roomCode
        });

        const question = room.quiz.questions[0];
        setTimeout(() => {
            io.to(roomCode).emit("next-question", {
                question,
                questions: room.quiz.questions,
                currentQuestion: 0,
                totalQuestions: room.quiz.questions.length,
                quizName: room.quiz.name,
                players: room.players
            });
        }, 5000);
    });


    socket.on("result", (data) => {
        let foundRoom = null;
        let foundRoomCode = null;

        for (const roomCode in rooms) {
            const room = rooms[roomCode];
            const player = room.players.find(p => p.socketId === socket.id);

            if (player) {
                foundRoom = room;
                foundRoomCode = roomCode;

                io.to(roomCode).emit("duel-results", {
                    result: room
                });

                //console.log("Resultado:", room);
                break;
            }
        }

        if (!foundRoom) return;

        console.log("Apagando a sala em 10seg...");

        setTimeout(() => {
            delete rooms[foundRoomCode];
            console.log("Sala removida após os 10seg:", foundRoomCode);
        }, 10000);
    });



    socket.on("answer-question", (data) => {

        const { correct, currentQuestion, totalQuestions } = data;

        for (const roomCode in rooms){

            const room = rooms[roomCode];

            const player = room.players.find(
                p => p.socketId === socket.id
            );

            if (player){

                const progress = Math.round(
                    (currentQuestion / totalQuestions) * 100
                );

                const question = room.quiz.questions[currentQuestion - 1];

                if (correct){
                    player.score += question.weight;
                }

                io.to(roomCode).emit("player-progress", {
                    player: player.username,
                    correct,
                    progress,
                    score: player.score
                });

                break;
            }

        }

    });



    socket.on("finish-game", () => {

        for (const roomCode in rooms){

            const room = rooms[roomCode];

            const player = room.players.find(
                p => p.socketId === socket.id
            );

            if (player){

                io.to(roomCode).emit("player-finished", {
                    player: player.username
                });

                break;
            }

        }

    });




    socket.on("create-room", (data) => {
        const { username } = data;
        const roomCode = generateRoomCode();
        rooms[roomCode] = {
            players: [
                {
                    socketId: socket.id,
                    username,
                    score : 0
                }
            ]
        };
        socket.join(roomCode);
        console.log("Sala criada:", roomCode);
        socket.emit("room-created", {roomCode});
    });


    socket.on("join-room", (data) => {
        const { roomCode, username } = data;
        const room = rooms[roomCode];
        if (!room) {
            socket.emit("room-not-found", {message: "Sala não encontrada"});
            return;
        }

        if (room.players.length >= 2) {
            socket.emit("room-full", {message: "Sala cheia"});
            return;
        }

        socket.join(roomCode);
        room.players.push({
            socketId: socket.id,
            username,
            score : 0
        });
        console.log("Player entrou na sala:", roomCode);
        io.to(roomCode).emit("player-joined", {
            players: room.players
        });

    });

});

nextApp.prepare().then(() => {

    server.listen(3000, "0.0.0.0", () => {
        console.log("Servidor Next + Socket rodando na porta 3000");
    });

});