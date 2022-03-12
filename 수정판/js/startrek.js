const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let rightPressed = false;
let leftPressed = false;

const shipSize = 40;
const shipImg = new Image();
shipImg.src = "../img/plane.png";

const ship = {
  x: (canvas.width - shipSize) / 2,
  y: canvas.height - shipSize,
  w: shipSize,
  h: shipSize,
};

const enemySize = 40;
const enemyImg = new Image();
enemyImg.src = "../img/plane.png";

const enemyCount = 10;
const enemyStatus = [];

for (let i = 0; i < enemyCount; i++) {
  enemyStatus[i] = {
    x: 0,
    y: 0,
    w: enemySize,
    h: enemySize,
    img: enemyImg,
    status: 0,
  };
}

const keyDownHandler = (e) => {
  if (e.code === "ArrowRight") {
    rightPressed = true;
  } else if (e.code === "ArrowLeft") {
    leftPressed = true;
  }
};

const keyUpHandler = (e) => {
  if (e.code === "ArrowRight") {
    rightPressed = false;
  } else if (e.code === "ArrowLeft") {
    leftPressed = false;
  }
};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

const checkCrash = () => {
  for (let i = 0; i < enemyCount; i++) {
    const enemy = enemyStatus[i];

    if (enemy.status === 0) {
      continue;
    }

    ship.rx = ship.x + ship.w;
    ship.by = ship.y + ship.h;
    enemy.rx = enemy.x + enemy.w;
    enemy.by = enemy.y + enemy.h;

    if ((ship.x >= enemy.x && ship.x <= enemy.rx) || (ship.rx >= enemy.x && ship.rx <= enemy.rx)) {
      if ((ship.y >= enemy.y && ship.y <= enemy.by) || (ship.by >= enemy.y && ship.by < enemy.by)) {
        return 1;
      }
    }
  }
  return 0;
};

const createNewEnemy = (probWeight, gameLevel) => {
  if (Math.floor(Math.random() * probWeight) < gameLevel) {
    for (var i = 0; i < enemyCount; i++) {
      const enemy = enemyStatus[i];

      if (enemy.status == 0) {
        enemy.y = 0;
        enemy.x = Math.floor(Math.random() * canvas.width);

        if (enemy.x + enemySize > canvas.width) {
          enemy.x = canvas.width - enemySize;
        }

        enemy.status = 1;
        break;
      }
    }
  }
};

const drawAllEnemies = () => {
  for (let i = 0; i < enemyCount; i++) {
    const enemy = enemyStatus[i];

    if (enemy.status === 0) {
      continue;
    }

    enemy.y += 2;

    if (enemy.y + enemySize <= canvas.height) {
      ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.w, enemy.h);
    } else {
      enemy.status = 0;
    }
  }
  createNewEnemy(30, 1);
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawAllEnemies();
  ctx.drawImage(shipImg, ship.x, ship.y, ship.w, ship.h);

  if (rightPressed && ship.x < canvas.width - shipSize) {
    ship.x += 10;
  } else if (leftPressed && ship.x > 0) {
    ship.x -= 10;
  }

  if (checkCrash()) {
    ctx.fillText("Crash!", 10, 20);
  }

  requestAnimationFrame(draw);
};
draw();
