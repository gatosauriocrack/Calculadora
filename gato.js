// --- Contenido de gato.js ---

const defaultConfig = {
  background_color: "#000000",
  primary_color: "#EA7900",
  x_color: "#FF0000",
  o_color: "#0066FF",
  game_title: "TRES EN RAYA",
  player_x_label: "Jugador X",
  player_o_label: "Jugador O",
  reset_button_text: "REINICIAR",
  win_message_x: "ganó",
  win_message_o: "ganó",
  draw_message: "¡Empate!",
  font_family: "Arial",
  font_size: 16
};

let gameState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

let resetButtonGame;
let statusDisplayGame;
let messageOverlayGame;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const updateStatus = () => {
  if (!statusDisplayGame) return;
  statusDisplayGame.innerHTML = `Turno: <span id="player-turn">${currentPlayer}</span>`;
};

const resetGame = () => {
  gameState = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  if (resetButtonGame) resetButtonGame.disabled = false;

  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.innerHTML = '';
    cell.classList.remove('taken', 'x', 'o', 'winner');
  });

  updateStatus();
};

const showMessage = (message, type) => {
  gameActive = false;
  if (resetButtonGame) resetButtonGame.disabled = true;
  if (!messageOverlayGame) return;

  messageOverlayGame.className = 'message-overlay show ' + type;

  let resultText = '';
  if (type === 'x-win') {
    resultText = '<span>X</span>';
  } else if (type === 'o-win') {
    resultText = '<span>O</span>';
  } else if (type === 'draw') {
    resultText = '';
  }

  messageOverlayGame.innerHTML = resultText + message;

  setTimeout(() => {
    messageOverlayGame.classList.remove('show');
    setTimeout(() => {
      messageOverlayGame.className = 'message-overlay';
      resetGame();
    }, 300);
  }, 1500);
};

const checkResult = () => {
  let roundWon = false;
  let winningCells = [];

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      roundWon = true;
      winningCells = [a, b, c];
      break;
    }
  }

  if (roundWon) {
    const winMessage = currentPlayer === 'X' ? defaultConfig.win_message_x : defaultConfig.win_message_o;
    if (statusDisplayGame) statusDisplayGame.textContent = `¡${currentPlayer} gana!`;

    winningCells.forEach(index => {
      document.querySelector(`[data-index="${index}"]`).classList.add('winner');
    });

    showMessage(winMessage, currentPlayer === 'X' ? 'x-win' : 'o-win');
    return;
  }

  if (!gameState.includes('')) {
    if (statusDisplayGame) statusDisplayGame.textContent = defaultConfig.draw_message;
    showMessage(defaultConfig.draw_message, 'draw');
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();
};

const handleCellClick = e => {
  const cell = e.target;
  const index = parseInt(cell.getAttribute('data-index'));

  if (gameState[index] !== '' || !gameActive || !cell.classList.contains('cell')) {
    return;
  }

  gameState[index] = currentPlayer;

  cell.textContent = currentPlayer;

  cell.classList.add('taken');
  cell.classList.add(currentPlayer.toLowerCase());

  checkResult();
};


function initializeGameListeners() {
    if (document.getElementById('board')) {
        resetButtonGame = document.getElementById('reset-button');
        statusDisplayGame = document.getElementById('status');
        messageOverlayGame = document.getElementById('message-overlay');
        
        if (resetButtonGame && !resetButtonGame.hasAttribute('data-listeners-set')) {
            document.getElementById('board').addEventListener('click', handleCellClick);
            resetButtonGame.addEventListener('click', resetGame);
            resetButtonGame.setAttribute('data-listeners-set', 'true');
        }
        resetGame(); 
    }
}

// Llama a la inicialización al cargar la página
document.addEventListener('DOMContentLoaded', initializeGameListeners);

// Exportar la función para que script.js pueda llamarla cuando se abra el menú
// Asegúrate de que esta función está disponible globalmente si no usas módulos.
window.initializeGameListeners = initializeGameListeners;
