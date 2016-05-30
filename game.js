//------------
//System Vars
//------------
var stage = document.getElementById("gameCanvas");
stage.width = STAGE_WIDTH;
stage.height = STAGE_HEIGHT;
var ctx = stage.getContext("2d");
ctx.fillStyle = "grey";
ctx.font = GAME_FONTS;

//-----------------
//Browser Detection
//-----------------
navigator.sayswho= (function(){
    var N= navigator.appName, ua= navigator.userAgent, tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M= M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];

    return M;
})();
{
var browser;
if (navigator.sayswho[0] == "Firefox")
	browser="f";
else if (navigator.sayswho[0] == "Chrome")
	browser="c";
else if (navigator.sayswho[0] == "Safari")
	browser="s";
else  if (navigator.sayswho[0] == "Microsoft")
	browser="m";
else
	browser="f";
}

var gameloop, mouseX, mouseY, isClicked, boxArray, score, initialize, player, answerArray;

var playMode;
//Init values
isClicked = false;
score = 0;
initialize = true;
playMode = "scramble"; //make random movements until board is different.
var countdown = 80; //moves to make before giving player control.
//Setup the Rectangles Array
boxArray = new Array();
answerArray = new Array();
player = new Object();

var die = {
    // initialize die... TODO: make it a function like character.
    sideA:"gray",
    sideB:"gray",
    sideC:"gray",
    sideD:"gray",
    sideE:"gray",
    sideF:"gray",

    flipDie: function(sideA,sideB,sideC,sideD,sideE,sideF) {
        this.sideA = sideA;
        this.sideB = sideB;
        this.sideC = sideC;
        this.sideD = sideD;
        this.sideE = sideE;
        this.sideF = sideF;
      }
    };



gameloop = setInterval(update, TIME_PER_FRAME);			
//stage.addEventListener("click", canvasClick, false);

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

// Handle key presses
{
var keyW = false;
var keyA = false;
var keyS = false;
var keyD = false;
var keyZ = false;
var keyC = false;
var keySpace = false;
var keydown = false;

function onKeyDown(event) {
    if (keydown == false){
        keydown = true;
            var keyCode = event.keyCode;
            switch (keyCode) {
                case 68: //d
                    keyD = true;
                    break;
                case 83: //s
                    keyS = true;
                    break;
                case 65: //a
                    keyA = true;
                    break;
                case 87: //w
                    keyW = true;
                    break;
                case 90: //z
                    keyZ = true;
                    break;
                case 67: //c
                    keyC = true;
                    break;
      }
    }
}

function onKeyUp(event) {
    keydown = false;
  var keyCode = event.keyCode;

  switch (keyCode) {
    case 68: //d
      keyD = false;
      break;
    case 83: //s
      keyS = false;
      break;
    case 65: //a
      keyA = false;
      break;
    case 87: //w
      keyW = false;
      break;
    case 90: //z
      keyZ = false;
      break;
    case 67: //c
      keyC = false;
      break;
//    case 32: //space
//      keySpace = false;
//      resetHitboxes = true;
//      break;
  }
}
}

var previewWidth = STAGE_WIDTH/8;
var previewHeight = STAGE_WIDTH/8;
var previewBoxWidth = previewWidth/(BOXES_PER_ROW);
var previewBoxHeight = previewHeight/(BOXES_PER_COLUMN);

function initialization()
{	
    boxArray = new Array();
    answerArray = new Array();
    initialize = false;
    playMode = "scramble";
    countdown = 80;
    
    previewWidth = STAGE_WIDTH/8;
    previewHeight = STAGE_WIDTH/8;
    previewBoxWidth = previewWidth/(BOXES_PER_ROW);
    previewBoxHeight = previewHeight/(BOXES_PER_COLUMN);
    
    totalProcesses = BOXES_PER_ROW*BOXES_PER_COLUMN + countdown + NUM_OF_COLORED_BOXES;
    processesDone = 0;
    for (var i =1;i<=BOXES_PER_COLUMN;i++){
        for (var j =1;j<=BOXES_PER_ROW;j++){
            var newBox = new Object();
            var answerBox = new Object();
                newBox.x = j*BOX_WIDTH+(j%2)*BOX_WIDTH/2;
                newBox.y = i*BOX_HEIGHT/2;
                if ((j+i)%2 == 0){
                    newBox.fillin = "gray";
                    answerBox.fillin = "gray";
                } else {newBox.fillin = "black"; answerBox.fillin = "black"}
                newBox.defaultfillin = newBox.fillin;
                boxArray.push(newBox);
                answerArray.push(answerBox);
//                alert(newBox.x);
            
            {
                processesDone += 1;
                ctx.fillStyle = "grey";
	            ctx.fillRect(0, 0, stage.width, stage.height);	
            
                ctx.beginPath();
                ctx.rect(STAGE_WIDTH/8,STAGE_HEIGHT/2,3*STAGE_WIDTH/4,previewBoxHeight);
                ctx.fillStyle = "red";
                ctx.fill();
    //            ctx.lineWidth = 7;
                ctx.strokeStyle = 'black';
                ctx.stroke();
            
                ctx.beginPath();
                ctx.rect(STAGE_WIDTH/8,STAGE_HEIGHT/2,(processesDone/totalProcesses)*3*STAGE_WIDTH/4,previewBoxHeight);
                ctx.fillStyle = "yellow";
                ctx.fill();
    //            ctx.lineWidth = 7;
                ctx.strokeStyle = 'black';
                ctx.stroke();
                
                ctx.fillStyle = "white";
	           ctx.fillText("generating board", STAGE_WIDTH/3, STAGE_HEIGHT/2-10);
            }
        }
//        alert(newBox.y);
    }
}

function setUpMap()
{
//    alert('problemo');
    player.x = Math.ceil(Math.random()*BOXES_PER_ROW);
    player.y = Math.ceil(Math.random()*BOXES_PER_COLUMN);
//    var g = floor(Math.random()*(boxArray.length-1));
    boxArray[getGridNumber(player.x,player.y)].fillin = "nothere";
    
//    var notyet = true;
    var thisColor = "red";
    for (i = 1; i<= NUM_OF_COLORED_BOXES; i++) {
        var notyet = true;
        while (notyet) {
            var p = Math.floor(Math.random()*(boxArray.length-1));
//            alert(p);
//            alert(boxArray[p].fillin);
            if (boxArray[p].fillin == "gray" || boxArray[p].fillin == "black"){
                boxArray[p].fillin = thisColor;
                answerArray[p].fillin = thisColor;
                notyet = false;
                {
                processesDone += 1;
                ctx.fillStyle = "grey";
	            ctx.fillRect(0, 0, stage.width, stage.height);	
            
                ctx.beginPath();
                ctx.rect(STAGE_WIDTH/8,STAGE_HEIGHT/2,3*STAGE_WIDTH/4,previewBoxHeight);
                ctx.fillStyle = "red";
                ctx.fill();
    //            ctx.lineWidth = 7;
                ctx.strokeStyle = 'black';
                ctx.stroke();
            
                ctx.beginPath();
                ctx.rect(STAGE_WIDTH/8,STAGE_HEIGHT/2,(processesDone/totalProcesses)*3*STAGE_WIDTH/4,previewBoxHeight);
                ctx.fillStyle = "yellow";
                ctx.fill();
    //            ctx.lineWidth = 7;
                ctx.strokeStyle = 'black';
                ctx.stroke();
                    
                ctx.fillStyle = "white";
	           ctx.fillText("filling board", STAGE_WIDTH/3, STAGE_HEIGHT/2-10);
            }
            } else {
             switch(thisColor) {
                 case "red":
                     thisColor = "blue";
                     break;
                 case "blue":
                     thisColor = "yellow";
                     break;
                 case "yellow":
                     thisColor = "red";
                     break;
             }
            }
        }
    }
    boxArray[getGridNumber(player.x,player.y)].fillin = boxArray[getGridNumber(player.x,player.y)].defaultfillin;
//    boxArray[4].fillin = "red";
    
}

function getGridNumber(x,y)
{
    return (y-1)*(BOXES_PER_ROW) + (x-1);
}


var buttons = new Array();
buttons = [keyA, keyD, keyW, keyS];
var totalProcesses;
var processesDone;
//------------
//Game Loop
//------------
function update()
{		
//	alert('heartbeat');
    //Clear Canvas
	ctx.fillStyle = "grey";
	ctx.fillRect(0, 0, stage.width, stage.height);	
	
    if (initialize == true){
        die.sideA = "gray";
        die.sideB = "gray";
        die.sideC = "gray";
        die.sideD = "gray";
        die.sideE = "gray";
        die.sideF = "gray";
        playMode = "scramble";
        initialization(); 
        setUpMap();
    }
    
    // Handle movement
    {
//    if (stamina > 25) {
        if (keyD == true && player.x < BOXES_PER_ROW) { 
            var i = getGridNumber(player.x+1,player.y);
            var newBottomFillin = die.sideC;
            if (boxArray[i].fillin != boxArray[i].defaultfillin && die.sideC == "gray") {
                newBottomFillin = boxArray[i].fillin;
                boxArray[i].fillin = boxArray[i].defaultfillin;
            } else if (boxArray[i].fillin == boxArray[i].defaultfillin && die.sideC != "gray") {
                newBottomFillin = "gray";
                boxArray[i].fillin = die.sideC;
            }
            player.x += 1;
            die.flipDie(die.sideB,die.sideD,die.sideA,die.sideC,die.sideE,die.sideF);
            keyD = false;
            die.sideD = newBottomFillin;
            }
        if (keyW == true && player.y >1) {
            var i = getGridNumber(player.x,player.y-1);
            var newBottomFillin = die.sideF;
            if (boxArray[i].fillin != boxArray[i].defaultfillin && die.sideF == "gray"){
                newBottomFillin = boxArray[i].fillin;
                boxArray[i].fillin = boxArray[i].defaultfillin;
            } else if (boxArray[i].fillin == boxArray[i].defaultfillin && die.sideF != "gray") {
                newBottomFillin = "gray";
                boxArray[i].fillin = die.sideF;
            }
            player.y -= 1;
            die.flipDie(die.sideE,die.sideB,die.sideC,die.sideF,die.sideD,die.sideA);
            keyW = false; 
            die.sideD = newBottomFillin;
        }
        if (keyA == true && player.x >1) {
            var i = getGridNumber(player.x-1,player.y);
            var newBottomFillin = die.sideB;
            if (boxArray[i].fillin != boxArray[i].defaultfillin && die.sideB == "gray"){
                newBottomFillin = boxArray[i].fillin;
                boxArray[i].fillin = boxArray[i].defaultfillin;
            } else if (boxArray[i].fillin == boxArray[i].defaultfillin && die.sideB != "gray") {
                newBottomFillin = "gray";
                boxArray[i].fillin = die.sideB;
            }
            player.x -= 1;
            die.flipDie(die.sideC,die.sideA,die.sideD,die.sideB,die.sideE,die.sideF); 
            keyA = false; 
            die.sideD = newBottomFillin;
        }
        if (keyS == true && player.y < BOXES_PER_COLUMN) { 
            var i = getGridNumber(player.x,player.y+1);
            var newBottomFillin = die.sideE;
            if (boxArray[i].fillin != boxArray[i].defaultfillin && die.sideE == "gray"){
                newBottomFillin = boxArray[i].fillin;
                boxArray[i].fillin = boxArray[i].defaultfillin;
            } else if (boxArray[i].fillin == boxArray[i].defaultfillin && die.sideE != "gray") {
                newBottomFillin = "gray";
                boxArray[i].fillin = die.sideE;
            }
            player.y += 1;
            die.flipDie(die.sideF,die.sideB,die.sideC,die.sideE,die.sideA,die.sideD);
            keyS = false; 
            die.sideD = newBottomFillin;
        }
    }
    if (playMode == "scramble") {
        var zerothroughthree = Math.floor(Math.random()*4);
        switch(zerothroughthree){
            case 0:
                keyD = true;
                break;
            case 1:
                keyW = true;
                break;
            case 2:
                keyA = true;
                break;
            case 3: keyS = true;
                break;
        }
        countdown -= 1;
        {
        processesDone += 1;
                ctx.fillStyle = "grey";
	            ctx.fillRect(0, 0, stage.width, stage.height);	
            
                ctx.beginPath();
                ctx.rect(STAGE_WIDTH/8,STAGE_HEIGHT/2,3*STAGE_WIDTH/4,previewBoxHeight);
                ctx.fillStyle = "red";
                ctx.fill();
    //            ctx.lineWidth = 7;
                ctx.strokeStyle = 'black';
                ctx.stroke();
            
                ctx.beginPath();
                ctx.rect(STAGE_WIDTH/8,STAGE_HEIGHT/2,(processesDone/totalProcesses)*3*STAGE_WIDTH/4,previewBoxHeight);
                ctx.fillStyle = "yellow";
                ctx.fill();
    //            ctx.lineWidth = 7;
                ctx.strokeStyle = 'black';
                ctx.stroke();
            
                ctx.fillStyle = "white";
	           ctx.fillText("scrambling board", STAGE_WIDTH/3, STAGE_HEIGHT/2-10);
        }
        if (countdown == 0) {
            playMode = "";
        }
    } 
    else {
	for (var k=(player.x - 8); k <= (player.x+8); k++)
	{ // each row
        for (var j=(player.y - 8); j <= (player.y+8); j++)
        { // each column
            if (k >0 && k <= BOXES_PER_ROW && j>0 && j <= BOXES_PER_COLUMN) {
                var i = getGridNumber(k,j); // get which element in boxArray we're looking at.
                { // set top right corner
                    boxArray[i].x = (STAGE_WIDTH/2)+(k-player.x)*BOX_WIDTH/2+(j-(player.y-2))*BOX_HEIGHT/2;
                    boxArray[i].y = (STAGE_HEIGHT/2)+(j-(player.y-2))*BOX_HEIGHT/2-(k-player.x)*BOX_HEIGHT/2;
                }
                if (k == player.x && j == player.y){
                    
                    var playerfillin = die.sideA;
                    var playerxspot = boxArray[i].x;
                    var playeryspot = boxArray[i].y-BOX_HEIGHT/2;
                    
                } 
                else {
                    drawRect(boxArray[i].x, boxArray[i].y,boxArray[i].fillin);
                }
            }
        }
	}
    drawRect(playerxspot, playeryspot, die.sideA);
    drawSkewedRect(playerxspot,playeryspot,"left",die.sideB);
    drawSkewedRect(playerxspot+BOX_WIDTH/2,playeryspot+BOX_HEIGHT/2,"right",die.sideE);
    
    for (var k = 1; k<= BOXES_PER_ROW; k++) {
        for (var j=1; j<= BOXES_PER_COLUMN; j++) {
            var i = getGridNumber(k,j);
            ctx.beginPath();
            ctx.rect((k-1)*previewBoxWidth,STAGE_HEIGHT-previewHeight+(j-1)*previewBoxHeight,previewBoxWidth,previewBoxHeight);
            ctx.fillStyle = boxArray[i].fillin;
            ctx.fill();
//            ctx.lineWidth = 7;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
    } // current box
	
    for (var k = 1; k<= BOXES_PER_ROW; k++) {
        for (var j=1; j<= BOXES_PER_COLUMN; j++) {
            var i = getGridNumber(k,j);
            ctx.beginPath();
            ctx.rect(7*previewWidth+(k-1)*previewBoxWidth,STAGE_HEIGHT-previewHeight+(j-1)*previewBoxHeight,previewBoxWidth,previewBoxHeight);
            ctx.fillStyle = answerArray[i].fillin;
            ctx.fill();
//            ctx.lineWidth = 7;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
    } // answer box
    var couldwin = true;
    var checki = 0;
    while (couldwin) {
        if (boxArray[checki].fillin == answerArray[checki].fillin){
            checki += 1;
        } else {
            couldwin = false;
        }
            
        if (checki == boxArray.length-1){
            alert('big ol winner');
            initialize = true;
            BOXES_PER_ROW += 1;
            BOXES_PER_COLUMN +=1;
            NUM_OF_COLORED_BOXES =  BOXES_PER_ROW*BOXES_PER_COLUMN - 6;
            couldwin = false;
        }
    }
	
    
	//Show Position in Top Left
	ctx.fillStyle = "white";
	ctx.fillText("current board", 0, STAGE_HEIGHT-previewHeight-10);
    ctx.fillText("goal", STAGE_WIDTH-previewWidth, STAGE_HEIGHT-previewHeight-10);
    }
}

function drawRect(xPos, yPos, fillin)
{
        ctx.beginPath();
        ctx.moveTo(xPos, yPos);
        ctx.lineTo(xPos+BOX_WIDTH/2,yPos-BOX_HEIGHT/2);
        ctx.lineTo(xPos+BOX_WIDTH, yPos);
        ctx.lineTo(xPos+(BOX_WIDTH/2), yPos+BOX_HEIGHT/2);
        ctx.closePath();
    	ctx.fillStyle = fillin;
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
}

function drawSkewedRect(xPos, yPos, horOrVert, fillin)
{
    if (horOrVert == "left"){
        ctx.beginPath();
        ctx.moveTo(xPos, yPos);
        ctx.lineTo(xPos, yPos+BOX_HEIGHT/2);
        ctx.lineTo(xPos+BOX_WIDTH/2, yPos+BOX_HEIGHT);
        ctx.lineTo(xPos+BOX_WIDTH/2, yPos+BOX_HEIGHT/2);
        ctx.closePath();
    } else {
        ctx.beginPath();
        ctx.moveTo(xPos, yPos);
        ctx.lineTo(xPos, yPos+BOX_HEIGHT/2);
        ctx.lineTo(xPos+BOX_WIDTH/2, yPos);
        ctx.lineTo(xPos+BOX_WIDTH/2, yPos-BOX_HEIGHT/2);
        ctx.closePath();
    }
	ctx.fillStyle = fillin;
	ctx.fill();
	ctx.strokeStyle = 'black';
	ctx.stroke();
}

	
	