//menu window
let menu = document.querySelector("#menu");
let step = 10;
let count = 0;

function animate() {
    menu.style.top = count + "px";
    count += 5;

    if (count < 170) {
        requestAnimationFrame(animate);
    }
}

requestAnimationFrame(animate);

//game code
let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");

let bee = new Image();
let background = new Image();
let foreground = new Image();
let columnUp = new Image();
let columnBottom = new Image();

bee.src = "img/bee.png";
background.src = "img/bg.png";
foreground.src = "img/fg.png";
columnUp.src = "img/columnUp.png";
columnBottom.src = "img/columnBottom.png";

// audio
let fly = new Audio();
let scoreAudio = new Audio();
let crash = new Audio();

fly.src = "audio/fly.mp3";
scoreAudio.src = "audio/score.mp3";
crash.src = "audio/crash.mp3";

let gap = 90;

// pressing button
document.addEventListener("keydown", moveUp);

function moveUp() {
    yPos -= 25;
    fly.play();
};

// creating blocks 
let column = [];

column[0] = {
    x: cvs.width,
    y: 0
};

let score = 0;
// position bee
let xPos = 60;
let yPos = 150;
let gravity = 1.5;

function draw() {
    ctx.drawImage(background, 0, 0);

    for (let i = 0; i < column.length; i++) {  //created block
        ctx.drawImage(columnUp, column[i].x, column[i].y);
        ctx.drawImage(columnBottom, column[i].x, column[i].y + columnUp.height + gap);

        column[i].x--;

        if (column[i].x == 250) {   //created new blocks
            column.push({
                x: cvs.width,
                y: Math.floor(Math.random() * columnUp.height) - columnUp.height
            });
        }

        if (xPos + bee.width >= column[i].x &&   //collision with column
            xPos <= column[i].x + columnUp.width &&
            (yPos <= column[i].y + columnUp.height || yPos + bee.height >= column[i].y + columnUp.height + gap) ||
            yPos + bee.height >= cvs.height - foreground.height) {
            crash.play();

            ctx.drawImage(foreground, 0, cvs.height - foreground.height);

            let modal = document.getElementsByClassName("modal")[0];
            modal.getElementsByClassName("score-header1")[0].textContent = ` You score: ${score}`;
            modal.className = "modal";

            let bestScore = document.getElementsByClassName("modal")[0];
            bestScore.getElementsByClassName("score-header2")[0].textContent = ` Best score: ${localStorage.getItem("score") || 0}`;
            bestScore.className = "modal";

            let previousScore = localStorage.getItem("score");
            if (!previousScore || previousScore < score)
                localStorage.setItem("score", score);

            return;
        } 

        if (column[i].x == 5) {
            score++;
            scoreAudio.play();
        }
    }

    ctx.drawImage(foreground, 0, cvs.height - foreground.height);
    ctx.drawImage(bee, xPos, yPos);

    yPos += gravity;

    ctx.font = "24px Marker Felt, fantasy";
    ctx.fillText("Score: " + score, 10, cvs.height - 20);

    requestAnimationFrame(draw);
}

columnBottom.onload = draw;

