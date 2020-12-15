"use strict";

// デバッグのフラグ
const DEBUG = true;

let drawCount = 0;
let fps = 0;
let lastTime = Date.now();

// スムージング
const SMOOTHING = false;

const SCREEN_W = 320;
const SCREEN_H = 300;

const CANVAS_W = SCREEN_W * 2;
const CANVAS_H = SCREEN_H * 2;

const FIELD_W = SCREEN_W + 120;
const FIELD_H = SCREEN_H + 40;

const STAR_MAX = 300;

// ゲームスピード（秒間６０回）
const GAME_SPEED = 1000 / 60;
// const GAME_SPEED = 17;

// キャンバス
let can = document.getElementById("can");
let con = can.getContext("2d");
can.width = CANVAS_W;
can.height = CANVAS_H;

// 描写はハッキリさせる
con.mozimageSmoothingEnabled = SMOOTHING;
con.webkitimageSmoothingEnabled = SMOOTHING;
con.msimageSmoothingEnabled = SMOOTHING;
con.imageSmoothingEnabled = SMOOTHING;
con.font = "20px `Impact`";

// フィールド（仮装画面）
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");
vcan.width = FIELD_W;
vcan.height = FIELD_H;

// カメラの座標
let camera_x = 0;
let camera_y = 0;

let gameOver = false;
let score = 0;

// 星の実態
let star = [];
// キーボードの状態
let key = [];

// オブジェクト達
let teki = [];
let teta = [];
let tama = [];
let expl = [];
let jiki = new Jiki();
// let teki = [new Teki(7, 200 << 8, 200 << 8, 0, 0)];
// teki[0] = new Teki(8, 200 << 8, 200 << 8, 0, 0);

// 自機ファイルの読み込み
let spriteImage = new Image();
spriteImage.src = "ziki.png";

// ゲーム初期化
function gameInit() {}

for (let i = 0; i < STAR_MAX; i++) star[i] = new Star();
setInterval(gameLoop, GAME_SPEED);

// オブジェクトのアップデート
function updateObj(obj) {
  for (let i = obj.length - 1; i >= 0; i--) {
    obj[i].update();
    if (obj[i].kill) obj.splice(i, 1);
  }
}
// オブジェクトを描写
function drawObj(obj) {
  for (let i = 0; i < obj.length; i++) obj[i].draw();
}

// 移動の処理
function updateAll() {
  updateObj(star);
  updateObj(tama);
  updateObj(teta);
  updateObj(teki);
  updateObj(expl);
  if (!gameOver) jiki.update();
}

// 描写の処理
function drawAll() {
  vcon.fillStyle = jiki.damage ? "red" : "black";
  vcon.fillRect(camera_x, camera_y, SCREEN_W, SCREEN_H);

  drawObj(star);
  drawObj(tama);
  if (!gameOver) jiki.draw();
  drawObj(teta);
  drawObj(teki);
  drawObj(expl);

  // 自機の範囲 ０〜FILD＿W
  // カメラの範囲
  camera_x = ((jiki.x >> 8) / FIELD_W) * (FIELD_W - SCREEN_W);
  camera_y = ((jiki.y >> 8) / FIELD_H) * (FIELD_H - SCREEN_H);

  // 仮装画面からキャンバスに出力
  con.drawImage(
    vcan,
    camera_x,
    camera_y,
    SCREEN_W,
    SCREEN_H,
    0,
    0,
    CANVAS_W,
    CANVAS_H
  );
}

// 情報の表示
function putInfo() {
  con.fillStyle = "white";

  if (gameOver) {
    let s = "GAME OVER";
    let w = con.measureText(s).width;
    let x = CANVAS_W / 2 - w / 2;
    let y = CANVAS_H / 2 - 20;
    con.fillText(s, x, y);

    s = "Push 'R' key to restart !";
    w = con.measureText(s).width;
    x = CANVAS_W / 2 - w / 2;
    y = CANVAS_H / 2 - 20 + 20;
    con.fillText(s, x, y);
  }

  // デバッグの処理
  if (DEBUG) {
    drawCount++;
    if (lastTime + 1000 <= Date.now()) {
      fps = drawCount;
      drawCount = 0;
      lastTime = Date.now();
    }

    con.fillText("HP: " + jiki.hp, 20, 40);
    con.fillText("SCORE: " + score, 20, 60);

    // con.fillText("FPS: " + fps, 20, 20);
    // con.fillText("Tame: " + tama.length, 20, 40);
    // con.fillText("Teki: " + teki.length, 20, 60);
    // con.fillText("Teka: " + teta.length, 20, 80);
    // con.fillText("Expl: " + expl.length, 20, 100);
    // con.fillText("X: " + (jiki.x >> 8), 20, 120);
    // con.fillText("Y: " + (jiki.y >> 8), 20, 140);
    // con.fillText("HP: " + jiki.hp, 20, 160);
    // con.fillText("SCORE: " + score, 20, 180);
  }
}

// ゲームループ
function gameLoop() {
  // テスト的に敵を出す
  if (rand(0, 20) == 1) {
    let r = rand(0, 1);
    teki.push(new Teki(r, rand(0, FIELD_W) << 8, 0, 0, rand(300, 1200)));
  }

  updateAll();
  drawAll();
  putInfo();
}

// ウィンドウ読み込み時にゲーム開始
window.onloasd = function () {
  gameInit();
};

// 終了の操作
document.getElementById("btn").addEventListener("click", () => {
  window.close();
});
