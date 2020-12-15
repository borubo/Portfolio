"use strict";
{
  var c = document.querySelector("canvas");
  var ctx = c.getContext("2d");
  c.width = 900;
  c.height = 400;

  var perm = [];
  var val;
  var repeat;

  // 地面の描写
  while (perm.length < 255) {
    while (perm.includes((val = Math.floor(Math.random() * 255))));
    perm.push(val);
  }

  var lerp = (a, b, t) => a + ((b - a) * (1 - Math.cos(t * Math.PI))) / 2;

  var noise = (x) => {
    x = (x * 0.01) % 255;
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
  };

  // プレイヤーの描写
  var player = new (function () {
    this.x = c.width / 2;
    this.y = 0;
    this.ySpeed = 0;
    this.rot = 0;
    this.rSpeed = 0;

    this.img = new Image();
    this.img.src = "img/rider.png";

    this.draw = function () {
      var p1 = c.height - noise(t + this.x) * 0.25;
      var p2 = c.height - noise(t + 5 + this.x) * 0.25;

      var groundes = 0;

      if (p1 - 15 > this.y) {
        this.ySpeed += 0.11;
      } else {
        this.ySpeed -= this.y - (p1 - 15);
        this.y = p1 - 15;

        groundes = 1;
      }

      if (!playing || (groundes && Math.abs(this.rot) > Math.PI * 0.4)) {
        playing = false;
        this.rSpeed = 5;
        k.ArrowUp = 1;
        this.x -= speed * 2.5;
        clearInterval(repeat)


      // ゲームオーバー表示
      let s = "GAME OVER";
      ctx.font = "60px 'MS　ゴシック'";
      let w = ctx.measureText(s).width;
      let x = c.width / 2 - w / 2;
      let y = c.height / 2 - 20;
      ctx.lineWidth = 4;
      ctx.strokeText(s, x, y);
      ctx.fillStyle = "white";
      ctx.fillText(s, x, y);
      }

      var angle = Math.atan2(p2 - 15 - this.y, this.x + 5 - this.x);

      this.y += this.ySpeed;

      if (groundes && playing) {
        this.rot -= (this.rot - angle) * 0.5;
        this.rSpeed = this.rSpeed - (angle - this.rot);
      }

      // 操作方法の指示
      this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
      this.rot -= this.rSpeed * 0.1;

      // ボタン操作（スマホ用）
      document.getElementById("Rturn").addEventListener("click", () => {
        this.rSpeed -= 0.003;
      });
      document.getElementById("Lturn").addEventListener("click", () => {
        this.rSpeed += 0.003;
      });

      if (this.rot > Math.PI) this.rot = -Math.PI;
      if (this.rot < -Math.PI) this.rot = Math.PI;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.drawImage(this.img, -30, -30, 60, 60);

      ctx.restore();
    };
  })();

  var t = 0;
  var speed = 0;
  var playing = true;
  var k = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };
  function loop() {
    // 上下のキーで速度調整
    // speed -= speed - (k.ArrowUp - k.ArrowDown) * 1.1;

    speed = 1;
    t += 10 * speed;
    ctx.fillStyle = "skyblue";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0, c.height);

    for (var i = 0; i < c.width; i++) {
      ctx.lineTo(i, c.height - noise(t + i) * 0.25);
    }

    ctx.lineTo(c.width, c.height);

    ctx.fill();
    player.draw();
    requestAnimationFrame(loop);
  }
  onkeydown = (d) => (k[d.key] = 1);
  onkeyup = (d) => (k[d.key] = 0);

  loop();

  // 記録表示
    var count = 0;
    var actuon = document.querySelector(".record");
    repeat = setInterval(function() {
      count += 1;
      actuon.innerHTML = `Score Mileage：${count}m`;
    }, 100);
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
