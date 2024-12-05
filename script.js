const startbtn = document.querySelector("#start-button");
        const restartbtn = document.querySelector("#restart-button");
        const messagebox = document.querySelector(".message");

        startbtn.addEventListener("click", () => {
            messagebox.style.display = "flex";

            Game.start();
        });
        restartbtn.addEventListener("click", () => {
            Game.restart();
        });

        //module for the game board
        const Gameboard = (() => {
            let board = [];
            for (let i = 0; i < 9; i++) {
                board[i] = "";
            };

            //displays the the game board and listens for click event for each cell
            const displayBoard = () => {
                let boardHTML = "";
                board.forEach((square, index) => {
                    boardHTML += `<div class="cell" data-index=${index}>${square}</div>`;
                })
                document.querySelector(".gameboard").innerHTML = boardHTML;
                const cells = document.querySelectorAll(".cell");
                cells.forEach((cell) => {
                    cell.addEventListener("click", Game.handleClick);
                });

            };

            //updates the board with a mark
            const updateBoard = (index, value) => {
                board[index] = value;
                displayBoard();
            }
            //board getter
            const getBoard = () => board;

            return {
                displayBoard, updateBoard, getBoard
            };
        })();

        const createPlayer = (name, mark) => {
            return {
                name,
                mark
            }
        }

        const Game = (() => {
            let players = [];
            let currentPlayerIndex = 0;
            let gameOver = false;

            const start = () => {
                const player1 = document.querySelector("#player1").value;
                const player2 = document.querySelector("#player2").value;


                //check if player's names are empty
                if (!player1 || !player2) {
                    messagebox.textContent = "Please Enter Names";
                    messagebox.style.display = "flex";
                    return;
                }
                startbtn.style.display = "none";
                const container = document.querySelector(".container");
                container.style.gridTemplateColumns = "1fr";
                container.querySelector(".gameboard").style.display = "grid";



                players = [
                    createPlayer(player1, "&times"),
                    createPlayer(player2, "&#9900;"),
                ]
                currentPlayerIndex = 0;
                gameOver = false;
                updateMessage(players[currentPlayerIndex].name);
                Gameboard.displayBoard();
            }

            const restart = () => {
                for (let i = 0; i < 9; i++) {
                    Gameboard.updateBoard(i, "");
                }
                restartbtn.style.display ="none";
                start();
            }
            const handleClick = (event) => {
                if (gameOver) { return }
                let index = event.target.dataset.index;
                console.log(index);
                if (Gameboard.getBoard()[index] !== "") {
                    return;
                }
                Gameboard.updateBoard(index, players[currentPlayerIndex].mark);

                if (checkWin(Gameboard.getBoard(), players[currentPlayerIndex].mark)) {
                    gameOver = true;
                    messagebox.textContent = players[currentPlayerIndex].name + " WON!";
                    restartbtn.style.display = "block";
                }
                else if (checkTie(Gameboard.getBoard())) {
                    gameOver = true;
                    messagebox.textContent = "DRAW!";
                    restartbtn.style.display = "block";
                } else {
                    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
                    updateMessage(players[currentPlayerIndex].name);
                }




            }
            return { start, handleClick, restart };
        })();
        function updateMessage(name) {
            messagebox.textContent = name + "'s turn";
        }
        function checkTie(board) {
            return board.every(cell => cell !== "");
        }
        function checkWin(board) {
            const winConditions = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ]

            for (let i = 0; i < winConditions.length; i++) {
                const [a, b, c] = winConditions[i];
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return true;
                }
            }
            return false;
        }