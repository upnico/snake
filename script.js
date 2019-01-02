window.onload = function()
{
  function initGame()
  {

      var canvas = document.createElement('canvas');
      canvas.width = canvasWidth
      canvas.height = canvasHeight
      canvas.style.border = "1px solid black"
      document.body.style.color = "white";
      canvas.style.backgroundcolor = "#444"
      document.body.appendChild(canvas)
      context = canvas.getContext('2d');
      serpent = new snake([[6,4], [5,4], [4,4]], "right");
      pomme = new apple([10,10]);
      score = 0;
      refreshCanvas();

  }
  function drawScore()
  {
        context.save();
        context.fillText("Score: " + score.toString(), 5, canvasHeight - 10);
        context.restore();
  }
  function refreshCanvas()
  {
    serpent.advance();
    if (serpent.checkCollision())
    {
      gameOver();
    }
    else
    {
      if(serpent.isEatingApple(pomme))
      {
        score++;
        delay --;
        serpent.ateApple = true;
        do
        {
            pomme.setNewPosition();
        }
        while(pomme.isOnSnake(serpent) === true)
      }
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      serpent.drawSnake();
      pomme.drawApple();
      drawScore();
      timeout = setTimeout(refreshCanvas, delay);
    }
  }

  function drawBlock(context, position)
  {
    var x = position[0] * blockSize;
    var y = position[1] * blockSize;
    context.fillRect(x, y, blockSize, blockSize);
  }
  function gameOver()
  {
      context.save();
      context.fillText("Game Over", 5, 15);
      context.fillText("Press space to replay", 5,30);
      delay = 80;
      context.restore();
  }
  function restart()
  {
    serpent = new snake([[6,4], [5,4], [4,4]], "right");
    pomme = new apple([10,10]);
    score = 0;
    clearTimeout(timeout);
    refreshCanvas();
  }
  function snake(body, direction)
  {
    this.body = body;
    this.direction = direction;
    this.ateApple = false;
    this.drawSnake = function()
    {
      context.save();
      context.fillStyle = "red";
      var i = 0;
      while(i < this.body.length)
      {
        drawBlock(context, this.body[i]);
        i++;
      }
      context.restore();
    };
    this.advance = function()
    {
      var nextPosition = this.body[0].slice();
      switch(this.direction)
      {
        case "left":
        nextPosition[0] -= 1;
          break;
        case "right":
          nextPosition[0] += 1;
          break;
        case "down":
          nextPosition[1] += 1;
          break;
        case "top":
          nextPosition[1] -= 1;
          break;
        default:
          throw("invalid direction");
      }
      this.body.unshift(nextPosition);
      if(this.ateApple === true)
      {
        this.ateApple = false;
      }
      else
        this.body.pop();
    };

    this.setDirection = function(newDirection)
    {
      var allowedDirections;
      switch(this.direction)
      {
        case "left":
          allowedDirections = ["top", "down"];
          break;
        case "right":
          allowedDirections = ["top", "down"];
          break;
        case "top":
          allowedDirections = ["left", "right"];
        case "down":
          allowedDirections = ["left", "right"];
          break;
        default:
            throw("invalid direction");
      }
      if(allowedDirections.indexOf(newDirection) > -1)
      {
        this.direction = newDirection;
      }
    }
    this.checkCollision = function()
    {
      var wallcolision = false;
      var snakeColision = false;
      var head = this.body[0];
      var rest = this.body.slice(1);
      var snakeX = head[0];
      var snakeY = head[1];
      var MinX = 0;
      var MinY = 0;
      var MaxX = whidthBlocks - 1;
      var MaxY = heightBlocks - 1;
      var isNotHorizontal = snakeX < MinX || snakeX > MaxX;
      var isNotVertical = snakeY < MinY || snakeY > MaxY;

      if(isNotVertical || isNotHorizontal)
      {
        wallcolision = true;
      }
      for (var i = 0; i < rest.length; i++)
      {
        if (snakeX === rest[i][0] && snakeY === rest[i][1])
        {
          snakeColision = true;
        }
      }
      return wallcolision || snakeColision;
    }
    this.isEatingApple = function(appleToEat)
    {
      var head = this.body[0];
      if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
      {
        return true;
      }
      else
      {
      return false;
      }
    };
  }

  document.onkeydown = function touch(e)
  {
    var key = e.keyCode
    var newDirection;
    switch(key)
    {
      case 37:
        newDirection = "left";
        break;
      case 38:
        newDirection = "top";
        break;
      case 39:
        newDirection = "right";
        break;
      case 40:
        newDirection = "down";
        break;
      case 32:
        restart();
        return;
      default:
        return;
    }
    serpent.setDirection(newDirection);
  }
  function apple(position)
  {
    this.position = position;
    this.drawApple = function() {
      context.save();
      context.fillStyle = "#0000FF";
      context.beginPath();
      var radius = blockSize/2;
      var x = this.position[0]*blockSize + radius;
      var y = this.position[1]*blockSize + radius;
      context.arc(x,y, radius, 0, Math.PI*2, true);
      context.fill();
      context.restore();
    };

  this.setNewPosition = function() {
    var newX = Math.round(Math.random() * (whidthBlocks - 1));
    var newY = Math.round(Math.random() * (heightBlocks - 1));
    this.postion = [newX, newY];
    pomme = new apple([newX,newY]);
  };
  this.isOnSnake = function(snake)
  {
    var isOnSnake = false;
    for(var i = 0; i < snake.body.length ; i++)
    {
      if (this.position[0] === snake.body[i][0] && this.position[1] === snake.body[i])
      {
        isOnSnake = true;
      }
    }
    return isOnSnake;
  };
}
  var canvasWidth = 900;
  var canvasHeight = 400;
  var blockSize = 20;
  var whidthBlocks = canvasWidth/blockSize;
  var heightBlocks = canvasHeight/blockSize;
  var context;
  var delay = 80;
  var serpent;
  var pomme;
  var score = 0;
  var timeout;
  initGame();

}
