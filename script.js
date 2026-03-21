let width, bombAmount, squares = [];
let isGameOver = false;
const grid = document.getElementById('grid');

function startGame(w, bombs) {
    width = w;
    bombAmount = bombs;
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('mine-count').innerText = bombs;
    
    grid.style.gridTemplateColumns = `repeat(${width}, 42px)`;
    createBoard();
}

function createBoard() {
    const bombsArray = Array(bombAmount).fill('bomb');
    const emptyArray = Array(width * width - bombAmount).fill('valid');
    const gameArray = emptyArray.concat(bombsArray).sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add('cell');
        square.classList.add(gameArray[i]);
        grid.appendChild(square);
        squares.push(square);

        square.addEventListener('click', () => click(square));
        
        // Poner bandera con click derecho
        square.oncontextmenu = (e) => {
            e.preventDefault();
            if (!square.classList.contains('revealed')) {
                square.innerHTML = square.innerHTML === '🚩' ? '' : '🚩';
            }
        }
    }

    // Lógica de números (Igual que tu contarMinasCercanas de Java)
    for (let i = 0; i < squares.length; i++) {
        let total = 0;
        const isLeft = (i % width === 0);
        const isRight = (i % width === width - 1);

        if (squares[i].classList.contains('valid')) {
            if (i > 0 && !isLeft && squares[i-1].classList.contains('bomb')) total++;
            if (i > width-1 && !isRight && squares[i+1-width].classList.contains('bomb')) total++;
            if (i > width-1 && squares[i-width]?.classList.contains('bomb')) total++;
            if (i > width && !isLeft && squares[i-1-width].classList.contains('bomb')) total++;
            if (i < width*width-1 && !isRight && squares[i+1].classList.contains('bomb')) total++;
            if (i < width*width-width && !isLeft && squares[i-1+width].classList.contains('bomb')) total++;
            if (i < width*width-width-1 && !isRight && squares[i+1+width].classList.contains('bomb')) total++;
            if (i < width*width-width && squares[i+width].classList.contains('bomb')) total++;
            squares[i].setAttribute('data', total);
        }
    }
}

function click(square) {
    if (isGameOver || square.classList.contains('revealed') || square.innerHTML === '🚩') return;

    if (square.classList.contains('bomb')) {
        gameOver(square);
    } else {
        let total = square.getAttribute('data');
        square.classList.add('revealed');
        if (total != 0) {
            square.innerHTML = total;
            return;
        }
        checkSquare(parseInt(square.id));
    }
}

// Recursividad (Tu destaparCasilla)
function checkSquare(id) {
    const isLeft = (id % width === 0);
    const isRight = (id % width === width - 1);

    setTimeout(() => {
        if (id > 0 && !isLeft) click(squares[id - 1]);
        if (id > width-1 && !isRight) click(squares[id + 1 - width]);
        if (id > width-1) click(squares[id - width]);
        if (id > width && !isLeft) click(squares[id - 1 - width]);
        if (id < width*width-1 && !isRight) click(squares[id + 1]);
        if (id < width*width-width && !isLeft) click(squares[id - 1 + width]);
        if (id < width*width-width-1 && !isRight) click(squares[id + 1 + width]);
        if (id < width*width-width) click(squares[id + width]);
    }, 10);
}

function gameOver(square) {
    isGameOver = true;
    square.innerHTML = '💣';
    square.classList.add('exploding');
    setTimeout(() => {
        document.getElementById('death-screen').classList.remove('hidden');
    }, 700);
}
