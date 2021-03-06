"use strict";
// その他、共通関数

// キーボードを押されたときの処理
document.onkeydown = function (e) {
  key[e.keyCode] = true;
  if (gameOver && e.keyCode == 82) {
    // delete jiki;
    jiki = new Jiki();
    gameOver = false;
    score = 0;
  }
};
document.onkeyup = function (e) {
  key[e.keyCode] = false;
};

// キャラクターのベースクラス
class CharaBase {
  constructor(snum, x, y, vx, vy) {
    this.sn = snum;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.kill = false;
    this.count = 0;
  }

  update() {
    this.count++;
    this.x += this.vx;
    this.y += this.vy;
  }
  draw() {
    drawSpright(this.sn, this.x, this.y);

    if (
      this.x < 0 ||
      this.x > FIELD_W << 8 ||
      this.y < 0 ||
      this.y > FIELD_H << 8
    ) {
      this.kill = true;
    }
  }
}

// 爆発のクラス
class Expl extends CharaBase {
  constructor(c, x, y, vx, vy) {
    super(0, x, y, vx, vy);
    this.timer = c;
  }
  update() {
    if (this.timer) {
      this.timer--;
    }
    super.update();
  }
  draw() {
    if (this.timer) return;
    this.sn = 12 + (this.count >> 2);
    if (this.sn == 16) {
      this.kill = true;
      return;
    }
    super.draw();
  }
}

// もっと派手な爆発
function explosion(x, y, vx, vy) {
  expl.push(new Expl(0, x, y, vx, vy));
  for (let i = 0; i < 10; i++) {
    let evx = (vx + rand(-10, 10)) << 6;
    let evy = (vy + rand(-10, 10)) << 6;
    expl.push(new Expl(i, x, y, evx >> 3, evy >> 3));
  }
}

// スプライトを描写する
function drawSpright(snum, x, y) {
  let sx = spright[snum].x;
  let sy = spright[snum].y;
  let sw = spright[snum].w;
  let sh = spright[snum].h;

  // 自機描写位置
  // let px = -23;
  let px = (x >> 8) - sw / 2;
  let py = (y >> 8) - sh / 2;

  // 範囲外は自機を描写しない
  if (
    px + sw < camera_x ||
    px > camera_x + SCREEN_W ||
    py + sh < camera_y ||
    py > camera_y + SCREEN_H
  )
    return;

  // 自機の描写設定（画像サイズを1/10に縮小）
  vcon.drawImage(
    spriteImage,
    sx * 10,
    sy * 10,
    sw * 10,
    sh * 10,
    px,
    py,
    sw,
    sh
  );
}

// ランダム関数
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 矩形の当たり判定
// function checkHit(x1, y1, w1, h1, x2, y2, w2, h2) {
//   let left1 = x1 >> 8;
//   let right1 = left1 + w1;
//   let top1 = y1 >> 8;
//   let bottom1 = top1 + h1;

//   let left2 = x2 >> 8;
//   let right2 = left2 + w2;
//   let top2 = y2 >> 8;
//   let bottom2 = top2 + h2;
//   return (
//     left1 <= right2 && right1 >= left2 && top1 <= bottom2 && bottom1 >= top2
//   );
// }

// 円の当たり判定
function checkHit(x1, y1, r1, x2, y2, r2) {
  let a = (x1 - x2) >> 8;
  let b = (y1 - y2) >> 8;
  let r = r1 + r2;
  return r * r >= a * a + b * b;
}

// 星のクラス
class Star {
  constructor() {
    this.x = rand(0, FIELD_W) << 8;
    this.y = rand(0, FIELD_H) << 8;
    this.vx = 0;
    this.vy = rand(30, 200);
    this.sz = (1, 2);
  }

  draw() {
    let x = this.x >> 8;
    let y = this.y >> 8;
    // 範囲外は描写しない
    if (
      x < camera_x ||
      x > camera_x + SCREEN_W ||
      y < camera_y ||
      y > camera_y + SCREEN_H
    )
      return;
    // 範囲内の描写(星を瞬かせる)
    vcon.fillStyle = rand(0, 2) != 0 ? "#66f" : "#8aef";
    vcon.fillRect(x, y, this.sz, this.sz);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.y > FIELD_H << 8) {
      this.y = 0;
      this.x = rand(0, FIELD_W) << 8;
    }
  }
}
