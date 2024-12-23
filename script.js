document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 10;
    const mineCount = 20;
    const gameBoard = document.getElementById('gameBoard');
    const resetButton = document.getElementById('resetButton');
    let board = [];
    let mines = [];

    function initBoard() {
        board = Array.from({ length: boardSize }, () => Array(boardSize).fill({ revealed: false, mine: false, flagged: false }));
        mines = [];
        placeMines();
        renderBoard();
    }

    function placeMines() {
        let placedMines = 0;
        while (placedMines < mineCount) {
            const row = Math.floor(Math.random() * boardSize);
            const col = Math.floor(Math.random() * boardSize);
            if (!board[row][col].mine) {
                board[row][col].mine = true;
                mines.push({ row, col });
                placedMines++;
            }
        }
    }

    function renderBoard() {
        gameBoard.innerHTML = '';
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                if (cell.revealed) {
                    cellElement.classList.add('revealed');
                    if (cell.mine) {
                        cellElement.classList.add('mine');
                    } else {
                        const mineCount = countAdjacentMines(rowIndex, colIndex);
                        if (mineCount > 0) {
                            cellElement.textContent = mineCount;
                        }
                    }
                }
                cellElement.addEventListener('click', () => handleCellClick(rowIndex, colIndex));
                gameBoard.appendChild(cellElement);
            });
        });
    }

    function handleCellClick(row, col) {
        if (board[row][col].revealed || board[row][col].flagged) return;
        board[row][col].revealed = true;
        if (board[row][col].mine) {
            alert('Game Over!');
            revealAllMines();
        } else {
            const mineCount = countAdjacentMines(row, col);
            if (mineCount === 0) {
                revealAdjacentCells(row, col);
            }
        }
        renderBoard();
    }

    function countAdjacentMines(row, col) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                    if (board[newRow][newCol].mine) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    function revealAdjacentCells(row, col) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                    if (!board[newRow][newCol].revealed && !board[newRow][newCol].mine) {
                        board[newRow][newCol].revealed = true;
                        if (countAdjacentMines(newRow, newCol) === 0) {
                            revealAdjacentCells(newRow, newCol);
                        }
                    }
                }
            }
        }
    }

    function revealAllMines() {
        mines.forEach(({ row, col }) => {
            board[row][col].revealed = true;
        });
        renderBoard();
    }

    resetButton.addEventListener('click', initBoard);

    initBoard();
});
