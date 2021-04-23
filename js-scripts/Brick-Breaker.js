var canvas, canvasContext;

//ball variables
var ballX = 100;
var ballY = 100;
var ballSpeedX = 4;
var ballSpeedY = 4;

//paddle variables
var paddleX = 50;
const PADDLE_WIDTH = 70;
const CENTER_OF_PADDLE = PADDLE_WIDTH/2;
const PADDLE_THICKNESS = 10;
const PADDLE_DISTANCE_FROM_BOTTOM = 50;

//Tracks variables
const TRACK_COLUMS = 8;
const TRACK_ROWS = 6;
const TRACK_W = 40;
const TRACK_H = 20;
const TRACK_GAPS = 2;
var trackGrid = new Array(TRACK_COLUMS * TRACK_ROWS);
var remainingTracks = 0;


var winCondition = false;


var mouseX, mouseY;


function calculateMousePos(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;

    paddleX = mouseX-CENTER_OF_PADDLE
}

function trackReset(){
    remainingTracks = 0;
    var i;
    for (i=0;i<2*TRACK_COLUMS;i++){
        trackGrid[i] = false;
    }
    for(; i<TRACK_COLUMS* TRACK_ROWS; i++){
        
        trackGrid[i] = (getRandomFloat(0.1, 1.1) > 0.5) ? true: false;
        if (trackGrid[i]){
            remainingTracks++;
        }
    }
    
}

window.onload = function(){
    canvas = document.getElementById("retroGames");
    canvasContext = canvas.getContext("2d");
    var fps = 30;

    setInterval(function(){
        drawEverything();
        moveEverything();
    }, 1000 / fps);

    canvas.addEventListener("mousedown", restartGame);
    canvas.addEventListener("mousemove", calculateMousePos);

    trackReset();
}

function ballMove(){
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if(ballX < 0 && ballSpeedX < 0.0){
        ballSpeedX = -ballSpeedX;
    }
    if(ballX > canvas.width && ballSpeedX > 0.0){
        ballSpeedX = -ballSpeedX;
    }
    if(ballY < 0 && ballSpeedY < 0.0){
        ballSpeedY = -ballSpeedY;
    }
    if(ballY > canvas.height){
        ballReset();
        trackReset();
    }
}


function isTrackAtRowCol (col, row){
    if (col >= 0 && col < TRACK_COLUMS &&
        row >= 0 && row < TRACK_ROWS){
        var trackIndexUnderCoord = rowColToArrayIndex(col, row);
        return trackGrid[trackIndexUnderCoord];
    }else {
        return false;
    }

}


function ballTrackCollision(){
    var ballTrackCol =  Math.floor(ballX / TRACK_W);
    var ballTrackRow =  Math.floor(ballY / TRACK_H);
    var trackIndexUnderBall = rowColToArrayIndex(ballTrackCol, ballTrackRow);

    if (ballTrackCol >= 0 && ballTrackCol < TRACK_COLUMS &&
        ballTrackRow >= 0 && ballTrackRow < TRACK_ROWS){

        if (isTrackAtRowCol(ballTrackCol, ballTrackRow)) {
            trackGrid[trackIndexUnderBall] = false;
            remainingTracks--;

            var prevBallX = ballX - ballSpeedX;
            var prevBallY = ballY - ballSpeedY;
            var prevTrackCol = Math.floor(prevBallX / TRACK_W);
            var prevTrackRow = Math.floor(prevBallY / TRACK_H);

            var bothTestFailed = true;
            if (prevTrackCol != ballTrackCol){
                var adjTrackSide = rowColToArrayIndex(prevTrackCol, ballTrackRow);

                if(trackGrid[adjTrackSide] == false){
                    ballSpeedX *= -1;
                    bothTestFailed = false;
                }
            }
            if (prevTrackRow != ballTrackRow){
                var adjTrackSide = rowColToArrayIndex(prevTrackCol, prevTrackRow);

                if(trackGrid[adjTrackSide] == false){
                    ballSpeedY *= -1;
                    bothTestFailed = false;
                }
            }

            if(bothTestFailed){
                ballSpeedX *= -1;
                ballSpeedY *= -1;
            }
            
            
        } // end of track found
    }
}


function paddleCollider(){
    console.log(remainingTracks);

    var paddleTop = canvas.height-PADDLE_DISTANCE_FROM_BOTTOM;
    var paddleBottom = paddleTop+PADDLE_THICKNESS;
    var paddleLeft = paddleX;
    var paddleRight = paddleLeft+PADDLE_WIDTH;
    if( ballY>paddleTop && ballY<paddleBottom && ballX > paddleLeft && ballX < paddleRight){
            ballSpeedY *= -1;
            var ballBouncingChange = ballX-(paddleX+CENTER_OF_PADDLE);
            ballSpeedX = ballBouncingChange*0.35;  
            
            if (remainingTracks == 0){
                //winCondition = true;
                trackReset();
            }
    }


}


function moveEverything(){
    if (winCondition){
        return;
    }
    
    ballMove();
    ballTrackCollision();
    paddleCollider();    
}




//////Reseting the Ball - Score - Game///////

function restartGame(evt){
    if(winCondition){
        scorePl1 = 0;
        scorePl2 = 0;
        winCondition = false;
    }
}

function ballReset(){
    ballSpeedX = -ballSpeedX
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}



///////////////creating all the visual content////////////////


function drawEverything(){

    canvasContext.font = "14px Verdana";

    //background rectangle
    creatingRect(0,0, canvas.width, canvas.height, "black");

    //Rendering the Game Over Screen
    /*if (winCondition){
        var winner = (scorePl1 > scorePl2)? " Nice human :) U have won " : " computer, u won ";
        canvasContext.fillStyle = "white";
        canvasContext.fillText("Game Over | " + winner, canvas.width/8, 30);
        canvasContext.fillText("Play Again", canvas.width/4, canvas.height-100);
        return;
    }*/

    

    //paddle
    creatingRect(paddleX,canvas.height-PADDLE_DISTANCE_FROM_BOTTOM, PADDLE_WIDTH,PADDLE_THICKNESS, "blue");

    //creating the ball
    creatingCirc(ballX,ballY,5, "white");

    //creating the trackGrid
    creatingTracks();

    //Score////
    //canvasContext.fillText(scorePl1, 25, 50);
    //canvasContext.fillText(scorePl2, canvas.width - 50, 50);
    var mouseTrackCol = Math.floor(mouseX / TRACK_W);
    var mouseTrackRow = Math.floor(mouseY / TRACK_H);
    var trackIndexUnderMouse = rowColToArrayIndex(mouseTrackCol, mouseTrackRow);
    creatingText(mouseTrackCol+","+mouseTrackRow+":"+trackIndexUnderMouse, mouseX,mouseY, "white");

}// END DRAW ALL


function creatingCirc(x,y,r,color){
    canvasContext.beginPath();
    canvasContext.fillStyle = color;
    canvasContext.arc(x, y, r, 0, 2*Math.PI, false);
    canvasContext.fill();
}

function creatingRect(x,y, w,h,color){
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x,y, w,h);
}

function creatingText(content, xpos,ypos, color){
    canvasContext.fillStyle = color;
    canvasContext.fillText(content, xpos, ypos);
}

function creatingTracks(){
    for (var trackRow=0;trackRow<TRACK_ROWS;trackRow++){
        for (var trackCol=0;trackCol<TRACK_COLUMS;trackCol++){

            var arrayIndex = rowColToArrayIndex(trackCol,trackRow);

            if(trackGrid[arrayIndex]){
                creatingRect(TRACK_W*trackCol,TRACK_H*trackRow, TRACK_W-TRACK_GAPS,TRACK_H-TRACK_GAPS, "red");
            }
        }
    }
}

///////////////////////////////////
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

function rowColToArrayIndex(col,row){
    return col + TRACK_COLUMS * row;
}
