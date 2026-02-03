export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function createGame({ cols = 20, rows = 20, rng = Math.random } = {}) {
  const snake = [
    { x: Math.floor(cols / 2), y: Math.floor(rows / 2) },
  ];
  const dir = DIRECTIONS.right;
  const food = spawnFood(snake, cols, rows, rng);
  return {
    cols,
    rows,
    snake,
    dir,
    nextDir: dir,
    food,
    score: 0,
    gameOver: false,
  };
}

export function setDirection(state, dir) {
  if (!dir) return state;
  if (isOpposite(dir, state.dir)) return state;
  return { ...state, nextDir: dir };
}

export function tick(state, rng = Math.random) {
  if (state.gameOver) return state;

  const dir = state.nextDir;
  const head = state.snake[0];
  const nextHead = { x: head.x + dir.x, y: head.y + dir.y };

  if (hitsWall(nextHead, state.cols, state.rows)) {
    return { ...state, gameOver: true };
  }

  if (hitsSelf(nextHead, state.snake)) {
    return { ...state, gameOver: true };
  }

  const ateFood =
    state.food && nextHead.x === state.food.x && nextHead.y === state.food.y;
  const nextSnake = [nextHead, ...state.snake];
  if (!ateFood) nextSnake.pop();

  let nextFood = state.food;
  let gameOver = state.gameOver;
  if (ateFood) {
    nextFood = spawnFood(nextSnake, state.cols, state.rows, rng);
    if (!nextFood) gameOver = true;
  }

  return {
    ...state,
    dir,
    snake: nextSnake,
    food: nextFood,
    score: ateFood ? state.score + 1 : state.score,
    gameOver,
  };
}

function hitsWall(pos, cols, rows) {
  return pos.x < 0 || pos.x >= cols || pos.y < 0 || pos.y >= rows;
}

function hitsSelf(pos, snake) {
  return snake.some((segment) => segment.x === pos.x && segment.y === pos.y);
}

function isOpposite(a, b) {
  return a.x === -b.x && a.y === -b.y;
}

function spawnFood(snake, cols, rows, rng) {
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`));
  const empty = [];
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) empty.push({ x, y });
    }
  }
  if (empty.length === 0) return null;
  const index = Math.floor(rng() * empty.length);
  return empty[index];
}
