// All the elements the targetted 
const ball = document.getElementById('ball');
const rod1 = document.getElementById('rod1');
const rod2 = document.getElementById('rod2');

// Making some variable to store the name of the Player , score , rod  in the local storage;
const storeName = "PPName";
const storeScore = "PPhighestScore";
const rod1Name = "Rod 1";
const rod2Name = "Rod 2";

//Some more variables to store the score , highestScore , movement , rod and speed of the ball
let score,
    highestScore,
    movement,
    rod,
    ballSpeedX = 1.5,
    ballSpeedY = 1.5;


// initializing it to false as initially game is not started
let gameOn = false;


let windowWidth = window.innerWidth,
    windowHeight = window.innerHeight;


//Function to store the player score
(function () {
    rod = localStorage.getItem(storeName);
    highestScore = localStorage.getItem(storeScore);
    //If this is the first time the player is playing the game
    if (rod === "null" || highestScore === "null") {
        alert("This is your first time");
        highestScore = 0;
        rod = "Rod 1"
    }
    else {
        alert(rod + " has highest score of " + highestScore * 100);
    }
    resetBoard(rod);
})();


// Function to reset the board and put the rods again in the center , one at the top and other at the bottom
function resetBoard(rodName) {

    //Putting rod and ball at the center of the board
    rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + 'px';
    rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + 'px';
    ball.style.left = (windowWidth - ball.offsetWidth) / 2 + 'px';
    // Lossing player gets the ball



    //If the lossing rod is Rod 2 then ball will be with rod 2
    //But when lossing rod is Rod 2 winner would be rod 1 , hence rodName will be storing Rod 1
    if (rodName === "Rod 1") {
        ball.style.top = (rod2.offsetTop - rod2.offsetHeight) + 'px';
        //Giving the ball the direction to move
        ballSpeedY = -1.5;
    }
    // If lossing rod is Rod 1 then ball will be with rod 1
    //But when lossing rod is Rod 1 winner would be rod 2 , hence rodName will be storing Rod 2
    else if (rodName === "Rod 2") {
        ball.style.top = (rod1.offsetTop + rod1.offsetHeight) + 'px';
        //Giving the ball the direction to move
        ballSpeedY = 1.5;
    } 
    

    //reset the score to 0
    score = 0;
    //Now the game will stop and therefore game = false;
    gameOn = false;

}


//This function will update the score and winner name if the score is greater than the previous highest score.
function storeWin(rod, score) {

    //If the score become highest
    if (score > highestScore) {
        highestScore = score;
        localStorage.setItem(storeName, rod);
        localStorage.setItem(storeScore, highestScore);
    }

    //The interval is cleared and board is reset 
    clearInterval(movement);
    resetBoard(rod);

    //An alert message will be shown 
    alert(rod + " wins with a score of " + (score * 100) + ". Max score is: " + (highestScore * 100));

}


//Adding event Listeners so that the rods can move left or right
window.addEventListener('keydown', function (event) {
    //Giving the rod speed as 25 
    let rodSpeed = 25;

    let rodRect = rod1.getBoundingClientRect();

    // If D is pressed or right key is pressed the rods will move to the right and not beyond the window's innerWidth
    if (((event.code === "KeyD")||(event.code==="ArrowRight")) && ((rodRect.x + rodRect.width) < window.innerWidth)) {
        //Shifting the rods towards right
        rod1.style.left = (rodRect.x) + rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    } 
    //If A is pressed or left arrow key is pressed the rods will move to the left but not below the window's inner Width
    else if (((event.code === "KeyA")||(event.code==="ArrowLeft")) && (rodRect.x > 0)) {

        //Shifting the rods towards left
        rod1.style.left = (rodRect.x) - rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    }


    //If Enter key is pressed then two conditions arises

    //if the game is not running(game==false) then game is turned 
    if (event.code === "Enter") {

        if (!gameOn) {
            gameOn = true;
            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDia = ballRect.width;

            let rod1Height = rod1.offsetHeight;
            let rod2Height = rod2.offsetHeight;
            let rod1Width = rod1.offsetWidth;
            let rod2Width = rod2.offsetWidth;

            //Making the ball move using setInterval function
            movement = setInterval(function () {
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                let rod1X = rod1.getBoundingClientRect().x;
                let rod2X = rod2.getBoundingClientRect().x;

                //moving the ball
                ball.style.left = ballX + 'px';
                ball.style.top = ballY + 'px';

                //Bouncing the ball from the side window when colliding by changing its direction
                if ((ballX + ballDia) > windowWidth || ballX < 0) {
                    ballSpeedX = -ballSpeedX; // changes the direction
                }

                // It specifies the center of the ball on the viewport
                let ballPos = ballX + ballDia / 2;

                // Making the ball bounce when hitted by rod1 by reversing the y direction speed of the ball
                if (ballY <= rod1Height) {
                    ballSpeedY = -ballSpeedY; // changes the direction
                    //Incrementing the score
                    score++;

                    // If the ball goes misses the rod 1 a function will be called to store the winner name and the score ,
                    //here the winner would be rod2
                    if ((ballPos < rod1X) || (ballPos > (rod1X + rod1Width))) {
                        storeWin(rod2Name, score);
                    }
                }

                // Making the ball bounce when hitted by rod1 by reversing the y direction speed of the ball
                else if ((ballY + ballDia) >= (windowHeight - rod2Height)) {
                    ballSpeedY = -ballSpeedY; // changes the direction
                    //Incrementing the score
                    score++;

                    // If the ball goes misses the rod 2 a function will be called to store the winner name and the score ,
                    //here the winner would be rod1
                    if ((ballPos < rod2X) || (ballPos > (rod2X + rod2Width))) {
                        storeWin(rod1Name, score);
                    }
                }

            }, 1);

        }
        //If Enter key is pressed while the game is running the game will pause and gives an alert message to the user 
        else{
            alert("Game is paused . Press Enter to continue");
        }
    }

    //If escape key is pressed the game will end and starts again 
    if(event.code === "Escape"){
        clearInterval(movement);
        resetBoard(rod);
    }
});
