let gamesCounter = 1;
let fullTds = [];
let actionsCounterEachGame = 0;
let actionsCounterAllGames = [];
let board = [];
let currentPlayer = 'X';
let gameEnded = false;
let boardSize = 3;

function createBoard(size) {
    const table = document.getElementById('table');
    table.innerHTML = '';
    board = Array(size * size).fill(null);
    for (let i = 0; i < size; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('td');
            cell.id = i * size + j;
            cell.addEventListener('click', () => clickBoard(cell.id));
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

document.getElementById('cancelButton').addEventListener('click', cancelAction);
document.getElementById('newGameButton').addEventListener('click', newGame);
document.getElementById('winningGameButton').addEventListener('click', winningGame);
document.getElementById('resetButton').addEventListener('click', resetAll);
document.getElementById('setBoardSizeButton').addEventListener('click', () => {
    const size = parseInt(document.getElementById('boardSizeInput').value, 10);
    if (size >= 3 && size <= 10) {
        boardSize = size;
        resetAll();
        createBoard(size);
    } else {
        alert('Please enter a size between 3 and 10.');
    }
});
document.getElementById('saveGameButton').addEventListener('click', saveGame);
document.getElementById('loadGameButton').addEventListener('click', loadGame);

createBoard(boardSize);

function clickBoard(num) {
    if (fullTds.length < boardSize * boardSize && !board[num] && !gameEnded) {
        board[num] = currentPlayer;
        document.getElementById(num).innerText = currentPlayer;
        fullTds.push(num);
        actionsCounterEachGame++;
        if (checkWin(currentPlayer)) {
            alert(`Player ${currentPlayer} wins!`);
            alert(`Game ${gamesCounter} with ${actionsCounterEachGame} actions!`);
            actionsCounterAllGames.push(actionsCounterEachGame);
            gameEnded = true;
        } else if (fullTds.length === boardSize * boardSize) {
            alert("Game over! It's a draw!");
            gameEnded = true;
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkWin(player) {
    const winPatterns = [];
    // Rows
    for (let i = 0; i < boardSize; i++) {
        winPatterns.push(Array.from({ length: boardSize }, (_, j) => i * boardSize + j));
    }
    // Columns
    for (let j = 0; j < boardSize; j++) {
        winPatterns.push(Array.from({ length: boardSize }, (_, i) => i * boardSize + j));
    }
    // Diagonal (top-left to bottom-right)
    winPatterns.push(Array.from({ length: boardSize }, (_, i) => i * boardSize + i));
    // Diagonal (top-right to bottom-left)
    winPatterns.push(Array.from({ length: boardSize }, (_, i) => i * boardSize + (boardSize - 1 - i)));

    return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}

function cancelAction() {
    if (fullTds.length > 0 && !gameEnded) {
        const lastMove = fullTds.pop();
        document.getElementById(lastMove).innerText = '';
        board[lastMove] = null;
        actionsCounterEachGame--;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function newGame() {
    if (gameEnded) {
        resetBoard();
        document.getElementById('gameNum').innerText = `Game ${++gamesCounter}`;
    } else {
        alert("Game is not yet finished.");
    }
}

function winningGame() {
    if (actionsCounterAllGames.length > 0) {
        const minActions = Math.min(...actionsCounterAllGames);
        const winningGame = actionsCounterAllGames.indexOf(minActions) + 1;
        alert(`The winner game with minimum actions is Game ${winningGame} with ${minActions} actions!`);
    } else {
        alert("No games have been played yet.");
    }
}

function saveGame() {
    localStorage.setItem('board', JSON.stringify(board));
    localStorage.setItem('fullTds', JSON.stringify(fullTds));
    localStorage.setItem('currentPlayer', currentPlayer);
    localStorage.setItem('actionsCounterEachGame', actionsCounterEachGame);
    localStorage.setItem('gamesCounter', gamesCounter);
    localStorage.setItem('actionsCounterAllGames', JSON.stringify(actionsCounterAllGames));
    localStorage.setItem('gameEnded', gameEnded);
    localStorage.setItem('boardSize', boardSize);
}

function loadGame() {
    if (localStorage.getItem('board')) {
        board = JSON.parse(localStorage.getItem('board'));
        fullTds = JSON.parse(localStorage.getItem('fullTds'));
        currentPlayer = localStorage.getItem('currentPlayer');
        actionsCounterEachGame = parseInt(localStorage.getItem('actionsCounterEachGame'), 10);
        gamesCounter = parseInt(localStorage.getItem('gamesCounter'), 10);
        actionsCounterAllGames = JSON.parse(localStorage.getItem('actionsCounterAllGames'));
        gameEnded = localStorage.getItem('gameEnded') === 'true';
        boardSize = parseInt(localStorage.getItem('boardSize'), 10);

        document.getElementById('gameNum').innerText = `Game ${gamesCounter}`;
        createBoard(boardSize);
        board.forEach((value, index) => {
            document.getElementById(index).innerText = value;
        });
    }
}

function resetAll() {
    fullTds = [];
    board = Array(boardSize * boardSize).fill(null);
    document.querySelectorAll('td').forEach(td => td.innerText = '');
    actionsCounterEachGame = 0;
    actionsCounterAllGames = [];
    currentPlayer = 'X';
    gamesCounter = 1;
    gameEnded = false;
    document.getElementById('gameNum').innerText = `Game 1`;
    localStorage.clear();
}

function resetBoard() {
    fullTds = [];
    board = Array(boardSize * boardSize).fill(null);
    document.querySelectorAll('td').forEach(td => td.innerText = '');
    actionsCounterEachGame = 0;
    currentPlayer = 'X';
    gameEnded = false;
}