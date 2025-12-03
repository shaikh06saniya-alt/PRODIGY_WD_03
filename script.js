
const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");
const drawScoreEl = document.getElementById("drawScore");
const scoreContainer = document.getElementById("scoreContainer");
const resetBtn = document.getElementById("resetBtn");
const backArrow = document.getElementById("backArrow");


let board = Array(9).fill("");
let current = "X";
let over = false;
let glowCells = [];
let mode = ""; // pvp or ai

let score = { X: 0, O: 0, D: 0 };


function selectMode(m) {
  mode = m;

  document.getElementById("modeMenu").style.display = "none";
  scoreContainer.style.display = "flex";
  boardEl.style.display = "grid";
  statusEl.style.display = "block";
  resetBtn.style.display = "inline-block";
  backArrow.style.display = "block";
}


function goBack() {
  document.getElementById("modeMenu").style.display = "flex";
  scoreContainer.style.display = "none";
  boardEl.style.display = "none";
  statusEl.style.display = "none";
  resetBtn.style.display = "none";
  backArrow.style.display = "none";

  resetGame();
}


function buildBoard() {
  boardEl.innerHTML = "";

  board.forEach((cell, i) => {
    const div = document.createElement("div");
    div.className = "cell";

    if (cell) div.classList.add(cell === "X" ? "x" : "o");

    if (glowCells.includes(i)) div.classList.add("glow");

    div.textContent = cell;
    div.onclick = () => play(i);

    boardEl.appendChild(div);
  });
}


function play(i) {
  if (board[i] || over) return;

  board[i] = current;

  const win = checkWin();
  if (win) {
    statusEl.textContent = current + " Wins!";
    score[current]++;
    glowCells = win;
    over = true;
    updateScore();
    buildBoard();
    return;
  }

  if (board.every(c => c)) {
    statusEl.textContent = "Draw!";
    score.D++;
    over = true;
    updateScore();
    buildBoard();
    return;
  }

  current = current === "X" ? "O" : "X";
  statusEl.textContent = "Turn: " + current;

  buildBoard();

  if (mode === "ai" && current === "O" && !over) {
    setTimeout(aiMove, 400);
  }
}


function aiMove() {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  function findMove(player) {
    for (let c of combos) {
      const vals = c.map(i => board[i]);
      if (vals.filter(v => v === player).length === 2 && vals.includes("")) {
        return c[vals.indexOf("")];
      }
    }
    return null;
  }

  let move = findMove("O");
  if (move === null) move = findMove("X");
  if (move === null) {
    const free = board.map((v, i) => v === "" ? i : -1)
                      .filter(i => i !== -1);
    move = free[Math.floor(Math.random() * free.length)];
  }

  play(move);
}


function checkWin() {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let c of combos) {
    if (c.every(i => board[i] === current)) return c;
  }
  return null;
}


function updateScore() {
  xScoreEl.textContent = score.X;
  oScoreEl.textContent = score.O;
  drawScoreEl.textContent = score.D;
}


function resetGame() {
  board.fill("");
  current = "X";
  over = false;
  glowCells = [];
  statusEl.textContent = "Turn: X";
  buildBoard();
}

buildBoard();
