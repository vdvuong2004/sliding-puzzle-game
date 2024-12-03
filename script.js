    var puzzle = document.getElementById('puzzle');
    var shuffleButton = document.getElementById('shuffle');
    var message = document.getElementById('message');

    var grid;
    var SIZE = 5;
    var moveSound = new Audio('sounds/whoosh.mp3');

    // Tính số lượng hoán vị ngược
function getInversionCount(arr) {
    let inversions = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j] && arr[i] !== 0 && arr[j] !== 0) {
                inversions++;
            }
        }
    }
    return inversions;
}

// check if the puzzle can solve
function isSolvable(grid) {
    const inversions = getInversionCount(grid);
    const emptyIndex = grid.indexOf(0);
    const emptyRowFromBottom = SIZE - Math.floor(emptyIndex / SIZE);

    if (SIZE % 2 !== 0) {
        return inversions % 2 === 0; 
    } else {
        
        return (inversions % 2 === 0 && emptyRowFromBottom % 2 !== 0) ||
               (inversions % 2 !== 0 && emptyRowFromBottom % 2 === 0);
    }
}

function initPuzzle() {
    do {
        grid = Array.from({ length: SIZE * SIZE }, (_, i) => i).sort(() => Math.random() - 0.5);
    } while (!isSolvable(grid));
    message.textContent = '';
    renderPuzzle();
}


    // Render the puzzle grid
    function renderPuzzle() {
        puzzle.innerHTML = '';
        grid.forEach((value, index) => {
            var tile = document.createElement('img');
            tile.classList.add('tile');
            if (value === 0) tile.classList.add('empty');
            else tile.textContent = value;
            tile.dataset.index = index;
            if (value != 0) tile.src = "images/" + value + ".png";
            tile.addEventListener('click', handleTileClick);
            puzzle.appendChild(tile);
        });
    }

    // Handle tile clicks
    function handleTileClick(e) {
        var index = parseInt(e.target.dataset.index);
        var emptyIndex = grid.indexOf(0);
        var validMoves = getValidMoves(emptyIndex);

        if (validMoves.includes(index)) {
            [grid[emptyIndex], grid[index]] = [grid[index], grid[emptyIndex]];
            renderPuzzle();

            // play sound
            if (soundEnabled) {
                moveSound.currentTime = 0;
                moveSound.play();
            }


            if (isSolved()) {
                if (soundEnabled){
                var winSound = new Audio('sounds/yeah.mp3');
                winSound.play();
                }
                message.textContent = 'Congratulations! You solved the puzzle!';
            } else {
                message.textContent = '';
            }
        }
    }

    // Get valid moves for the empty tile
    function getValidMoves(emptyIndex) {
        var row = Math.floor(emptyIndex / SIZE);
        var col = emptyIndex % SIZE;

        var moves = [];
        if (row > 0) moves.push(emptyIndex - SIZE); // Up
        if (row < SIZE - 1) moves.push(emptyIndex + SIZE); // Down
        if (col > 0) moves.push(emptyIndex - 1); // Left
        if (col < SIZE - 1) moves.push(emptyIndex + 1); // Right

        return moves;
    }

    // Check if the puzzle is solved
    function isSolved() {
        for (let i = 0; i < grid.length - 1; i++) {
            if (grid[i] !== i + 1) return false;
        }
        return grid[grid.length - 1] === 0;
    }

    // Shuffle the puzzle
    shuffleButton.addEventListener('click', initPuzzle);

    // Initialize on load
    function initdefautPuzzle() {
        grid = Array.from({ length: SIZE * SIZE-1 }, (_, i) => i+1);
        grid.push(0);
        renderPuzzle();
    }
    

    initdefautPuzzle();

    var soundEnabled = true;
    var toggleSoundButton = document.getElementById('toggle-sound');
    toggleSoundButton.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        toggleSoundButton.textContent = soundEnabled ? 'Sound: ON' : 'Sound: OFF';
    });

