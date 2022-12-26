const flappy = document.getElementById("flappy");  // get the image element
generatePipes();
let pipe = document.getElementById("pipe");
let pos_x = 0;  // initialize the x position of the image
let pos_y = 0;
let arr_walls = [];
let score = 0;
let gameState = true;
const speed = 1;  // set the speed to 5
const gravity = 1.5;
const jump = 50;
const push = 25;
const halfWindowHeight = window.innerHeight / 2;
pos_y = halfWindowHeight;

window.onkeypress = function(event) {
  if (event.code === 'Space') {
    // Update the position vertically here
  var textElement = document.createElement('div');
  textElement.textContent = '+50';
  textElement.style.position = 'absolute';
  textElement.style.left = `${flappy.offsetLeft}px`;
  textElement.style.top = `${flappy.offsetTop}px`;
  textElement.style.color = 'red'
  textElement.style.fontSize = '24px'
  document.body.appendChild(textElement);
  setTimeout(function() {
    document.body.removeChild(textElement);
  }, 1000);
    pos_y -= jump;
    flappy.style.top = pos_y + 'px';
    pos_x += push;
    flappy.style.left = pos_x + "px";
  }
};

function detectCollision(flappy, wall) {
  // Get the dimensions of the flappy bird and wall
  const flappyRect = flappy.getBoundingClientRect();
  const wallRect = wall.getBoundingClientRect();

  // Check if the flappy bird and wall are intersecting
  if (flappyRect.right < wallRect.left || flappyRect.left > wallRect.right || flappyRect.bottom < wallRect.top || flappyRect.top > wallRect.bottom) {
    return false;
  }
  return true;
}

function detectFlappyExitVertical(flappy){
    // Get the bounding rectangle for the Flappy Bird image
    const flappyRect = flappy.getBoundingClientRect();
    // Check if the bottom edge of the Flappy Bird image is below the bottom boundary of the viewport
    if (flappyRect.top > window.innerHeight) {
      // The Flappy Bird image has crossed the bottom boundary
      pos_x = -100;
      return true;
    }
    return false;   
}

function detectFlappyExitHorizontal(flappy){
    // Get the DOMRect object for the flappy image
    const flappyRect = flappy.getBoundingClientRect();
    // Check if the right side of the flappy image rectangle has crossed the right boundary of the window
    if (flappyRect.left > window.innerWidth) {
      // The flappy image has crossed the right boundary of the window
      return true;
    }
    return false;
}

function flappyPassWall(flappy, wall){
    const flappyRect = flappy.getBoundingClientRect();
    const wallRect = wall.getBoundingClientRect();
    if ((flappyRect.bottom < wallRect.top) &&
        (flappyRect.left >= wallRect.left && flappyRect.right <= wallRect.right)) {
      // Flappy image has crossed the wall
      return true;
    }
    return false;   
}

function flappyFall(flappy, wall){
    const wallRect = wall.getBoundingClientRect();
    if(detectCollision(flappy, wall)){
        pos_y += gravity;
        flappy.style.top = pos_y + 'px';
        flappy.style.left = wallRect.left + "px";
    }
}

function flappySpawn(flappy){
    if(detectFlappyExitHorizontal(flappy)){
        pos_x = 0;
        pipe.remove();
        generatePipes();
        pipe = document.getElementById("pipe");
    }
}

function scoreSystem(flappy, wall){
    if(flappyPassWall(flappy, wall) && !arr_walls.includes(wall)){
        updateScore();
        arr_walls.push(wall);
    }
}

function updateScore(){
  score += 10;
  // Update the score tag in the HTML
  document.getElementById("score").innerHTML = score;
}

function generatePipes(){
    let pipes = [];
    let randomPos = 50;
    for(let i=0; i < 4; i++){
        randomPos = getRandomPos(50, 80);
        let pipe = document.createElement("img");
        pipe.setAttribute("id", "pipe");
        pipe.setAttribute("src", "image/Warp_Pipe"+ (i+1).toString() + ".png");
        pipe.style = "position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 0); width: 20%;";
        pipe.style.left = randomPos + "%";
        if(i == 1 || i == 2){
            pipe.style.width = "10%";
        }
        pipes.push(pipe);
    }
    let randomPipe = pipes[Math.floor(Math.random() * pipes.length)];
    flappy.after(randomPipe);   
}

function gameOver(flappy, wall){
    if((detectFlappyExitVertical(flappy) || detectCollision(flappy, wall)) && gameState){
        var gameOverTag = document.createElement("div");
        gameOverTag.innerHTML = "Game Over";
        // Set the font size of the label to 50 pixels
        gameOverTag.style.fontSize = '100px';
        // Set the text color of the label to yellow
        gameOverTag.style.color = 'yellow';
        // Set the position of the label to absolute and center it on the page
        gameOverTag.style.position = 'absolute';
        gameOverTag.style.left = '50%';
        gameOverTag.style.top = '50%';
        gameOverTag.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(gameOverTag);
        var pressEnterElement = document.createElement("div");
        pressEnterElement.textContent = "Press enter to continue";
        pressEnterElement.style.color = "white";
        pressEnterElement.style.fontSize = "50px"
        gameOverTag.appendChild(pressEnterElement);
        gameState = false;
        document.addEventListener('keypress', event => {
          if (event.key === 'Enter') {
            gameOverTag.remove();
            resetGame();
          }
        });   
    }
}

function resetGame(){
    pos_x = 0;
    pos_y = halfWindowHeight;
    arr_walls = [];
    gameState = true;
    score = 0;
    document.getElementById("score").innerHTML = score;
    pipe.remove();
    generatePipes();
    pipe = document.getElementById("pipe");
}

function getRandomPos(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function animate() {
  // update the x position of the image
  pos_x += speed;
  flappy.style.left = pos_x + "px";  // set the left style property of the image to the new x position
  pos_y += gravity;
  flappy.style.top = pos_y + 'px';
//   if (detectCollision(flappy, pipe)){
//     alert("collision detected");
//   }
  flappyFall(flappy, pipe);
//   detectFlappyExitVertical(flappy);
//   detectFlappyExitHorizontal(flappy);
//   flappyPassWall(flappy, pipe);
  flappySpawn(flappy);
  scoreSystem(flappy, pipe);
  gameOver(flappy, pipe);
  // request another animation frame
  requestAnimationFrame(animate);
}

// start the animation
animate();

document.body.style.backgroundColor = "skyblue";
document.body.style.overflow = "hidden";

