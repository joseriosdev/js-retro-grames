/*
There is a .js file named "GrapichsCommon"
where I put all the functions that draws shapes
*/

var canvas;
var canvasContext;

//ball variables
var ballX = 100;
var ballY = 100;
var ballSpeedX = 9;
var ballSpeedY = 6;

//paddle variables
var leftPaddleY;
var rightPaddleY = 30;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 8;

//Score variables
var winCondition = false;
var pointDone = false;
var scorePl1 = 0;
var scorePl2 = 0;
const W_SCORE = 3;

var startGame = true;

//Sound fx variables
var ballHittingSfx;
var pointDoneSfx;


function calculateMousePos(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return{
        x:mouseX,
        y:mouseY
    }
}





window.onload = function start(){
    //First, loads the game sounds
    ballHittingSfx = document.getElementById("ballHittingSfx");
    pointDoneSfx = document.getElementById("pointDoneSfx");

    //Then, takes de canvas element
    canvas = document.getElementById("retroGames");
    canvasContext = canvas.getContext("2d");
    setTimeout(textLoaded,200); // only for loading the text on canvas
    var fps = 30;

    setInterval(function(){
        drawEverything();
        moveEverything();
    }, 1000 / fps);

    
    canvas.addEventListener("mousedown", restartGame);
    

    canvas.addEventListener("mousemove", 
        function(evt){
            var mousePos = calculateMousePos(evt);
            leftPaddleY = mousePos.y-(PADDLE_HEIGHT/2);
    });
    
}



function paddleBehaviour(){
    var rightPaddleYCenter = rightPaddleY+(PADDLE_HEIGHT/2);

    if(rightPaddleYCenter < ballY-15){
        rightPaddleY += getRandomFloat(7,9);
    }
    else if(rightPaddleYCenter > ballY+15){
        rightPaddleY -= getRandomFloat(7,9);
    }
}

function moveEverything(){
    if (winCondition){
        return;
    }

    paddleBehaviour();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    //Paddles colliders
    if (ballX <= PADDLE_THICKNESS){
        if(ballY > leftPaddleY && ballY <= leftPaddleY+PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY-(leftPaddleY+ PADDLE_HEIGHT/2); //when the ball hits the paddle, the bouncing changes
            ballSpeedY = deltaY * 0.3;
            ballHittingSfx.play();
        }
        else{
            scorePl2++;
            pointDoneSfx.play();
            ballReset();
        }
    }

    if (ballX >= canvas.width-PADDLE_THICKNESS){
        if(ballY > rightPaddleY && ballY <= rightPaddleY+PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY-(rightPaddleY + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.3;
            ballHittingSfx.play();
        }
        else{
            scorePl1++;
            pointDoneSfx.play();
            ballReset(); 
        }
    }

    //ball movement
    if(ballY < 0){
        ballSpeedY = -ballSpeedY;
        ballHittingSfx.play();
    }
    if(ballY > canvas.height){
        ballSpeedY = -ballSpeedY;
        ballHittingSfx.play();
    }
    
}

//////Reseting the Ball - Score - Game///////

function restartGame(evt){
    if(winCondition){
        scorePl1 = 0;
        scorePl2 = 0;
        winCondition = false;
    }
}

function initialScreenSetUp(){
    if(startGame){
        colorText('Get Ready!', canvas.width/2,canvas.height/3, "white");
        colorText("the game will start soon", canvas.width/2,canvas.height-150, "white");
        startGame = false;
    }
}


function ballReset(){
    
    let ballSpeedReset = ballSpeedX;
    scenarioReset();
    ballSpeedX = -ballSpeedReset;
    ballX = canvas.width/2;
    ballY = canvas.height/2;

    if (scorePl2 >= W_SCORE || scorePl1 >= W_SCORE){
        winCondition = true;
    }
}

function scenarioReset(){
    let currentP1Score = 0;
    let currentP2Score = 0;
    if (scorePl1 > currentP1Score || scorePl2 > currentP2Score){
        if(ballX > canvas.width-PADDLE_THICKNESS){
            currentP1Score++;
        }
        else if (ballX < PADDLE_THICKNESS){
            currentP2Score++;
        }

        ballSpeedX = 0;
        ballSpeedY = 0;
        leftPaddleY = canvas.height/2;
        rightPaddleY = canvas.height/2;
        ballX = canvas.width/2;
        ballY = canvas.height/2;
        
        return;
    }
}


///////////////creating all the visual content////////////////


function drawEverything(){
    
    //background rectangle
    colorRect(0,0, canvas.width, canvas.height, "black");
    
    
    //Drawing the net
    for(var i=0; i<canvas.height; i+=26){
        colorRect(canvas.width/2-1,i, 3,13, 'white');
    }

    //paddles: left / right
    colorRect(0, leftPaddleY, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");
    colorRect(canvas.width, rightPaddleY, -PADDLE_THICKNESS, PADDLE_HEIGHT, "white");

    //creating the ball
    colorCircle(ballX,ballY,5, "white");

    //Score////
    colorText(scorePl1, 100,100, "white");
    colorText(scorePl2, canvas.width-100,100, "white");

    gameOverScreen();
}


function gameOverScreen(){
    //Rendering the Game Over Screen
    if (winCondition){
        var winner = (scorePl1 > scorePl2)? "Human Player Won :)" : "computer won o_O";
        
        colorRect(0,0, canvas.width, canvas.height, "black");
        canvasContext.fillStyle = "white";
        canvasContext.fillText("Game Over", canvas.width/2, 100);
        canvasContext.fillText(winner, canvas.width/2, canvas.height/2);
        canvasContext.fillText("Clic to Play Again", canvas.width/2, canvas.height-100);
        return;
    }
}

//Small Functions
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function textLoaded(){
    canvasContext.font= "20px 'Press Start 2P'";
}