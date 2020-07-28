const BLACK = '#000';
const WHITE = '#fff';

function opposite(color) {
  return color === BLACK ? WHITE : BLACK;
}

class Board {

  grid = [];

  constructor(domElement) {
    this.domElement = domElement;
  }

  set onchange(callback) {
    this.onChangeCallback = callback;
  }

  search(row, col, color) {

    const cells = [];
    const opposite = color === WHITE ? BLACK : WHITE;

    for(let deltaRow = -1; deltaRow < 2; deltaRow++) {
      for(let deltaCol = -1; deltaCol < 2; deltaCol++) {
        let cellsBetween = [];
        let abandonPath = false;
        let oppositeInbetween = false;
        for(let i = 0; i < 8; i++) {
          const searchRow = row + (deltaRow * i);
          const searchCol = col + (deltaCol * i);
          if(searchRow < 1 || searchRow > 8 || searchCol < 1 || searchCol > 8) continue;
          const searchCell = this.grid[searchRow][searchCol];
          if(searchCell === color && !(searchRow === row && searchCol === col)) break;
          if(searchCell === opposite) {
            cellsBetween.push({ cellRow: searchRow, cellCol: searchCol });
            oppositeInbetween = true;
          }
          if(searchCell === false) {
            if(oppositeInbetween) {
              cells.push({ newRow: searchRow, newCol: searchCol, cellsBetween: cellsBetween });
            } else {
              abandonPath = true;
            }
            break;
          }
        }
        if(abandonPath) continue;
      }
    }

    return cells;
  }

  count(color) {
    let count = 0;
    for(let row = 1; row < 9; row++) {
      for(let col = 1; col < 9; col++) {
        if(this.grid[row][col] === color) {
          count++;
        }
      }
    }

    return count;
  }

  getPotentialMoves(turn) {

    let potentialMoves = false;

    for(let row = 1; row < 9; row++) {
      for(let col = 1; col < 9; col++) {
        const cell = this.grid[row][col];
        if(cell === turn) {
          const targets = this.search(row, col, turn);
          if(targets.length < 1) continue;
          potentialMoves = true;
          for(let target of targets) {
            const { newRow, newCol, cellsBetween } = target;
            this.addEmptyDisc(newRow, newCol, turn, cellsBetween);
          }
        } 
      }
    }

    return !potentialMoves;
  }

  removeEmptyDiscs() {
    const emptyDiscs = this.domElement.querySelectorAll('.disc--empty');
    for(let emptyDisc of emptyDiscs) {
      emptyDisc.parentNode.removeChild(emptyDisc);
    }
  }

  createEmptyDisc(row, col, color, cellsBetween) {
    const div = document.createElement('div');
    div.classList.add('disc');
    div.classList.add('disc--new');
    div.classList.add('disc--empty');
    div.addEventListener('click', (event) => {
      this.addNonEmptyDisc(row, col, color);
      this.addNonEmptyDiscs(cellsBetween, color);
      this.removeEmptyDiscs();
      this.onChangeCallback(this.getPotentialMoves(opposite(color)));
    });
    return div;
  }

  createNonEmptyDisc(color) {
    const div = document.createElement('div');
    div.classList.add('disc');
    div.classList.add('disc--new');
    div.style.background = color;
    return div;
  }

  addDisc(row, col, disc) {
    const index = ((row - 1) * 8) + (col - 1);
    const cell = this.domElement.children[index];
    if(cell.firstChild) {
      cell.removeChild(cell.firstChild);
    }
    cell.appendChild(disc);
  }

  addEmptyDisc(row, col, color, cellsBetween = []) {
    this.addDisc(row, col, this.createEmptyDisc(row, col, color, cellsBetween));
  }

  addNonEmptyDisc(row, col, color) {
    this.grid[row][col] = color;
    this.addDisc(row, col, this.createNonEmptyDisc(color));
  } 

  addNonEmptyDiscs(discs, color) {
    discs.forEach((disc) => {
      this.addNonEmptyDisc(disc.cellRow, disc.cellCol, color);
    });
  }

  addEmptyCell(row, col) {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.style.gridRow = row;
    div.style.gridColumn = col;
    this.grid[row][col] = false;
    this.domElement.appendChild(div);
  }

  create() {
    for(let row = 1; row < 9; row++) {
      this.grid[row] = [];
      for(let col = 1; col < 9; col++) {
        this.addEmptyCell(row, col);
      }
    }

    this.addNonEmptyDisc(4, 4, WHITE);
    this.addNonEmptyDisc(4, 5, BLACK);
    this.addNonEmptyDisc(5, 4, BLACK);
    this.addNonEmptyDisc(5, 5, WHITE);

  }

}

let turn;
let board;
let playerOne;
let playerTwo;
let playerOneScore;
let playerTwoScore;
let newGameButton;
let boardContainer;
let winnerContainer;
let playerOneScoreContainer;
let playerTwoScoreContainer;

function onTurnUsed(gameEnded) {

  turn = opposite(turn);
  playerOneScore = board.count(BLACK);
  playerTwoScore = board.count(WHITE);
  playerOneScoreContainer.innerHTML = playerOneScore;
  playerTwoScoreContainer.innerHTML = playerTwoScore;
  playerOne.style.color = turn === BLACK ? 'red' : '#222';
  playerTwo.style.color = turn === WHITE ? 'red' : '#222';

  if(gameEnded) {
    const equal = playerOneScore === playerTwoScore;
    const greater = playerOneScore > playerTwoScore;
    const winner = equal ? "It's a tie!": greater ? "Player One Wins!" : "Player Two Wins";
    winnerContainer.innerHTML = winner;
    window.location.href = '#page1';
  }
}

function initGame() {
  turn = BLACK;
  playerOneScore = 2;
  playerTwoScore = 2;
  playerOne.style.color = turn === BLACK ? 'red' : '#222';
  playerTwo.style.color = turn === WHITE ? 'red' : '#222';
  playerOneScoreContainer.innerHTML = playerOneScore;
  playerTwoScoreContainer.innerHTML = playerTwoScore;
  boardContainer.innerHTML = "";
  board = new Board(boardContainer);
  board.create();
  board.onchange = onTurnUsed;
  board.getPotentialMoves(turn);
}

function initUI() {
  newGameButton = document.getElementById('new-game');
  winnerContainer = document.getElementById('winner');
  boardContainer = document.getElementById('board');
  playerOne = document.getElementById('player1');
  playerTwo = document.getElementById('player2');
  playerOneScoreContainer = document.getElementById('player1-score');
  playerTwoScoreContainer = document.getElementById('player2-score');
}

function addEventListeners() {
  newGameButton.addEventListener('click', initGame, false);
}

initUI();
initGame();
addEventListeners();