import { io } from 'socket.io-client';

const URL = 'http://localhost:3001';

const roomId = 'sala-1';
const quizId = '69a37e896504ed54e9bd350a';

const player1 = io(URL);
const player2 = io(URL);

// controle de perguntas
let questions = [];

// controle de estado
let gameEnded = false;

// índices
let index1 = 0;
let index2 = 0;

// ===== PLAYER 1 =====
player1.on('connect', () => {
  console.log('Player1 conectado:', player1.id);
  player1.emit('joinRoom', { roomId, userId: 'user1' });
});

player1.on('startGame', () => {
  console.log('Player1: jogo começou!');
  player1.emit('startQuiz', { roomId, quizId });
});

player1.on('quizData', (q) => {
  if (gameEnded) return;

  console.log('Player1 recebeu perguntas');
  questions = q;

  answerNext1();
});

function answerNext1() {
  if (gameEnded) return;

  if (index1 >= questions.length) {
    console.log('Player1 terminou');
    player1.emit('finish', { roomId, userId: 'user1' });
    return;
  }

  const question = questions[index1];

  setTimeout(() => {
    if (gameEnded) return; // 🚫 evita resposta atrasada

    player1.emit('answer', {
      roomId,
      quizId,
      userId: 'user1',
      questionText: question.question,
      answer: 0,
      time: 5,
    });

    index1++;
    answerNext1();
  }, 1000);
}

player1.on('answerResult', (data) => {
  if (gameEnded) return;

  console.log('Player1 resultado:', data);
});

// ===== PLAYER 2 =====
player2.on('connect', () => {
  console.log('Player2 conectado:', player2.id);
  player2.emit('joinRoom', { roomId, userId: 'user2' });
});

player2.on('startGame', () => {
  console.log('Player2: jogo começou!');
});

player2.on('quizData', (q) => {
  if (gameEnded) return;

  console.log('Player2 recebeu perguntas');
  questions = q;

  answerNext2();
});

function answerNext2() {
  if (gameEnded) return;

  if (index2 >= questions.length) {
    console.log('Player2 terminou');
    player2.emit('finish', { roomId, userId: 'user2' });
    return;
  }

  const question = questions[index2];

  setTimeout(() => {
    if (gameEnded) return; // 🚫 evita resposta atrasada

    player2.emit('answer', {
      roomId,
      quizId,
      userId: 'user2',
      questionText: question.question,
      answer: 1,
      time: 10,
    });

    index2++;
    answerNext2();
  }, 1500);
}

player2.on('answerResult', (data) => {
  if (gameEnded) return;

  console.log('Player2 resultado:', data);
});

// ===== RESULTADO FINAL =====
player1.on('gameOver', (data) => {
  gameEnded = true;
  console.log('\n🏆 RESULTADO FINAL (Player1 vê):', data);
});

player2.on('gameOver', (data) => {
  gameEnded = true;
  console.log('\n🏆 RESULTADO FINAL (Player2 vê):', data);
});