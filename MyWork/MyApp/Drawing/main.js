"use strict"
{
  const canvas = document.getElementById("myCanvas");
  const context = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 400;

  context.rect(0,0,canvas.width,canvas.height);
  context.fillStyle = "#fff";
  context.fill();

  let mouse = {x:0, y:0};

  canvas.addEventListener("mousemove", function(e){
  mouse.x = e.pageX - this.offsetLeft;
  mouse.y = e.pageY - this.offsetTop;
  }, false);

  canvas.addEventListener("mousedown" ,function(e){
    context.beginPath();
    context.moveTo(mouse.x, mouse.y);

    canvas.addEventListener("mousemove",onPaint,false)
  }, false);

  canvas.addEventListener("mouseup",function(){
    canvas.removeEventListener("mousemove",onPaint,false);
  })

  const onPaint = function(){
    context.lineTo(mouse.x,mouse.y);
    context.stroke()
  }

  const up = document.getElementById("up")
  const down = document.getElementById("down")
  const red = document.getElementById("red")
  const yellow = document.getElementById("yellow")
  const green = document.getElementById("green")
  const blue = document.getElementById("blue")
  const white = document.getElementById("white")
  const black = document.getElementById("black")
  const reset = document.getElementById("reset")

  up.addEventListener("click",function(){
    context.lineWidth += 1;
  });
  down.addEventListener("click",function(){
    context.lineWidth -= 1;
  });
  red.addEventListener("click",function(){
    context.strokeStyle = "rgb(255, 0, 0)";
  });
  yellow.addEventListener("click",function(){
    context.strokeStyle = "rgb(255, 255, 0)";
  });
  green.addEventListener("click",function(){
    context.strokeStyle = "rgb(0, 128, 0)";
  });
  blue.addEventListener("click",function(){
    context.strokeStyle = "rgb(0, 0, 255)";
  });
  white.addEventListener("click",function(){
    context.strokeStyle = "rgb(255, 255, 255)";
  });
  black.addEventListener("click",function(){
    context.strokeStyle = "rgb(0, 0, 0)";
  });
  reset.addEventListener("click",function(){
    location.reload();
  });

  // 終了の操作
document.getElementById("btn").addEventListener("click", () => {
  window.close();
});
}