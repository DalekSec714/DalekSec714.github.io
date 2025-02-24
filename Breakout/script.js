﻿// ###################################################################
// RequestAnimationFrame shim
//
// ###################################################################
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();




// ###################################################################
// Utility functions
//
// ###################################################################
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function valueInRange(value, min, max) {
  return (value <= max) && (value >= min);
}
 
function checkRectCollision(A, B) {
  var xOverlap = valueInRange(A.x, B.x, B.x + B.w) ||
  valueInRange(B.x, A.x, A.x + A.w);
 
  var yOverlap = valueInRange(A.y, B.y, B.y + B.h) ||
  valueInRange(B.y, A.y, A.y + A.h); 
  return xOverlap && yOverlap;
}




// ###################################################################
// Globals & Constants
//
// ###################################################################
var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 640;
var LEFT_KEY = 37;
var RIGHT_KEY = 39;
var SHIFT_KEY = 16;
var BLOCKS_PER_ROW = 10;
var BLOCK_ROWS = 6;
var BLOCK_WIDTH = CANVAS_WIDTH / BLOCKS_PER_ROW;
var BLOCK_COLOURS = [
  'rgb(199, 70, 60)',
  'orange',
  '#ffbb34',
  'rgb(74, 139, 71)',
  '#2CFC0E',
  '#0099cb'
];
var INITIAL_BALL_SPEED = 5;


var canvas = null;
var ctx = null;
var input = [];
var score = 0;
var lives = 3;
var broken=0




// ###################################################################
// Player object
//
// ###################################################################
var player = {
  width: 100,
  height: 10,
  position: { x: 0, y: 0 },
  bounds: { x: 0, y: 0, w: 0, h: 0 },
  currentBallHits: 0,
  
  init: function() {
    this.position.x = CANVAS_WIDTH/2 - this.width/2;
    this.position.y = CANVAS_HEIGHT - 30;
    currentBallHits = 0;
  },
  
  update: function() {
    // handle input
    if (input[LEFT_KEY]) {
      this.position.x -= 8;
    } else if (input[RIGHT_KEY]) {
      this.position.x += 8;
    }
    
    // restrict players movement to game bounds
    if (this.position.x < 0) {
      this.position.x = 0;
    } else if (this.position.x > CANVAS_WIDTH - this.width) {
      this.position.x = CANVAS_WIDTH - this.width;
    }
    
    // update bounds
    this.bounds.x = this.position.x;
    this.bounds.y = this.position.y;
    this.bounds.w = this.width;
    this.bounds.h = this.height;
  },
  
  draw: function() {
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
};




// ###################################################################
// Ball object
//
// ###################################################################
var ball = {
  width: 10,
  height: 10,
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  bounds: { x: 0, y: 0, w: 0, h: 0 },
  playerStick: false,
  
  init: function() {
    this.position.x = (player.position.x + player.width/2) - this.width/2;
    this.position.y = player.position.y - 15;
    this.playerStick = true;
  },
  
  launch: function() {
    this.playerStick = false;
    this.velocity.x = getRandomInt(-3, 3);
    this.velocity.y = -INITIAL_BALL_SPEED;
  },
  
  update: function() {
    if (this.playerStick) {
      // check if player presses launch
      if (input[SHIFT_KEY]) {
        this.launch();
      } 
      // constantly set to just above players paddle
      this.position.x = (player.position.x + player.width/2) - this.width/2;
      this.position.y = player.position.y - 15;
    } else {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      
      // rebound ball off walls
      if (this.position.x < 0 || this.position.x > CANVAS_WIDTH) {
        this.velocity.x = -this.velocity.x;
      } else if (this.position.y < 0) {
        this.velocity.y = -this.velocity.y;
      } else if (this.position.y > CANVAS_HEIGHT + this.height*2) {
        lives--;
        score=score+lives
        if (broken==59){
          // draw the blocks
          wall.draw();
        }
        if (lives === 0) {
          initGame();
        }
        player.currentBallHits = 0;
        this.playerStick = true;
      }
    }
          
    // update bounds
    this.bounds.x = this.position.x;
    this.bounds.y = this.position.y;
    this.bounds.w = this.width;
    this.bounds.h = this.height;
  },
  
  draw: function() {
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
};




// ###################################################################
// Block object
//
// ###################################################################
var Block = (function() {
  var Block = function(x, y, color) {
    var self = this;
    
    this.position = { x: x, y: y };
    this.width = BLOCK_WIDTH;
    this.height = 25,
    this.bounds = { x: self.position.x, y: self.position.y, w: self.width, h: self.height };
    this.color = color;
    this.hit = false;
  }
  
  Block.prototype = {
    constructor: Block,
    
    checkCollision: function() {
      return (checkRectCollision(this.bounds, ball.bounds) && !this.hit);
    },
    
    draw: function() {
      ctx.fillRect(this.position.x, this.position.y,
        this.width, this.height);
    }
  }
  
  return Block;
})();
 




// ###################################################################
// Wall object
//
// ###################################################################
var wall = {
  blocks: new Array(BLOCKS_PER_ROW * BLOCK_ROWS),
  
  init: function() {
    for (var i = 0; i < BLOCKS_PER_ROW * BLOCK_ROWS; i++) {
      var gridX = ((i) % BLOCKS_PER_ROW);
      var gridY = Math.floor((i) / BLOCKS_PER_ROW);
      var block = new Block(gridX*BLOCK_WIDTH, gridY*25, BLOCK_COLOURS[gridY]);
      this.blocks[i] = block;
    }
  },
  
  update: function() {
    for (var i = this.blocks.length - 1; i >= 0; i--) {
      var block = this.blocks[i];
      if (block.hit) {
        this.blocks.splice(i, 1);
      } else {
          if (block.checkCollision()) {
            var points;
            switch (Math.floor(i / BLOCKS_PER_ROW)) {
              case 0: points = 7; ball.velocity.y *= 1.1; broken+=1; break;
              case 1: points = 5; ball.velocity.y *= 1.1; broken+=1; break;
              case 2:
              case 3: points = 3; broken+=1; break;
              case 4:
              default: points = 1; broken+=1; break;
            }
            score += points


            block.hit = true;
            ball.velocity.y *= -1;
            
            if (this.blocks.length === 0) {
              initGame();
            }
            break;
         } 
      }    
    }
  },
  
  draw: function() {
    for (var i = 0, len = this.blocks.length; i < len; i++) {
      var block = this.blocks[i];
      if (!block.hit) {
        ctx.fillStyle = block.color;
        block.draw();
      }
    }
  }
};




// ###################################################################
// Initialization functions
//
// ###################################################################
function initCanvas() {
  // create our canvas and context
  canvas = document.getElementById('game-canvas');
  ctx = canvas.getContext('2d');
  
  // add event listeners and initially resize
  window.addEventListener('resize', resize);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  resize();
}


function initGame() {
  score = 0;
  lives = -1;
  input = [];
  player.init();
  ball.init();
  wall.init();
}


function init() {
  initCanvas();
  initGame();
}






// ###################################################################
// Drawing & Update functions
//
// ###################################################################
function checkBallPaddleCollision() {
  if (checkRectCollision(ball.bounds, player.bounds)) {
    var playerXPos = player.position.x;
    var playerCenter = playerXPos + player.width/2;
    var ballXPos = ball.position.x;
    var xFactor = (ballXPos > playerCenter) ? (ballXPos + ball.width/2) - playerCenter : (playerCenter - ballXPos) * -1;
    
    ball.velocity.x = xFactor/4;
    ball.velocity.y *= -1;
    player.currentBallHits++;
    
    if (player.currentBallHits % 4 === 0) {
      ball.velocity.y *= 1.15;
    }
  }
}


function updateGame() {
  player.update();
  ball.update();
  wall.update();
  checkBallPaddleCollision();
}


function drawGame() {
  // draw the ball and player
  ctx.fillStyle = 'white';
  ball.draw();
  player.draw();
  
  // draw the score
  ctx.font = '10px Arial';
  ctx.fillText('Score: ' + score, player.position.x, CANVAS_HEIGHT - 10);
  ctx.fillText('Lives: ' + lives, player.position.x + player.width - 35, CANVAS_HEIGHT - 10);
  
  // if ball stuck to player, render launch instruction method
  if (ball.playerStick) {
    ctx.font = '20px Arial';
    var text = 'Press shift to launch the ball!';
    var metrics = ctx.measureText(text);
    ctx.fillText(text, CANVAS_WIDTH/2 - ~~(0.5 + metrics.width/2), CANVAS_HEIGHT/2);
  }
  
  // draw the blocks
  wall.draw();
}


function animate() {
  updateGame();
  
  // clear the canvas
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
  // draw the game
  drawGame(); 
  requestAnimationFrame(animate);
}




// ###################################################################
// Event Listener functions
//
// ###################################################################
function resize() {
  var w = window.innerWidth;
  var h = window.innerHeight;


        // calculate the scale factor to keep a correct aspect ratio
  var scaleFactor = Math.min(w / CANVAS_WIDTH, h / CANVAS_HEIGHT);
  
  // resize the canvas css properties
  canvas.style.width = CANVAS_WIDTH * scaleFactor + 'px';
  canvas.style.height = CANVAS_HEIGHT * scaleFactor + 'px';
}


function onKeyDown(e) {
  e.preventDefault();
  input[e.keyCode] = true;
}


function onKeyUp(e) {
  e.preventDefault();
  input[e.keyCode] = false;
}




// ###################################################################
// Start game!
//
// ###################################################################
window.onload = function() {
  init();
  animate();
}