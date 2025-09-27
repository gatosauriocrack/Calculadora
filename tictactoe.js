        const gamesModule = document.getElementById('games-module');
        const gamesMenuList = document.getElementById('games-menu-list');
        const tictactoeGame = document.getElementById('tictactoe-game');
        const tictactoeStatus = document.getElementById('tictactoe-status');
        const tictactoeBoard = document.getElementById('tictactoe-board');
            gamesModule.style.display = 'none';
        function showGamesModule() {
            gamesModule.style.display = 'flex';
            gamesMenuList.style.display = 'flex';
            tictactoeGame.style.display = 'none';
        function exitGames() {
        let ticTacToeBoard = [['', '', ''], ['', '', ''], ['', '', '']];
        let ticTacToePlayer = 'X';
        let isTicTacToeGameOver = false;
        function showGame(gameName) {
            gamesMenuList.style.display = 'none';
            if (gameName === 'tictactoe') {
                tictactoeGame.style.display = 'flex';
                resetTicTacToe();
        function renderTicTacToeBoard() {
            tictactoeBoard.innerHTML = '';
                    const cell = document.createElement('div');
                    const player = ticTacToeBoard[r][c];
                    cell.textContent = player;
                    cell.classList.add('tictactoe-cell');
                    if (player === 'X') {
                        cell.classList.add('x');
                    } else if (player === 'O') {
                        cell.classList.add('o');
                    cell.addEventListener('click', () => handleTicTacToeClick(r, c));
                    tictactoeBoard.appendChild(cell);
        function handleTicTacToeClick(row, col) {
            if (isTicTacToeGameOver || ticTacToeBoard[row][col] !== '') {
            ticTacToeBoard[row][col] = ticTacToePlayer;
            renderTicTacToeBoard();
            if (checkTicTacToeWinner(ticTacToePlayer)) {
                isTicTacToeGameOver = true;
                tictactoeStatus.textContent = `¡El jugador '${ticTacToePlayer}' ha ganado!`;
            } else if (checkTicTacToeDraw()) {
                isTicTacToeGameOver = true;
                tictactoeStatus.textContent = '¡Empate!';
                ticTacToePlayer = ticTacToePlayer === 'X' ? 'O' : 'X';
                tictactoeStatus.textContent = `Turno de '${ticTacToePlayer}'`;
        function checkTicTacToeWinner(player) {
                if (ticTacToeBoard[i][0] === player && ticTacToeBoard[i][1] === player && ticTacToeBoard[i][2] === player) return true;
                if (ticTacToeBoard[0][i] === player && ticTacToeBoard[1][i] === player && ticTacToeBoard[2][i] === player) return true;
            if (ticTacToeBoard[0][0] === player && ticTacToeBoard[1][1] === player && ticTacToeBoard[2][2] === player) return true;
            if (ticTacToeBoard[0][2] === player && ticTacToeBoard[1][1] === player && ticTacToeBoard[2][0] === player) return true;
        function checkTicTacToeDraw() {
            return ticTacToeBoard.flat().every(cell => cell !== '');
        function resetTicTacToe() {
            ticTacToeBoard = [['', '', ''], ['', '', ''], ['', '', '']];
            ticTacToePlayer = 'X';
            isTicTacToeGameOver = false;
            tictactoeStatus.textContent = "Turno de 'X'";
            renderTicTacToeBoard();