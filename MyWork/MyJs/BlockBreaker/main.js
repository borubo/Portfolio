"use strict";
{

  // キャンバスの取得とプロパティの設定
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var x = canvas.width / 2;
  var y = canvas.height - 30;

  var dx = 2;
  var dy = -2;

  var ballRadius = 10;

  var paddleHeight = 10;
  var paddleWidth = 75;
  var paddleX = (canvas.width - paddleWidth) / 2;

  var rightPressed = false;
  var leftPressed = false;

  var score = 0;
  var lives = 3;

  var brickRowCount = 6;
  var brickColumnCount = 5;
  var brickWidth = 75;
  var brickHeight = 20;
  var brickPadding = 10;
  var brickOffsetTop = 30;
  var brickOffsetLeft = 30;

  // ブロックの設定
  var bricks = [];

  for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
  // ブロックの検知
  function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];

        if (b.status == 1) {
          if (
            x > b.x &&
            x < b.x + brickWidth &&
            y > b.y &&
            y < b.y + brickHeight
          ) {
            dy = -dy;
            b.status = 0;
            score++;
            // ゲームクリア時の設定
            if (score == brickRowCount * brickColumnCount) {
              if(confirm(
                `
                GAME CLEAR
                Would you like to play again?
                `
                )){
                location.reload();
              }
              window.close();
            }
          }
        }
      }
    }
  }

  // スコアのカウント
  function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score:" + score, 8, 20);
  }
  // 残りの挑戦回数
  function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives:" + lives, canvas.width - 65, 20);
  }
  // ボールの描写
  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }
  // 反射棒の描写
  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }
  // ブロックの描写
  function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
      for (var r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status == 1) {
          var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;

          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }
  // 書く描写の起動
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawBricks();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    // ボールの反射
    if ((x + dx > canvas.width - ballRadius) | (x + dx < ballRadius)) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        lives--;
        // ゲームオーバーの設定
        if (!lives) {

          // ゲームオーバー表示
          let s = "GAME OVER";
          ctx.font = "60px 'MS　ゴシック'";
          let w = ctx.measureText(s).width;
          let x = canvas.width / 2 - w / 2;
          let y = canvas.height / 2 - 20;
          ctx.lineWidth = 4;
          ctx.strokeText(s, x, y);
          ctx.fillStyle = "#000";
          ctx.fillText(s, x, y);
          return

          // 挑戦回数が残っている場合にボールを落とした時の処理
        } else {
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 2;
          dy = -2;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }
    // パドルが画面外から出なくするための描写
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
  }

  // パドル操作の設定
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
  function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = true;
    }
  }
  function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
      rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
      leftPressed = false;
    }
  }

  // マウス操作
  function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
    }
  }

      // ボタン操作（スマホ用）
  document.getElementById("left").addEventListener("click", () => {
    if(paddleX < 0 + paddleWidth) return
    paddleX -= paddleWidth
  });
  document.getElementById("right").addEventListener("click", () => {
    if(paddleX > canvas.width - paddleWidth) return
    paddleX += paddleWidth
  });

  draw();
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

