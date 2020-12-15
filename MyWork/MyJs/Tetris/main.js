"use strict";

{
  var GAME_SPEED = 600;
  const FIELD_COL = 10;
  const FIELD_ROW = 20;

  const BLOCK_SIZE = 18;
  const TETRO_SIZE = 4;

  // スムージング
const SMOOTHING = false;

  const score = document.getElementById("score");
  var SCORE = 0;
  score.innerText = "SCORE: " + SCORE + " POINT";

  const SCREEN_W = BLOCK_SIZE * FIELD_COL;
  const SCREEN_H = BLOCK_SIZE * FIELD_ROW;

  let can = document.getElementById("can");
  let con = can.getContext("2d");

  // 描写はハッキリさせる
  con.mozimageSmoothingEnabled = SMOOTHING;
  con.webkitimageSmoothingEnabled = SMOOTHING;
  con.msimageSmoothingEnabled = SMOOTHING;
  con.imageSmoothingEnabled = SMOOTHING;

  can.width = SCREEN_W;
  can.height = SCREEN_H;
  can.style.border = "4px solid #555";

  const TETORO_CORORS = [
    "#000",
    "#6CF",
    "#F92",
    "#66F",
    "#C5C",
    "#FD2",
    "#F44",
    "#6B5",
    "black",
  ];

  const TETIRO_TYPES = [
    [], //0.
    [
      //1.I
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      //2.L
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      //3.J
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      //4.T
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      //5.O
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      //6.Z
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      //7.S
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      //8.『
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
  ];

  const START_X = FIELD_COL / 2 - TETRO_SIZE / 2;
  const START_Y = 0;

  let tetoro;

  let tetoro_x = START_X;
  let tetoro_y = START_Y;
  let tetoro_t;

  tetoro_t = Math.floor(Math.random() * (TETIRO_TYPES.length - 1)) + 1;
  tetoro = TETIRO_TYPES[tetoro_t];

  let field = [];
  // ゲームオーバー
  let over = false;

  init();
  drawAll();
  setInterval(dropTetoro, GAME_SPEED);

  // 初期化
  function init() {
    for (let y = 0; y < FIELD_ROW; y++) {
      field[y] = [];
      for (let x = 0; x < FIELD_COL; x++) {
        field[y][x] = 0;
      }
    }

    // field[5][8] = 1;
    // field[4][1] = 1;
    // field[11][3] = 1;
  }

  function drawBlock(x, y, c) {
    let px = x * BLOCK_SIZE;
    let py = y * BLOCK_SIZE;
    con.fillStyle = TETORO_CORORS[c];
    con.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
    con.strokeStyle = "Black";
    con.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
  }

  // 全体の描写
  function drawAll() {
    con.clearRect(0, 0, SCREEN_W, SCREEN_H);
    for (let y = 0; y < FIELD_ROW; y++) {
      for (let x = 0; x < FIELD_COL; x++) {
        if (field[y][x]) {
          drawBlock(x, y, field[y][x]);
        }
      }
    }
    if (over) {
      let s = "GAME OVER";
      con.font = "26px 'MS　ゴシック'";
      let w = con.measureText(s).width;
      let x = SCREEN_W / 2 - w / 2;
      let y = SCREEN_H / 2 - 20;
      con.lineWidth = 4;
      con.strokeText(s, x, y);
      con.fillStyle = "white";
      con.fillText(s, x, y);
    }
    // レトロの描写
    for (let y = 0; y < TETRO_SIZE; y++) {
      for (let x = 0; x < TETRO_SIZE; x++) {
        if (tetoro[y][x]) {
          drawBlock(tetoro_x + x, tetoro_y + y, tetoro_t);
        }
      }
    }
  }

  function checkMove(mx, my, ntetoro) {
    if (ntetoro == undefined) ntetoro = tetoro;
    for (let y = 0; y < TETRO_SIZE; y++) {
      for (let x = 0; x < TETRO_SIZE; x++) {
        if (ntetoro[y][x]) {
          let nx = tetoro_x + mx + x;
          let ny = tetoro_y + my + y;
          if (
            ny < 0 ||
            nx < 0 ||
            ny >= FIELD_ROW ||
            nx >= FIELD_COL ||
            field[ny][nx]
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }
  // テトロ回転
  function rotate() {
    let ntetoro = [];
    for (let y = 0; y < TETRO_SIZE; y++) {
      ntetoro[y] = [];
      for (let x = 0; x < TETRO_SIZE; x++) {
        ntetoro[y][x] = tetoro[TETRO_SIZE - x - 1][y];
      }
    }
    return ntetoro;
  }
  // テトロを固定する
  function fixTetoro() {
    for (let y = 0; y < TETRO_SIZE; y++) {
      for (let x = 0; x < TETRO_SIZE; x++) {
        if (tetoro[y][x]) {
          field[tetoro_y + y][tetoro_x + x] = tetoro_t;
        }
      }
    }
  }

  // ラインがそろった場合の消す処理
  function checkLine() {
    let lineC = 0;
    for (let y = 0; y < FIELD_ROW; y++) {
      let flag = true;
      for (let x = 0; x < FIELD_COL; x++) {
        if (!field[y][x]) {
          flag = false;
          break;
        }
      }
      if (flag) {
        lineC++;
        for (let NY = y; NY > 0; NY--) {
          for (let NX = 0; NX < FIELD_COL; NX++) {
            field[NY][NX] = field[NY - 1][NX];
            // スコア加点
            SCORE++;
            score.innerText = "SCORE: " + SCORE + " POINT";
          }
        }
      }
    }
  }

  // ブロックの落ちる処理
  function dropTetoro() {
    if (over) return;
    if (checkMove(0, 1)) tetoro_y++;
    else {
      fixTetoro();
      checkLine();

      tetoro_t = Math.floor(Math.random() * (TETIRO_TYPES.length - 1)) + 1;
      tetoro = TETIRO_TYPES[tetoro_t];
      tetoro_x = START_X;
      tetoro_y = START_Y;

      if (!checkMove(0, 0)) {
        over = true;
      }
    }
    drawAll();
  }

    //         // ボタン操作（スマホ用）
    document.getElementById("L").addEventListener("click", () => {
      if (checkMove(-1, 0)) tetoro_x--;
    });
    document.getElementById("R").addEventListener("click", () => {
      if (checkMove(1, 0)) tetoro_x++;
    });
    document.getElementById("T").addEventListener("click", () => {
      let ntetoro = rotate();
      if (checkMove(0, 0, ntetoro)) tetoro = rotate();
    });
    document.getElementById("B").addEventListener("click", () => {
      if (checkMove(0, 1)) tetoro_y++;
    });


  // 操作方法
  document.onkeydown = function (e) {
    if (over) return;
    switch (e.keyCode) {
      case 37: // left
        if (checkMove(-1, 0)) tetoro_x--;
        break;
      // case 38: //top
      //   if (checkMove(0, -1)) tetoro_y--;
      //   break;
      case 39: //right
        if (checkMove(1, 0)) tetoro_x++;
        break;
      case 40: //bottom
        if (checkMove(0, 1)) tetoro_y++;
        break;
      case 32: //スペース
        let ntetoro = rotate();
        if (checkMove(0, 0, ntetoro)) tetoro = rotate();
        break;
    }

    drawAll();
  };
}
{
  // 終了の操作
  document.getElementById("close").addEventListener("click", () => {
    window.close();
  });
}
{
  // 再挑戦
  document.getElementById("retry").addEventListener("click", () => {
    location.reload();
  });
}
