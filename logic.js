console.log("Hello FCB!")

let board;
let score = 0;
let rows = 4;
let columns = 4;

function setGame() {
  // initialize the 4x4 board with all tiles set to 0
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();

      let num = board[r][c];

      updateTile(tile, num);

      document.getElementById("board").append(tile);
    }
  }
  //create 2 to begin the game
  setTwo();
  setTwo();
}

//Invoke the setGame function
setGame();

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");

    if (num > 0) {
        tile.innerText = num.toString();    

        if(num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }

    }
}

//Invoke the setGame function when the window is loaded
window.onLoad = function() {
    setGame();
}

//function that will handle the user's keyboard when they press arrow keys

function handleSlide(e){

    if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyS", "KeyA", "KeyD"].includes(e.code)) {
        
        if(e.code === "ArrowUp" || e.code === "KeyW") {
            slideUp();
            setTwo();
        } 
        else if(e.code === "ArrowDown" || e.code === "KeyS") {
            slideDown();
            setTwo();
        }
        else if(e.code === "ArrowLeft" || e.code === "KeyA") {
            slideLeft();
            setTwo();
        }
        else if(e.code === "ArrowRight" || e.code === "KeyD") {
            slideRight();
            setTwo();
        }
        document.getElementById("score").innerText = score;
    }
    checkWin();
    if (hasLost()) {
      // Timeout
      setTimeout(() => {
        alert("Game Over! You have lost the game. Game will restart.");
        alert("Click any arrow key to restart!");
        restartGame();
      }, 100);
    }
}

document.addEventListener("keydown", handleSlide);

function slideUp() {
    for (let c = 0; c < columns; c++) {
      let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

      let originalRow = row.slice();

      row = slide(row);
      // board[0][c] = row[0];
      // board[1][c] = row[1];
      // board[2][c] = row[2];
      // board[3][c] = row[3];
      
      
      let changedIndices = [];
      for (let r = 0; r < rows; r++) {
        if (originalRow[r] !== row[r]) {
          changedIndices.push(r);
        }
      }

      for (let r = 0; r < rows; r++) {
        board[r][c] = row[r];
        let tile = document.getElementById(r.toString() + "-" + c.toString());
        let num = board[r][c];
        updateTile(tile, num);

        // if the original number is not equal to the new number and the new number is not 0 then animate the tile to slide from the bottom
        if (changedIndices.includes(r) && num !== 0) {
          tile.style.animation = "slide-from-bottom 0.3s";
          setTimeout(() => {
            tile.style.animation = "";
          }, 300);
        }
      }   
  }
}

function slideDown() {
  // console.log("You slide downward!");
  for (let c = 0; c < columns; c++) {
    // In two dimensional array, ther first number represents row, and second is column

    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    let originalRow = row.slice();

    row = slide(row);
    // board[0][c] = row[0];s
    // board[1][c] = row[1];
    // board[2][c] = row[2];
    // board[3][c] = row[3];wsw
    row.reverse();
    row = slide(row);
    row.reverse();
    // Animation
    let changedIndices = [];
    for (let r = 0; r < rows; r++) {
      if (originalRow[r] !== row[r]) {
        changedIndices.push(r);
      }
    }

    for (let r = 0; r < rows; r++) {
      // sets the value of the board array back to the values of the modified row, essentially updating the column in the game board.
      board[r][c] = row[r];

      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);

      if (changedIndices.includes(r) && num !== 0) {
        tile.style.animation = "slide-from-top 0.3s";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }
    }
  }
}


function slideLeft() {
    // iterate through each row
    for (let r = 0; r < rows; r++) {
        let row = board[r];

        let originalRow = row.slice();
        row = slide(row);
        board[r] = row;

        for(let c = 0; c < columns; c++) {
          let tile = document.getElementById(r.toString() + "-" + c.toString());
          let num = board[r][c];
          updateTile(tile, num);

          // if the original number is not equal to the new number and the new number is not 0 then animate the tile to slide from the right
          if (originalRow[c] !== num && num !== 0) {
            tile.style.animation = "slide-from-right 0.3s";
            setTimeout(() => {
              tile.style.animation = "";
            }, 300);
          }
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = row.slice();
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for(let c = 0; c < columns; c++) {
          let tile = document.getElementById(r.toString() + "-" + c.toString());
          let num = board[r][c];
          updateTile(tile, num);
          // if the original number is not equal to the new number and the new number is not 0 then animate the tile to slide from the right
          if (originalRow[c] !== num && num !== 0) {
            tile.style.animation = "slide-from-left 0.3s";
            setTimeout(() => {
              tile.style.animation = "";
            }, 300);
          }
        }
    }
}

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);

    for (let i = 0; i < row.length-1; i++) {
        // if the current number is equal to the next number
        if(row[i] === row[i + 1]) {
            row[i] *= 2;
            score   += row[i];
            row[i + 1] = 0;
        }
    }
    row = filterZero(row);

    while (row.length < columns) {
      row.push(0);
    }
    return row;
}

function hasEmptyTile() {

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 0) {
        //at least one zero in the board
        return true;
      }
    }
  }
  return false;
}

function setTwo() {
  if (!hasEmptyTile()) {
    return;
  }
  let found = false;
  while (!found) {
    //find random row and column to place a 2 in
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    if (board[r][c] == 0) {
      board[r][c] = 2;
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      tile.innerText = "2";
      tile.classList.add("x2");

      // Apply pop-up animation
      tile.style.animation = "pop-up 0.3s";
      setTimeout(() => {
        tile.style.animation = "";
      }, 300);
      found = true;
    }
  }
}

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 2048 && !is2048Exist) {
                is2048Exist = true;
                alert("You win!");
            }
            else if (board[r][c] == 4096 && !is4096Exist) {
                is4096Exist = true;
                alert("You win!");
            }
            else if (board[r][c] == 8192 && !is8192Exist) {
                is8192Exist = true;
                alert("You win!");
            }
        }
    }
}

function hasLost() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      //we checked whether there is an empty tile or none
      if (board[r][c] == 0) {
        return false;
      }

      const currentTile = board[r][c];
      // If there adjacent cells/tile for possible merging
      if (
        (r > 0 && board[r - 1][c] === currentTile) ||
        (r < rows - 1 && board[r + 1][c] === currentTile) ||
        (c > 0 && board[r][c - 1] === currentTile) ||
        (c < columns - 1 && board[r][c + 1] === currentTile)
      ) {
        return false;
      }
    }
  }
  //No pssible moves left or empty tile, user has lost.
  return true;
}

function restartGame() {
    board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    
    score = 0;

    setTwo();
}   

let startX = 0;
let startY = 0;

document.addEventListener("touchstart", function(e) {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  console.log(startX, startY);
});

document.addEventListener('touchmove', (e) => {
  if(!e.target.className.includes("tile")) {
    return;
  }
  e.preventDefault();
}, {passive: false});


document.addEventListener("touchend", (e) => {

  if(!e.target.className.includes("tile")) {
    return;
  }
  
  let diffX = startX - e.changedTouches[0].clientX; 
  let diffY = startY - e.changedTouches[0].clientY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe
    if (diffX > 0) {
      slideLeft(); // Call a function for sliding left
      setTwo(); // Call a function named "setTwo"
    } else {
      slideRight(); // Call a function for sliding right
      setTwo(); // Call a function named "setTwo"
    }
  } else {
    // Vertical swipe
    if (diffY > 0) {
      slideUp(); // Call a function for sliding up
      setTwo(); // Call a function named "setTwo"
    } else {
      slideDown(); // Call a function for sliding down
      setTwo(); // Call a function named "setTwo"
    }
  }
  document.getElementById("score").innerText = score;
  checkWin();
  if (hasLost()) {
    // Timeout
    setTimeout(() => {
      alert("Game Over! You have lost the game. Game will restart.");
      alert("Click any arrow key to restart!");
      restartGame();
    }, 100);
  }
});
