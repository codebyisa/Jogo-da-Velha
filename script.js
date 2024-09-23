document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.square');
    const status = document.querySelector('.status');
    const board = document.querySelector('.board');
    const messageBox = document.querySelector('.message-box');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const toggleThemeButton = document.getElementById('toggle-theme');
    const restartButton = document.getElementById('restart-button');
    const historyList = document.getElementById('history-list');

    let currentPlayer = 'X';
    let gameActive = true;
    let player1Name = 'Jogador 1';
    let player2Name = 'Jogador 2';
    let isDarkMode = false; // Inicializa como modo claro

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const checkWin = () => {
        const boardState = [...squares].map(sq => sq.textContent);
        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                return {
                    winner: boardState[a],
                    combination: combo
                };
            }
        }
        return null;
    };

    const checkDraw = () => {
        return [...squares].every(sq => sq.textContent !== '');
    };

    const handleSquareClick = (e) => {
        const square = e.target;
        if (!gameActive || square.textContent !== '') return;

        square.textContent = currentPlayer;
        const winInfo = checkWin();
        if (winInfo) {
            handleGameEnd(winInfo);
            return;
        }

        if (checkDraw()) {
            handleGameEnd(null); // Chama a função para empate
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `É a vez de ${currentPlayer === 'X' ? player1Name : player2Name}`;
    };

    const handleGameEnd = (winInfo) => {
        gameActive = false;
        if (winInfo) {
            const { winner } = winInfo;
            const winnerName = winner === 'X' ? player1Name : player2Name;
            addToHistory(winnerName); // Adiciona ao histórico
            messageBox.textContent = `O jogador ${winnerName} ganhou!`;
        } else {
            messageBox.textContent = 'Empate!';
        }
        messageBox.style.display = 'block';
        board.classList.add('disabled');
    };

    const toggleTheme = () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark', isDarkMode);
        document.body.classList.toggle('light', !isDarkMode);
        toggleThemeButton.textContent = isDarkMode ? 'Light' : 'Dark';
    };

    const restartGame = () => {
        squares.forEach(square => {
            square.textContent = '';
            square.classList.remove('disabled');
        });
        gameActive = true;
        currentPlayer = 'X';
        status.textContent = `É a vez do jogador ${player1Name}`;
        messageBox.style.display = 'none'; // Esconde a mensagem de vitória
    };

    const addToHistory = (winnerName) => {
        const listItem = document.createElement('li');
        listItem.textContent = `O jogador ${winnerName} ganhou!`;
        historyList.appendChild(listItem);
    };

    player1Input.addEventListener('input', (e) => {
        player1Name = e.target.value || 'Jogador 1';
        status.textContent = `É a vez do jogador ${currentPlayer === 'X' ? player1Name : player2Name}`;
    });

    player2Input.addEventListener('input', (e) => {
        player2Name = e.target.value || 'Jogador 2';
        status.textContent = `É a vez do jogador ${currentPlayer === 'X' ? player1Name : player2Name}`;
    });

    toggleThemeButton.addEventListener('click', toggleTheme);
    restartButton.addEventListener('click', restartGame);
    
    squares.forEach(square => square.addEventListener('click', handleSquareClick));
    
    // Inicializa o tema como claro
    document.body.classList.add('light');
});
