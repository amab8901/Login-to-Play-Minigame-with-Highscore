var myGamePiece;
var myObstacles = [];
var myScore;
var recorded;
var session;
var intervallet = setInterval(updateGameArea, 10); // 2nd argument in setInterval() is how fast the game is running
var check;

function startGame() {
  
    check = parseInt(sessionStorage.getItem("score1")); // check whether the table contains any elemenets
    if(check>0){
        getTable() // create new table if there are values to store there
    }

    session = true
    myGamePiece = new Component(30, 30, "red", 10, 120);
    myGamePiece.gravity = 0.05;
    myScore = new Component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        if(session === false) {
          return
        }
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = intervallet
        },
    clear : function(session) {
        if(session === false){
          return
        }

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function Component(width, height, color, x, y, type) {
    if(session === false){
      return
    }
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        if (session === false){
          return
        }
        ctx = myGameArea.context;
        if (this.type === "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        if(session === false){
          return
        }
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        if(session === false) {
          return
        }
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        if(session === false){
          return
        }
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    if(session === false){
      return
    }
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            if(recorded !== true){
                var table = document.getElementById("myTable");
                for(i=1; i<16; i++){
                    if(table.rows[i].getElementsByTagName("TD")[2].innerHTML === "specUser"){
                        if(table.rows[i].getElementsByTagName("TD")[1].innerHTML<myGameArea.frameNo){
                            table.rows[i].getElementsByTagName("TD")[1].innerHTML = myGameArea.frameNo
                        }
                    }
                }
                sortTable()
                saveTable()
                recorded = true;
            }

            return;

        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo === 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new Component(10, height, "green", x, 0));
        myObstacles.push(new Component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }

    myScore.text="SCORE: " + myGameArea.frameNo;

    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();

}

function everyinterval(n) {
    if(session === false) {
      return
    }
    if ((myGameArea.frameNo / n) % 1 === 0) {return true;}
    return false;
}

function accelerate(n) {
    if(session === false){
      return
    }
    myGamePiece.gravity = n;
}

function restartGame() {
    recorded = null;
    myObstacles = [];
    session = false;
    startGame()
}

function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch, xtemp, ytemp, a, b;
  table = document.getElementById("myTable");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two scores you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[1];
      y = rows[i + 1].getElementsByTagName("TD")[1];
      /*Get the two names you want to compare,
      one from current row and one from the next:*/
      a = rows[i].getElementsByTagName("TD")[2];
      b = rows[i + 1].getElementsByTagName("TD")[2];
      //check if the two rows should switch place:
      if (
          Number(x.innerHTML) < Number(y.innerHTML)
          ||
          ((Number(x.innerHTML) === Number(y.innerHTML))
          &&
          (a.innerHTML > b.innerHTML)
          )
      ) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        xtemp = rows[i].getElementsByTagName("TD")[0].innerHTML;
        ytemp = rows[i + 1].getElementsByTagName("TD")[0].innerHTML;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].getElementsByTagName("TD")[0].innerHTML = ytemp
      rows[i + 1].getElementsByTagName("TD")[0].innerHTML = xtemp

      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

// insert sessionStorage score values into the table
function saveTable() {
    var table, rows
    table = document.getElementById("myTable");
    rows = table.rows;

    sessionStorage.setItem("score1", rows[1].getElementsByTagName("TD")[1].innerHTML)
    sessionStorage.setItem("score2", rows[2].getElementsByTagName("TD")[1].innerHTML)
    sessionStorage.setItem("score3", rows[3].getElementsByTagName("TD")[1].innerHTML)
    sessionStorage.setItem("score4", rows[4].getElementsByTagName("TD")[1].innerHTML)
    sessionStorage.setItem("score5", rows[5].getElementsByTagName("TD")[1].innerHTML)
    sessionStorage.setItem("score6", rows[6].getElementsByTagName("TD")[1].innerHTML)
    sessionStorage.setItem("score7", rows[7].getElementsByTagName("TD")[1].innerHTML)
    sessionStorage.setItem("score8", rows[8].getElementsByTagName("TD")[1].innerHTML)
    sessionStorage.setItem("score9", rows[9].getElementsByTagName("TD")[1].innerHTML)
    sessionStorage.setItem("score10", rows[10].getElementsByTagName("TD")[1].innerHTML)
    sessionStorage.setItem("score11", rows[11].getElementsByTagName("TD")[1].innerHTML)
    sessionStorage.setItem("score12", rows[12].getElementsByTagName("TD")[1].innerHTML)
    sessionStorage.setItem("score13", rows[13].getElementsByTagName("TD")[1].innerHTML)
    sessionStorage.setItem("score14", rows[14].getElementsByTagName("TD")[1].innerHTML)
    sessionStorage.setItem("score15", rows[15].getElementsByTagName("TD")[1].innerHTML)

    sessionStorage.setItem("user1", rows[1].getElementsByTagName("TD")[2].innerHTML)
    sessionStorage.setItem("user2", rows[2].getElementsByTagName("TD")[2].innerHTML)
    sessionStorage.setItem("user3", rows[3].getElementsByTagName("TD")[2].innerHTML)
    sessionStorage.setItem("user4", rows[4].getElementsByTagName("TD")[2].innerHTML)
    sessionStorage.setItem("user5", rows[5].getElementsByTagName("TD")[2].innerHTML)
    sessionStorage.setItem("user6", rows[6].getElementsByTagName("TD")[2].innerHTML)
    sessionStorage.setItem("user7", rows[7].getElementsByTagName("TD")[2].innerHTML)
    sessionStorage.setItem("user8", rows[8].getElementsByTagName("TD")[2].innerHTML)
    sessionStorage.setItem("user9", rows[9].getElementsByTagName("TD")[2].innerHTML)
    sessionStorage.setItem("user10", rows[10].getElementsByTagName("TD")[2].innerHTML)
    sessionStorage.setItem("user11", rows[11].getElementsByTagName("TD")[2].innerHTML)
    sessionStorage.setItem("user12", rows[12].getElementsByTagName("TD")[2].innerHTML)
    sessionStorage.setItem("user13", rows[13].getElementsByTagName("TD")[2].innerHTML)
    sessionStorage.setItem("user14", rows[14].getElementsByTagName("TD")[2].innerHTML)
    sessionStorage.setItem("user15", rows[15].getElementsByTagName("TD")[2].innerHTML)
}

// insert sessionStorage rank values into the table
function getTable(){
    var table, rows
    table = document.getElementById("myTable");
    rows = table.rows;

    rows[1].getElementsByTagName("TD")[1].innerHTML = sessionStorage.getItem("score1")
    rows[2].getElementsByTagName("TD")[1].innerHTML = sessionStorage.getItem("score2")
    rows[3].getElementsByTagName("TD")[1].innerHTML = sessionStorage.getItem("score3")
    rows[4].getElementsByTagName("TD")[1].innerHTML = sessionStorage.getItem("score4")
    rows[5].getElementsByTagName("TD")[1].innerHTML = sessionStorage.getItem("score5")
    rows[6].getElementsByTagName("TD")[1].innerHTML = sessionStorage.getItem("score6")
    rows[7].getElementsByTagName("TD")[1].innerHTML = sessionStorage.getItem("score7")
    rows[8].getElementsByTagName("TD")[1].innerHTML = sessionStorage.getItem("score8")
    rows[9].getElementsByTagName("TD")[1].innerHTML = sessionStorage.getItem("score9")
    rows[10].getElementsByTagName("TD")[1].innerHTML = sessionStorage.getItem("score10")
    rows[11].getElementsByTagName("TD")[1].innerHTML = sessionStorage.getItem("score11")
    rows[12].getElementsByTagName("TD")[1].innerHTML = sessionStorage.getItem("score12")
    rows[13].getElementsByTagName("TD")[1].innerHTML = sessionStorage.getItem("score13")
    rows[14].getElementsByTagName("TD")[1].innerHTML = sessionStorage.getItem("score14")
    rows[15].getElementsByTagName("TD")[1].innerHTML = sessionStorage.getItem("score15")

    rows[1].getElementsByTagName("TD")[2].innerHTML = sessionStorage.getItem("user1")
    rows[2].getElementsByTagName("TD")[2].innerHTML = sessionStorage.getItem("user2")
    rows[3].getElementsByTagName("TD")[2].innerHTML = sessionStorage.getItem("user3")
    rows[4].getElementsByTagName("TD")[2].innerHTML = sessionStorage.getItem("user4")
    rows[5].getElementsByTagName("TD")[2].innerHTML = sessionStorage.getItem("user5")
    rows[6].getElementsByTagName("TD")[2].innerHTML = sessionStorage.getItem("user6")
    rows[7].getElementsByTagName("TD")[2].innerHTML = sessionStorage.getItem("user7")
    rows[8].getElementsByTagName("TD")[2].innerHTML = sessionStorage.getItem("user8")
    rows[9].getElementsByTagName("TD")[2].innerHTML = sessionStorage.getItem("user9")
    rows[10].getElementsByTagName("TD")[2].innerHTML = sessionStorage.getItem("user10")
    rows[11].getElementsByTagName("TD")[2].innerHTML = sessionStorage.getItem("user11")
    rows[12].getElementsByTagName("TD")[2].innerHTML = sessionStorage.getItem("user12")
    rows[13].getElementsByTagName("TD")[2].innerHTML = sessionStorage.getItem("user13")
    rows[14].getElementsByTagName("TD")[2].innerHTML = sessionStorage.getItem("user14")
    rows[15].getElementsByTagName("TD")[2].innerHTML = sessionStorage.getItem("user15")
}

