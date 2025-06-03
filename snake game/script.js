const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;

let snake, direction, food, score, interval, game;

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const difficultySelect = document.getElementById("difficulty");
const restartBtn = document.getElementById("restartBtn");
const arrowEl = document.getElementById("arrowIndicator");

let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreEl.textContent = highScore;

function resetGame() {
  clearInterval(game);
  score = 0;
  scoreEl.textContent = score;
  direction = null;
  arrowEl.textContent = "↑";
  snake = [{ x: 9 * box, y: 9 * box }];
  food = getRandomFood();
  interval = +difficultySelect.value;
  game = setInterval(draw, interval);
}

function getRandomFood() {
  return {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box,
  };
}

function updateDirection(newDir) {
  const opposite = {
    UP: "DOWN",
    DOWN: "UP",
    LEFT: "RIGHT",
    RIGHT: "LEFT",
  };
  if (direction !== opposite[newDir]) {
    direction = newDir;
    arrowEl.textContent = {
      UP: "↑",
      DOWN: "↓",
      LEFT: "←",
      RIGHT: "→"
    }[newDir];
  }
}

// Keyboard input
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") updateDirection("LEFT");
  else if (e.key === "ArrowUp") updateDirection("UP");
  else if (e.key === "ArrowRight") updateDirection("RIGHT");
  else if (e.key === "ArrowDown") updateDirection("DOWN");
});

// On-screen button input
document.querySelectorAll(".arrow-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    updateDirection(btn.dataset.dir);
  });
});

difficultySelect.addEventListener("change", resetGame);
restartBtn.addEventListener("click", resetGame);

function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "lightgreen";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  else if (direction === "RIGHT") headX += box;
  else if (direction === "UP") headY -= box;
  else if (direction === "DOWN") headY += box;
  else return;

  if (
    headX < 0 || headX >= canvasSize ||
    headY < 0 || headY >= canvasSize ||
    snake.some(part => part.x === headX && part.y === headY)
  ) {
    clearInterval(game);
    alert("💀 Game Over! Your score: " + score);
    if (score > highScore) {
      localStorage.setItem("snakeHighScore", score);
      highScoreEl.textContent = score;
      highScore = score;
    }
    return;
  }

  if (headX === food.x && headY === food.y) {
    score++;
    scoreEl.textContent = score;
    food = getRandomFood();
  } else {
    snake.pop();
  }

  snake.unshift({ x: headX, y: headY });
}

resetGame();
