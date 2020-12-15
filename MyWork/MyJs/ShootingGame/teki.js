"use strict";

// 敵の弾クラス
class Teta extends CharaBase {
  constructor(sn, x, y, vx, vy) {
    super(sn, x, y, vx, vy);
    this.r = 4;
  }
  // 敵の弾に当たったときの処理
  update() {
    super.update();
    if (
      !gameOver &&
      !jiki.muteki &&
      checkHit(this.x, this.y, this.r, jiki.x, jiki.y, jiki.r)
    ) {
      this.kill = true;
      if ((jiki.hp -= 30) <= 0) {
        gameOver = true;
      } else {
        jiki.damage = 10;
        jiki.muteki = 60;
      }
    }
    // 弾のアニメーション
    // this.sn = 11 + (this.count & 1);
  }
}

// 敵のクラス
class Teki extends CharaBase {
  constructor(t, x, y, vx, vy) {
    super(0, x, y, vx, vy);
    this.tnum = tekiMaster[t].tnum;
    this.r = tekiMaster[t].r;
    this.hp = tekiMaster[t].hp;
    this.score = tekiMaster[t].score;
    this.flag = false;
  }

  update() {
    // 共通のアップデート
    super.update();

    // 個別のアップデート
    tekiFunc[this.tnum](this);

    // 当たり判定
    if (
      !gameOver &&
      !jiki.muteki &&
      checkHit(this.x, this.y, this.r, jiki.x, jiki.y, jiki.r)
    ) {
      this.kill = true;
      if ((jiki.hp -= 30) <= 0) {
        gameOver = true;
      } else {
        jiki.damage = 10;
        jiki.muteki = 60;
      }
    }
  }
}

// 敵の弾の関数
function tekiShot(obj, speed) {
  if (gameOver) return;
  // 敵の弾を自機に追尾させる
  let an, dx, dy;
  an = Math.atan2(jiki.y - obj.y, jiki.x - obj.x);
  // 敵の弾にバラ付きを作る
  // an += (rand(-10, 10) * Math.PI) / 180;
  dx = Math.cos(an) * speed;
  dy = Math.sin(an) * speed;

  // 弾の弾道
  teta.push(new Teta(5, obj.x + (12 << 8), obj.y, dx, dy));
}

// サボテンダーの移動パターン
function tekiMove01(obj) {
  if (!obj.flag) {
    if (jiki.x > obj.x && obj.vx < 120) obj.vx += 4;
    else if (jiki.x < obj.x && obj.vx > -120) obj.vx -= 4;
  } else {
    if (jiki.x < obj.x && obj.vx < 120) obj.vx += 4;
    else if (jiki.x > obj.x && obj.vx > -400) obj.vx -= 30;
  }
  // 一定の場所まで来たら帰る
  if (Math.abs(jiki.y - obj.y) < 100 << 8 && !obj.flag) {
    obj.flag = true;
    tekiShot(obj, 600);
  }
  if (obj.flag && obj.vy) obj.vy -= 30;
  // スプライトの変更
  const ptn = [9, 9, 9, 9];
  obj.sn = ptn[(obj.count >> 3) & 3];
}

// スライムの移動パターン
function tekiMove02(obj) {
  if (!obj.flag) {
    if (jiki.x > obj.x && obj.vx < 600) obj.vx += 4;
    else if (jiki.x < obj.x && obj.vx > -600) obj.vx -= 30;
  } else {
    if (jiki.x < obj.x && obj.vx < 600) obj.vx += 4;
    else if (jiki.x > obj.x && obj.vx > -600) obj.vx -= 30;
  }
  // 一定の場所まで来たら帰る
  if (Math.abs(jiki.y - obj.y) < 100 << 8 && !obj.flag) {
    obj.flag = true;
    tekiShot(obj, 1000);
  }
  // 反転処理
  // if (obj.flag && obj.vy) obj.vy -= 30;

  // スプライトの変更
  const ptn = [8, 8, 8, 8];
  obj.sn = ptn[(obj.count >> 3) & 3];
}

let tekiFunc = [tekiMove01, tekiMove02];
