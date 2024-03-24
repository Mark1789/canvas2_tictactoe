let canvas = document.querySelector('canvas');
let body = document.querySelector('body');
let menu = document.querySelector('.menu')
let burger = document.querySelector('.burger');
let recycle = document.querySelector('.recycle');
let winner = document.querySelector('.winner');


let box1 = document.querySelector('.chooseBox1');
let chooseCross = document.querySelector('.cross');
let chooseZero = document.querySelector('.zero');

let box2 = document.querySelector('.chooseBox2');
let chooseMax = document.querySelector('.max');
let chooseNorm = document.querySelector('.norm');


let ctx = canvas.getContext('2d');
body.style.height = window.innerHeight + 'px';
menu.style.display = 'flex';
box2.style.left = window.innerWidth + 'px';

canvas.width = 270;
canvas.height = 270;

let cross = new Image();
cross.src = "cross.png";

let zero = new Image();
zero.src = "zero.png";

let human = {
  img: cross,
  sign: 'x',
  step: true,
}
let computer = {
  img: zero,
  sign: 'o',
  step: false,
}
let score = 0;
let crutch = true;
let stepOk = 0;
let field = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let win = false;
let deg = 0;
let normal = false;
let mode;

let squares = [
  {id: 0, x: 1, y: 1},
  {id: 1, x: 91, y: 1},
  {id: 2, x: 181, y: 1},
  {id: 3, x: 1, y: 91},
  {id: 4, x: 91, y: 91},
  {id: 5, x: 181, y: 91},
  {id: 6, x: 1, y: 181},
  {id: 7, x: 91, y: 181},
  {id: 8, x: 181, y: 181}
  ];
  
let widthSquare = 89;
let heightSquare = 89;

function reloadField () {
  for (let i = 0; i < field.length; i += 1) {
    ctx.beginPath();
    ctx.fillStyle = '#362E23';
    ctx.rect(squares[i].x, squares[i].y, widthSquare, heightSquare);
    ctx.fill();
    ctx.closePath();
  }
}
reloadField();

function checkLines (a, s, d, array, playerSign, priority) {
  if (priority === 1) {
    for (let i = a; i < s; i += d) {
      if (field[i] === playerSign) {
        score += 1;
      }
    }
    if (score === 3 && playerSign === computer.sign) {
      winner.innerHTML = 'КОМПЬЮТЕР ВЫИГРАЛ';
      human.step = false;
    }
    if (score === 3 && playerSign === human.sign) {
      winner.innerHTML = 'ВЫ ВЫИГРАЛИ';
      win = true;
      human.step = false;
    }
  }
  if (priority === 2) {
    for (let i = a; i < s; i += d) {
      if (field[i] === playerSign) {
        score += 1;
      }
    }
    if (score === 2) {
      computerStep(array);
    }
  }
  if (priority === 3) {
     for (let i = a; i < s; i += d) {
      if (field[i] === computer.sign) {
        score += 1;
      } else if (field[i] === human.sign) {
        score -= 1
      }
    }
    if (score === 1) {
      computerStep(array);
    } 
  }
  score = 0;
}

function computerStep (indexes) {
  setTimeout(() => {
    for (let i = 0; i < 3; i += 1) {
      if (computer.step && field[indexes[i]] === 0) {
          ctx.drawImage(computer.img, squares[indexes[i]].x, squares[indexes[i]].y);
          field[indexes[i]] = computer.sign;
          computer.step = false;
          stepOk += 1;
          cycle(computer.sign, 1);
      }
    }
  }, 500)
}

function cycle (playerSign, priority) {
  checkLines(0, 3, 1, [0, 1, 2], playerSign, priority);
  checkLines(3, 6, 1, [3, 4, 5], playerSign, priority);
  checkLines(6, 9, 1, [6, 7, 8], playerSign, priority);
  checkLines(0, 7, 3, [0, 3, 6], playerSign, priority);
  checkLines(1, 8, 3, [1, 4, 7], playerSign, priority);
  checkLines(2, 9, 3, [2, 5, 8], playerSign, priority);
  checkLines(0, 9, 4, [0, 4, 8], playerSign, priority);
  checkLines(2, 7, 2, [2, 4, 6], playerSign, priority);
}

function cellFill (id) {
  if (field[id] != 0) {
    return false;
  }
  return true;
}

function getCellRandom () {
  let random = Math.floor(Math.random() * 9);
  if (field[random] === 0) {
    return random;
  } else {
    return getCellRandom();
  }
}

function ai (id) {
  if (normal) {
    setTimeout(() => {
      let cellRandom = getCellRandom();
      ctx.drawImage(computer.img, squares[cellRandom].x, squares[cellRandom].y);
      field[cellRandom] = computer.sign;
      computer.step = false;
    }, 500)
    normal = false;
    crutch = false;
    return
  } else if (field[4] === 0 && crutch) {
    setTimeout(() => {
      ctx.drawImage(computer.img, squares[4].x, squares[4].y);
      field[4] = computer.sign;
      computer.step = false;
    }, 500)
    crutch = false;
    return
  } else if (field[4] === human.sign && crutch) {
    setTimeout(() => {
      ctx.drawImage(computer.img, squares[2].x, squares[2].y);
      field[2] = computer.sign;
      computer.step = false;
    }, 500);
    crutch = false;
    return
  }
  
  cycle(computer.sign, 2);
  cycle(human.sign, 2);
  cycle(computer.sign, 3);
  
  setTimeout(() => {
    if (stepOk === 0) {
      winner.innerHTML = 'НИЧЬЯ';
    }
  }, 600)
}

canvas.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  if (human.step) {
    stepOk = 0;
    if (!computer.step) {
      let rect = canvas.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      
      squares.forEach(square => {
        ctx.beginPath();
        ctx.rect(square.x, square.y, widthSquare, heightSquare);
    
        if (ctx.isPointInPath(x, y)) {

          if (cellFill(square.id)) {
            ctx.drawImage(human.img, square.x, square.y);
            field[square.id] = human.sign;
            cycle(human.sign, 1);
            
            if (!win) {
              ai(square.id);
              computer.step = true;
            }
            
          }
          
        }
        
      })
    }
  }
})

burger.addEventListener('pointerdown', () => {
  event.preventDefault();
  menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
  startBoxes();
})

function startBoxes () {
  box1.style.left = '0px';
  box2.style.left = window.innerWidth + 'px';
}

function defaultParam (obj1, obj2) {
  reloadField();
  if (obj1 && obj2) {
    human = obj1;
    computer = obj2;
  }
  human.step = true;
  computer.step = false;
  win = false;
  score = 0;
  crutch = true;
  stepOk = 0;
  field = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  winner.innerHTML = '';
  if (mode === 'normal') {
    normal = true;
  } else {
    normal = false;
  }
}

chooseCross.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  defaultParam({img: cross, sign: 'x', step: true}, {img: zero, sign: 'o', step: false});
  box1.style.left = -window.innerWidth + 'px';
  box2.style.left = '0px';
})
chooseZero.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  reloadField();
  defaultParam({img: zero, sign: 'o', step: true}, {img: cross, sign: 'x', step: false});
  box1.style.left = -window.innerWidth + 'px';
  box2.style.left = '0px';
})

chooseMax.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  menu.style.display = 'none';
  startBoxes();
  mode = 'max';
  normal = false;
})
chooseNorm.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  menu.style.display = 'none';
  startBoxes();
  normal = true;
  mode = 'normal';
})

function rotate () {
  deg += 360;
  recycle.style.transform = 'rotate(' + deg + 'deg)';
}

recycle.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  rotate();
  defaultParam();
})
