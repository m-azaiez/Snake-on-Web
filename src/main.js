import { createGame, setDirection, tick, DIRECTIONS } from "./logic.js";

const gridEl = document.getElementById("grid");
const scoreEl = document.getElementById("score");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const pauseBtn = document.getElementById("pause");
const padButtons = document.querySelectorAll(".pad-btn");

const COLS = 20;
const ROWS = 20;
const TICK_MS = 120;

let state = createGame({ cols: COLS, rows: ROWS });
let paused = false;
let timerId = null;

const cells = [];

function buildGrid() {
  gridEl.innerHTML = "";
  for (let i = 0; i < COLS * ROWS; i += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    gridEl.appendChild(cell);
    cells.push(cell);
  }
}

function render() {
  cells.forEach((cell) => {
    cell.className = "cell";
  });

  const [head, ...body] = state.snake;
  if (head) {
    cellAt(head).classList.add("snake", "head");
  }
  body.forEach((segment) => {
    cellAt(segment).classList.add("snake");
  });
  if (state.food) {
    cellAt(state.food).classList.add("food");
  }

  scoreEl.textContent = state.score.toString();
  if (state.gameOver) {
    statusEl.textContent = state.food ? "Game over" : "You win";
  } else if (paused) {
    statusEl.textContent = "Paused";
  } else {
    statusEl.textContent = "";
  }
}

function cellAt({ x, y }) {
  return cells[y * COLS + x];
}

function gameLoop() {
  if (!paused && !state.gameOver) {
    state = tick(state);
    render();
  }
}

function setDirFromKey(key) {
  switch (key) {
    case "ArrowUp":
    case "w":
    case "W":
      state = setDirection(state, DIRECTIONS.up);
      break;
    case "ArrowDown":
    case "s":
    case "S":
      state = setDirection(state, DIRECTIONS.down);
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      state = setDirection(state, DIRECTIONS.left);
      break;
    case "ArrowRight":
    case "d":
    case "D":
      state = setDirection(state, DIRECTIONS.right);
      break;
    case " ":
      togglePause();
      break;
    default:
      break;
  }
}

function togglePause() {
  if (state.gameOver) return;
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
  render();
}

function restart() {
  state = createGame({ cols: COLS, rows: ROWS });
  paused = false;
  pauseBtn.textContent = "Pause";
  render();
}

function start() {
  buildGrid();
  render();
  timerId = window.setInterval(gameLoop, TICK_MS);
}

window.addEventListener("keydown", (event) => {
  setDirFromKey(event.key);
});

restartBtn.addEventListener("click", restart);

pauseBtn.addEventListener("click", togglePause);

padButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const dir = btn.dataset.dir;
    if (!dir) return;
    state = setDirection(state, DIRECTIONS[dir]);
  });
});

start();
