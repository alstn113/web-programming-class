// ** var대신 const, let 사용 **
// var은 function-scoped이고 const, let은 block-scoped이다. const, let은 hoisting이 일어나지 않는다.
// const와 let은 var과 다르게 변수 재선언이 불가능하다.
// const는 변수 재선언, 재할당이 모두 불가능하지만 let은 재할당이 가능하다.

// ** function 대신 arrow function 사용했음 **

// 요소 중 아이디가 "gameCanvas"를 찾아서 canvas에 할당
const canvas = document.getElementById("gameCanvas");
// 2d 렌더링 컨텍스트를 할당
const ctx = canvas.getContext("2d");

// 랭크를 담는 배열
const rank = [];

// 게임이 진행 중인지에 대한 값 설정
let gameInProgress = false;

// 점수, 플레이어 이름, 현재 게임 난이도 등 선언
let score;
let playerName;
let gameLevel;

// 방향 키의 초기 값 설정
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

// 플레이어 Ship의 사이즈 및 이미지 경로 설정
const shipSize = 50;
const shipImg = new Image();
shipImg.src = "../img/ship.png";

// 플레이어 Ship의 딕셔너리 선언
const ship = {};

// 적 Ship들의 사이즈 및 이미지 경로 설정
const enemySize = 50;
const enemyImg = new Image();
enemyImg.src = "../img/enemy.png";

const enemyCount = 30;
const enemyStatus = [];

// 게임 초기 설정 함수
const initialState = () => {
  // 점수와 현재 게임 난이도를 기본 값으로 설정
  score = 0;
  gameLevel = 1;

  // playName에 id가 playerName인 태그의 value를 가져와서 할당
  playerName = document.querySelector("#playerName").value;

  // 플에이어 Ship의 위치를 기본 값으로 설정
  ship.x = (canvas.width - shipSize) / 2;
  ship.y = canvas.height - shipSize;
  ship.w = shipSize;
  ship.h = shipSize;

  // 적 Ship들의 위치를 기본 값으로 설정
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
};

// 플레이어 Ship의 4방향 이동에 관한 코드

// 방향키 오른쪽, 왼쪽, 위, 아래 키를 누르는 것에 대해 case값을 찾고, 특정 Pressed값을 true로 변경
const keyDownHandler = (e) => {
  switch (e.code) {
    case "ArrowRight":
      rightPressed = true;
      break;
    case "ArrowLeft":
      leftPressed = true;
      break;
    case "ArrowUp":
      upPressed = true;
      break;
    case "ArrowDown":
      downPressed = true;
      break;
  }
};

// 방향키 오른쪽, 왼쪽, 위, 아래 키를 떼는 것에 대해 case값을 찾고, 특정 Pressed값을 false로 변경
const keyUpHandler = (e) => {
  switch (e.code) {
    case "ArrowRight":
      rightPressed = false;
      break;
    case "ArrowLeft":
      leftPressed = false;
      break;
    case "ArrowUp":
      upPressed = false;
      break;
    case "ArrowDown":
      downPressed = false;
      break;
  }
};

// 키를 누르는 것에 대해 반응하여 keyDownHanler함수를 실행시킴
document.addEventListener("keydown", keyDownHandler);
// 키를 떼는 것에 대해 반응하여 keyUpHandler함수를 실행시킴
document.addEventListener("keyup", keyUpHandler);

// 플레이어 Ship이 적 Ship과 충돌했는지 확인하는 함수
const checkCrash = () => {
  // 총 적의 수만큼 반복
  for (const enemy of enemyStatus) {
    // status가 0인 것은 존재하지 않는 Ship이므로 continue
    if (enemy.status === 0) continue;

    ship.rx = ship.x + ship.w;
    ship.by = ship.y + ship.h;
    enemy.rx = enemy.x + enemy.w;
    enemy.by = enemy.y + enemy.h;

    // 플레이어 Ship과 적의 Ship이 충돌 시 true를 의미하는 1을 return함
    if ((ship.x >= enemy.x && ship.x <= enemy.rx) || (ship.rx >= enemy.x && ship.rx <= enemy.rx)) {
      if ((ship.y >= enemy.y && ship.y <= enemy.by) || (ship.by >= enemy.y && ship.by < enemy.by)) {
        return 1;
      }
    }
  }
  // 모든 적 Ship에 대해 플레이어 Ship과 충돌하지 않았을 경우 false를 의미하는 0을 return함
  return 0;
};

// 적 Ship들을 probWeight와 gameLevel값에 따라 랜덤하게 생성하는 함수
const createNewEnemy = (probWeight, gameLevel) => {
  // Math.random은 0이상 1미만 무작위 수 return함
  // Math.floor은 내림
  // ex) probWeight = 30, gameLevel = 1일 경우
  //     0<=n<30인 n에 대해 n<1일 경우 적 Ship을 생성함
  if (Math.floor(Math.random() * probWeight) < gameLevel) {
    // 적 Ship들에 대해 반복문을 돈다
    for (const enemy of enemyStatus) {
      // 적 Ship이 존재하지 않을 경우 status가 0임
      if (enemy.status == 0) {
        // y값이 0(canvas의 제일 위)
        enemy.y = 0;
        // x값이 canvas의 width에 대해 랜덤하게 설정됨
        enemy.x = Math.floor(Math.random() * canvas.width);

        // 적 Ship의 x값+size가 canvas의 width범위를 초과할 경우 적 Ship의 x위치를 재설정
        if (enemy.x + enemySize > canvas.width) {
          enemy.x = canvas.width - enemySize;
        }

        // 적 Ship이 존재하는 상태인 status 1로 설정
        enemy.status = 1;

        // 적 Ship 하나 생성 후 반복문 종료
        break;
      }
    }
  }
};

// canvas에 적 Ship들을 그려주는 함수
const drawAllEnemies = () => {
  // 적 Ship들의 총 개수만큼 반복
  for (const enemy of enemyStatus) {
    // status가 0인 것은 존재하지 않음을 의미하므로 continue
    if (enemy.status === 0) {
      continue;
    }

    // canvas에 새롭게 그릴 때마다 적 Ship의 y를 10만큼 이동시켜 밑으로 내려가는 것처럼 보이게 함
    enemy.y += 10;

    // 적 Ship이 canvas의 height보다 작을 경우(적 Ship이 canvas의 맨 밑에 닿지 않았을 경우)
    // 적 Ship을 그려줌
    if (enemy.y + enemySize <= canvas.height) {
      ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.w, enemy.h);
    } else {
      // 적 Ship이 canvas의 맨 밑에 닿였을 경우 존재하지 않는 상태인 status 0으로 설정
      enemy.status = 0;
    }
  }

  // 적 Ship을 랜덤하게 생성하는 함수를 실행
  createNewEnemy(30, gameLevel);
};

// canvas에 그림을 그려주는 함수
const draw = () => {
  // canvas를 비움
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 플레이어 Ship을 값에따라 canvas에 그림
  ctx.drawImage(shipImg, ship.x, ship.y, ship.w, ship.h);

  // 적 Ship들을 그리고 생성하는 함수를 실행
  drawAllEnemies();

  if (rightPressed && ship.x < canvas.width - shipSize) {
    // rightPressed가 true이고, 플레이어 Ship이 canvas의 width를 초과하지 않을 경우 x좌표를 이동
    ship.x += 7;
  } else if (leftPressed && ship.x > 0) {
    // leftPressed가 true이고, 플레이어 Ship의 x좌표가 0보다 작지 않을 경우 x좌표를 이동
    ship.x -= 7;
  } else if (upPressed && ship.y > 0) {
    // upPressed가 true이고, 플레이어 Ship의 y좌표가 0보다 작지 않을 경우 y좌표를 이동
    ship.y -= 7;
  } else if (downPressed && ship.y < canvas.height - shipSize) {
    // downPressed가 true이고, 플레이어 Ship이 canvas의 height를 초과하지 않을 경우 y좌표를 이동
    ship.y += 7;
  }

  // draw가 실행 될 때마다 score를 1씩 증가시킴
  score += 1;
  // id가 score인 태그의 내부 텍스트에 score를 할당시켜 시간이 지남에 따라 점수가 올라가는 것처럼 보이게 함
  document.querySelector("#score").innerText = score;
  // score값 200마다 gameLevel를 1씩 증가시킴
  gameLevel = parseInt(score / 200) + 1;
  // id가 difficulty인 태그의 내부 텍스트에 gameLevel를 할당시켜 시간이 지남에 따라 게임 난이도가 올라가는 것처럼 보이게 함
  document.querySelector("#difficulty").innerText = gameLevel;

  // checkCrash()가 true를 뜻하는 1를 return할 경우
  if (checkCrash()) {
    // canvas를 비움
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // rank 배열에 playerName이 있을 경우 [점수, "playerName"]을 넣고, playerName이 없을 경우 [점수, "익명"]을 추가시킴.
    rank.push([score, playerName ? playerName : "익명"]);
    // rank 배열의 첫번째 인덱스로 내림차순 정렬하고, 인덱스 5부터 다 자른다.
    rank.sort((a, b) => b[0] - a[0]).splice(5);

    // rankListElement라는 ul태그 element를 생성한다
    const rankListElement = document.createElement("ul");
    // rank 배열으르 돌면서...
    rank.forEach((item, index) => {
      // rankItemElement라는 li태그 element를 생성한다
      const rankItemElement = document.createElement("li");
      // rankItemElement의 내부에 아래와 같은 특정 html을 넣는다.
      rankItemElement.innerHTML = `<div>${index + 1}등 ${item[1]}님</div><div>${item[0]}점</div>`;
      // rankListElement를 부모노드로 하고 rankItemElement를 자식노드 리스트 중 마지막 자식노드로 붙인다.
      rankListElement.appendChild(rankItemElement);
    });

    // id가 rank인 태그의 내부에 rankListElement와 그 자식노드를 포함하는 html을 넣음
    document.querySelector("#rank").innerHTML = rankListElement.outerHTML;

    // class가 playModal인 태그의 클래스에서 active를 제거한다
    // 그렇게 하면 gameModal이 hidden에서 visible로 변경되어 다시 보이게 됨
    document.querySelector(".playModal").classList.remove("active");

    // draw함수를 종료해서 게임을 종료하게 함
    return;
  }

  // 브라우저에게 수행하기를 원하는 애니메이션을 알리고 다음 리페인트가 진행되기 전에 해당 애니메이션을 업데이트하는 함수를 호출
  requestAnimationFrame(draw);
};

// button 클릭 시 game을 시작하게 하는 함수
const start = () => {
  // 기본 설정 초기화
  initialState();
  // button 클릭시 class가 playModal인 태그에 active라는 class를 추가
  document.querySelector(".playModal").classList.add("active");

  // 게임을 시작하게하는 draw함수 실행
  draw();
};
