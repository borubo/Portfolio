"use strict";
// 敵マスター
class TekiMaster {
  constructor(tnum, r, hp, score) {
    this.tnum = tnum;
    this.r = r;
    this.hp = hp;
    this.score = score;
  }
}
let tekiMaster = [
  new TekiMaster(0, 10, 100, 100), //スライム
  new TekiMaster(1, 10, 1, 100), //サボテンダー
];

// スプライトクラス
class Spright {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

// 画像内の描写範囲の設定
let spright = [
  new Spright(0, 0, 40, 30), //0自機 左2
  new Spright(0, 0, 40, 30), //1自機 左1
  new Spright(0, 0, 40, 30), //2自機 正面
  new Spright(0, 0, 40, 30), //3自機 右1
  new Spright(0, 0, 40, 30), //4自機 右2

  new Spright(41, 20, 41, 25), //5弾
  new Spright(40, 0, 41, 20), //6弾

  new Spright(15, 30, 50, 45), //7敵1 クリボー
  new Spright(70, 30, 70, 45), //8敵1 サボテンダー
  new Spright(8, 70, 15, 30), //9敵2 スライム

  new Spright(41, 20, 41, 25), //10敵弾
  new Spright(40, 0, 41, 20), //11敵弾

  new Spright(80, 50, 80, 50), //12爆発1
  new Spright(0, 110, 15, 115), //13爆発2
  new Spright(25, 110, 25, 115), //14爆発3
  new Spright(35, 110, 35, 115), //15爆発4
  new Spright(65, 110, 45, 115), //16爆発5
];
