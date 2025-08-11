const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('snakeScore');
const restartBtn = document.getElementById('restart');

const grid = 20; // size of each cell
const cols = canvas.width / grid;
const rows = canvas.height / grid;

let snake;
let food;
let dir;
let gameInterval;
let speed = 120; // ms

function start(){
  snake = [{x: Math.floor(cols/2), y: Math.floor(rows/2)}];
  dir = {x:1,y:0};
  placeFood();
  scoreEl.textContent = 0;
  clearInterval(gameInterval);
  gameInterval = setInterval(loop, speed);
}

function placeFood(){
  food = {
    x: Math.floor(Math.random()*cols),
    y: Math.floor(Math.random()*rows)
  };
}

function loop(){
  // move head
  const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
  // check collisions
  if(head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || collidedWithSelf(head)){
    gameOver();
    return;
  }
  snake.unshift(head);

  // eating
  if(head.x === food.x && head.y === food.y){
    // grow and score
    scoreEl.textContent = parseInt(scoreEl.textContent) + 1;
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function collidedWithSelf(head){
  for(let i=0;i<snake.length;i++){
    if(snake[i].x === head.x && snake[i].y === head.y) return true;
  }
  return false;
}

function draw(){
  ctx.fillStyle = '#f7f7f7';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // food
  ctx.fillStyle = '#e63946';
  ctx.fillRect(food.x*grid, food.y*grid, grid, grid);

  // snake
  ctx.fillStyle = '#2b9348';
  for(let s of snake){
    ctx.fillRect(s.x*grid, s.y*grid, grid-1, grid-1);
  }
}

function gameOver(){
  clearInterval(gameInterval);
  alert('Game Over — Score: ' + scoreEl.textContent);
}

window.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowUp' && dir.y === 0){dir = {x:0,y:-1}}
  else if(e.key === 'ArrowDown' && dir.y === 0){dir = {x:0,y:1}}
  else if(e.key === 'ArrowLeft' && dir.x === 0){dir = {x:-1,y:0}}
  else if(e.key === 'ArrowRight' && dir.x === 0){dir = {x:1,y:0}}
});

restartBtn.addEventListener('click',(e)=>{e.preventDefault();start()});

start();