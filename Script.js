var grid = document.getElementById("grids");
var DEBUG = false; //Turn this variable to true to see where the mines are
var DEBUGMineLetter = "O"
var win = false;
var lost = false;
var rows = document.getElementById('new_rows').value; //initial values stored
var columns = document.getElementById('new_columns').value;
var minecount = 10;
var defaultMineTable = [[1,3],[3,0],[4,2],[4,5],[4,7],[6,9],[8,9],[7,7],[9,3],[9,9]]; //offline mines
var connectionAquired = true


//prevent right clicking
window.addEventListener('contextmenu', function (e) { 
  e.preventDefault(); 
}, false);


//generate the board inside the table class
function generate(rows=10, columns=10, minearray=[]) 
{
  win=false;
  lost=false;
  rows = 10;
  columns = 10;
  mineCount = 10;
  if (connectionAquired)
  {
    //if the connection is successful then the values are passed from the inputs
    rows = document.getElementById('new_rows').value;
    columns =  document.getElementById('new_columns').value;
    minecount = document.getElementById('new_mines').value;
  }
  if (rows <= 40 && columns <= 40 && (minecount - 1 < (rows * columns)))
  {
  grid.innerHTML="";
  for (var x = 0; x < rows; x++) {
    row = grid.insertRow(x);
    for (var y=0; y < columns; y++) 
    {
      box = row.insertCell(y);
      //Onclick functions set
      box.onclick = function() {
      boxClicked(this, event.button);
      };
      box.oncontextmenu = function() { 
      boxClicked(this, event.button);
      };
      //attributes created
      var mine = document.createAttribute("Mine");
      var flag = document.createAttribute("flag");
      flag.value = "false"; 
      mine.value = "false";
      box.setAttributeNode(mine);
      box.setAttributeNode(flag);
     }
    }
    if (connectionAquired)
    {
      placeMines(rows,columns,minearray);
    }
    else
    {
      placeMines(10,10,defaultMineTable)
    }
  }
  //prevent higher values from being enterd
  else if(rows > 40 || columns > 40)
  {
    alert("To many rows/columns!")
  }
  // prevent bombs from being over the allowed amount
  else
  {
    alert("To many bombs! Maximum " + ((columns * rows)).toString() + " number of mines!")
  }
  
}


function showtableWin() {
  //display green backround of all boxes with numbers or empty
  for (var x = 0; x < rows; x++) {
    for (var y = 0; y < columns; y++) {
      var box = grid.rows[x].cells[y];
      if (box.className=="clicked"||box.className=="one"||box.className=="two"||box.className=="threeOrMore") {
        box.className="win";
      }
    }
  }
}

function showtableLost() {
  //display all mines in red
  for (var x = 0; x < rows; x++) {
    for (var y = 0; y < columns; y++) {
      var box = grid.rows[x].cells[y];
      if (box.getAttribute("Mine")=="true") {
        box.className="mine";
      }
    }
  }
}


function placeMines(r,c,location) {
  //scatter mines in the received locations
  for (var x=0; x < rows; x++) {
    for(var y=0; y < columns; y++)
      for(var i=0; i < location.length; i++)
      {
        var box = grid.rows[x].cells[y];
        var mineloc = location[i];
        if (x == mineloc[0] && y == mineloc[1])
        {
            //set attributes for the mines to true (armed)
            box.setAttribute("mine","true");
            if (DEBUG)
            {
              box.innerHTML="O";
            }
        }
      }

    }
  }

function checkIfWon() {
  //local var for checking if bomb is clicked
  var levelWon = true;
  for (var x=0; x<rows; x++) {
    for(var y=0; y<columns; y++) {
      var box = grid.rows[x].cells[y];
      if ((box.getAttribute("mine")=="false") && (box.innerHTML=="")) {
        levelWon=false;
      }
      if (box.getAttribute("flag")=="false"&&box.getAttribute("mine")=="true") {
        levelWon=false;
      }
    }
  }
  //show if lost
  if (levelWon&&lost==true) {
    showtableLost();
  }
  //show if won
  else if (levelWon&&lost==false) {
    win = true
    showtableWin();
    alert("winner, winner, chicken dinner")
  }
}



function boxClicked(box, whichbutton) {

  if (lost==false&&win==false)
  {
    //Check if the left button is being pressed
    if(whichbutton == 0 && box.className!="flag" && box.className!="clicked"&&box.className!="one"&&box.className!="two"&&box.className!="threeOrMore") {
        if (box.getAttribute("Mine")=="true") 
        {
            showtableLost();
            alert("Game Over");
            lost = true;
        }
        else {
          box.className="clicked";
          var adjacentMines = 0;
          var flagCount = 0;
          var boxR = box.parentNode.rowIndex; //row loc from parent
          var boxC = box.cellIndex; //cell loc
          //
          for (var x = Math.max(boxR-1,0); x <= Math.min(boxR+1,rows-1); x++) 
          {
            for(var y = Math.max(boxC-1,0); y <= Math.min(boxC+1,columns-1); y++) 
            {
              if (grid.rows[x].cells[y].getAttribute("Mine")=="true") {
                adjacentMines++;
              }
              if (grid.rows[x].cells[y].getAttribute("flag")=="true") {
                flagCount++;
              }
            }
          }
        //fill clicked spaces with zero's
        box.innerHTML="0";
        if (adjacentMines > 0) {
            box.innerHTML= (adjacentMines).toString();
            //decide on a color depending on neighbours
            if (adjacentMines == 1) {
              box.className = "one";
            }
            else if (adjacentMines == 2) {
              box.className = "two";
            }
            else if (adjacentMines >= 3) {
              box.className = "threeOrMore";
            }
        }
        else {
          box.className = "clicked"
        }

        if (adjacentMines==0) { 
          //recursion through neigbours on two axis (they are swapped in name for erla's comfort)
          for (var x = Math.max(boxR-1,0); x <= Math.min(boxR+1,rows-1); x++) 
          {
            for(var y = Math.max(boxC-1,0); y <= Math.min(boxC+1,columns-1); y++) 
            {
              if (grid.rows[x].cells[y].innerHTML=="")
              {
                boxClicked(grid.rows[x].cells[y], whichbutton);
              }
            }
          }
        }
        checkIfWon();
      }
    }
    //Check if the right button is being pressed
    if(whichbutton==2) {
      if (box.className=="flag" && box.getAttribute("Mine") == "true") {
        box.className="";
        if (DEBUG) 
        {
          box.innerHTML=DEBUGMineLetter
        }
      }
      else if (box.className=="flag") {
        box.className="";
      }
      else if (box.className!="clicked"&&box.className!="one"&&box.className!="two"&&box.className!="threeOrMore") {
        box.className="flag";
        box.setAttribute("flag","true")
      }
      checkIfWon();
    }
  }
}

//hide the settings if the user cannot post to the server
function hideSettings() {
  var x = document.getElementById("settings");
    x.style.display = "none";
}



function doAjax() {


//change text on press
document.getElementById("generateButton").innerHTML ="Replay!"

//store values for posting
minecount = document.getElementById('new_mines').value;
rows = document.getElementById('new_rows').value;
columns = document.getElementById('new_columns').value;

var url = 'https://veff213-minesweeper.herokuapp.com/api/v1/minesweeper';

//Perform an AJAX POST request to the url, and set the param 'myParam' in the request body to paramValue
    axios.post(url, {'rows': rows, 'cols': columns, 'mines': minecount})
        .then(function (board) {
            document.getElementById("Intro").innerHTML = "";
            var x = JSON.parse(JSON.stringify(board.data));
            generate(x.board.rows,x.board.cols,x.board.minePositions);
        })
        .catch(function (error) {
            document.getElementById("Intro").innerHTML = "Connection Failed!<br> Using default settings! <br> Controls disabled!";
            connectionAquired = false;
            hideSettings()
            //default settings
            generate(10,10,defaultMineTable);
            console.log(error);
            
        })
        .then(function () {

            
    });
  }
