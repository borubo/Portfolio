"use strict";

// 弾のクラス
class Tama extends CharaBase {
  constructor(x, y, vx, vy) {
    super(6, x, y, vx, vy);

    // 矩形の当たり判定に使用
    // this.w = 4;
    // this.h = 8;

    // 円の当たり判定に使用
    this.r = 4;
  }
  update() {
    super.update();
    for (let i = 0; i < teki.length; i++) {
      if (!teki[i].kill) {
        if (checkHit(this.x, this.y, this.r, teki[i].x, teki[i].y, teki[i].r)) {
          this.kill = true;
          if ((teki[i].hp -= 10) <= 0) {
            explosion(teki[i].x, teki[i].y, teki[i].vx >> 3, teki[i].vy >> 3);
            teki[i].kill = true;
            score += teki[i].score;
          } else {
            expl.push(new Expl(0, teki[i].x, teki[i].y, 0, 0));
          }

          break;
        }
      }
    }
  }
  draw() {
    super.draw();
  }
}

// 自機のクラス
class Jiki {
  constructor() {
    this.x = (FIELD_W / 2) << 8;
    this.y = (FIELD_H - 50) << 8;
    // (FIELD_H / 2) << 8;
    this.mhp = 100;
    this.hp = this.mhp;

    this.speed = 500;
    this.anime = 0;
    this.reload = 0;
    this.relo2 = 0;
    this.r = 10;
    this.damage = 0;
    this.muteki = 0;
    this.count = 0;
  }
  // 自機の移動
  update() {
    this.count--;
    if (this.damage) this.damage--;
    if (this.muteki) this.muteki--;
    if (key[32] && this.reload == 0) {
      tama.push(new Tama(this.x + (9 << 8), this.y - (10 << 8), -150, -1000));
      tama.push(new Tama(this.x + (10 << 8), this.y - (10 << 8), -50, -1000));
      tama.push(new Tama(this.x + (11 << 8), this.y - (10 << 8), 50, -1000));
      tama.push(new Tama(this.x + (12 << 8), this.y - (10 << 8), 150, -1000));
      // tama.push(new Tama(this.x + (10.5 << 8), this.y - (10 << 8), 0, -1000));

      this.reload = 4;
      if (++this.relo2 == 4) {
        this.reload = 20;
        this.relo2 = 0;
      }
    }
    if (!key[32]) this.reload = this.relo2 = 0;
    if (this.reload > 0) this.reload--;
    if (key[37] && this.x > this.speed) {
      this.x -= this.speed;
      if (this.anime > -8) this.anime--;
    } else if (key[39] && this.x <= (FIELD_W << 8) - this.speed) {
      this.x += this.speed;
      if (this.anime < 8) this.anime++;
    } else {
      if (this.anime > 0) this.anime--;
      if (this.anime < 0) this.anime++;
    }

    if (key[38] && this.y > this.speed) {
      this.y -= this.speed;
    }
    if (key[40] && this.y <= (FIELD_H << 8) - this.speed) {
      this.y += this.speed;
    }
  }
  // 描画
  draw() {
    // 当たった時に点滅させる
    if (this.muteki && this.count & 1) return;
    drawSpright(2 + (this.anime >> 2), this.x, this.y);
    // ジェット噴射の描写
    // if (this.count & 1) return;
    // drawSpright(12 + (this.anime >> 2), this.x, this.y + (24 << 8));
  }
}
