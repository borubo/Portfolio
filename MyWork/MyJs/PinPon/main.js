"use strict";
{
  var count = 0;

  class Vec {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }

    get len() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    set len(value) {
      const fact = value / this.len;
      this.x *= fact;
      this.y *= fact;
    }
  }

  class Rect {
    constructor(w, h) {
      this.pos = new Vec();
      this.size = new Vec(w, h);
    }

    get left() {
      return this.pos.x - this.size.x / 2;
    }

    get right() {
      return this.pos.x + this.size.x / 2;
    }

    get top() {
      return this.pos.y - this.size.y / 2;
    }

    get bottom() {
      return this.pos.y + this.size.y / 2;
    }
  }

  class Ball extends Rect {
    constructor() {
      super(10, 10);
      this.vel = new Vec();
    }
  }

  class Player extends Rect {
    constructor() {
      super(20, 100);
      this.score = 0;
    }
  }
  // 白い棒の描写
  class Pong {
    constructor(canvas) {
      this._canvas = canvas;
      this._context = canvas.getContext("2d");

      this.ball = new Ball();

      this.players = [new Player(), new Player()];

      this.players[0].pos.x = 40;
      this.players[1].pos.x = this._canvas.width - 40;
      this.players.forEach((player) => {
        player.pos.y = this._canvas.height / 2;
      });

      let lastTime;

      const callback = (millis) => {
        if (lastTime) {
          this.update((millis - lastTime) / 1000);
        }
        lastTime = millis;
        requestAnimationFrame(callback);
      };

      callback();

      this.reset();
    }
    // ボールの反射
    collide(player, ball) {
      if (
        player.left < ball.right &&
        player.right > ball.left &&
        player.top < ball.bottom &&
        player.bottom > ball.top
      ) {
        const len = ball.vel.len;
        ball.vel.x = -ball.vel.x;
        ball.vel.y += 300 * (Math.random() - 0.5);
        ball.vel.len = len * 1.05;
        Count();
      }
    }
    // 背景描写
    draw() {
      this._context.fillStyle = "#999";
      this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

      this.drawRect(this.ball);

      this.players.forEach((player) => this.drawRect(player));
    }



    // ボール描写
    drawRect(rect) {
      this._context.fillStyle = "#fff";
      this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }

    // 再起動
    reset() {
      this.ball.pos.x = this._canvas.width / 2;
      this.ball.pos.y = this._canvas.height / 2;

      this.ball.vel.x = 0;
      this.ball.vel.y = 0;
    }
    // 初動処理
    start() {

      if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
        this.ball.vel.x = 300 * (Math.random() > 0.5 ? 1 : -1);
        this.ball.vel.y = 300 * (Math.random() * 2 - 1);

        this.ball.vel.len = 400;
      }
    }
    // 点数カウント & ゲームオーバー
    update(dt) {
      this.ball.pos.x += this.ball.vel.x * dt;
      this.ball.pos.y += this.ball.vel.y * dt;
      // 上下の壁に当たったとき
      if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
        this.ball.vel.y = -this.ball.vel.y;
      }
      this.players[1].pos.y = this.ball.pos.y;

      this.players.forEach((player) => this.collide(player, this.ball));
      this.draw();
           // ボールが左右の壁に当たったとき
      if (this.ball.left < 0 || this.ball.right > this._canvas.width){
        let s = "GAME OVER";
        this._context.font = "60px 'MS　ゴシック'";
        let w = this._context.measureText(s).width;
        let x = canvas.width / 2 - w / 2;
        let y = canvas.height / 2 - 20;
        this._context.lineWidth = 4;
        this._context.strokeText(s, x, y);
        this._context.fillStyle = "#000";
        this._context.fillText(s, x, y);
      }
    }
  }
  // 背景の描写
  const canvas = document.getElementById("pong");
  const pong = new Pong(canvas);
  // カーソル操作
  canvas.addEventListener("mousemove", (e) => {
    const scale = event.offsetY / event.target.getBoundingClientRect().height;
    pong.players[0].pos.y = canvas.height * scale;
  });

      // ボタン操作（スマホ用）
  document.getElementById("up").addEventListener("click", () => {
    if(pong.players[0].pos.y < 0 + 100) return
      pong.players[0].pos.y -= 100
  });
  document.getElementById("down").addEventListener("click", () => {
    if(pong.players[0].pos.y > 500 - 100) return
      pong.players[0].pos.y += 100
  });

    pong.start();

      // 記録表示
  var actuon = document.querySelector(".record");
  function Count(){
    count += 1;
    actuon.innerHTML = `Score：${count} Hit`;
  }
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

