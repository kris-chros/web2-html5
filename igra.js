function loadStartingScreen(){
    var pocCanvas = document.createElement("canvas");
    pocCanvas.id = "pocCanvas";
    pocCanvas.width = 1200;
    pocCanvas.height = 650;
    var pocCtx = pocCanvas.getContext("2d");
    pocCtx.font = "bold 36px verdana";
    pocCtx.textAlign="center";
    pocCtx.textBaseline="middle";
    pocCtx.fillStyle="#ffffff";
    pocCtx.fillText("BREAKOUT", 600, 325);
    pocCtx.font = "italic bold 18px verdana";
    pocCtx.textAlign="center";
    pocCtx.fillText("Press SPACE to begin", 600, 360);
    document.body.insertBefore(pocCanvas, document.body.childNodes[0]);
    document.addEventListener("keypress", function (event) {
        if (event.code === 'Space') {
            document.body.removeChild(document.getElementById("pocCanvas"));
            startGame();
        }
    });
    if(!localStorage.getItem('highestGame')){
        localStorage.setItem('highestGame', 0);
    }
}

var score = localStorage.getItem('highestGame');
var gameScore = 0;
var myGamePiece;
var myGamePalica;
const pocBrzina = 2;
const brojCigli = 50;
const brojRedova = 5;
const brojStupaca = 10;
const boje = ["#993300", "#FF0000", "#FF99CC", "#00FF00", "#FFFF99"];
let pozCigli = [];
for (let n1 = 0; n1 < (brojCigli/brojStupaca); n1++){
    for (let n2 = 0; n2 < (brojCigli/brojRedova); n2++){
        pozCigli.push({x:(40+115*n2), y:(90+35*n1)});
    }
}

function startGame() {
    myGamePiece = new loptica(20, 20, "#bfbfbfff", 580, 590);
    myGamePalica = new palica(100, 20, "#FFFFFF", 550, 620);
    document.addEventListener("keydown", function (event) {
        if (event.code === 'ArrowLeft') {
            myGameArea.context.clearRect(myGamePalica.fetchX(), myGamePalica.fetchY(), 100, 20);
            myGamePalica.newPos('lijevo');
            myGamePalica.update();
        } else if (event.code === 'ArrowRight') {
            myGameArea.context.clearRect(myGamePalica.fetchX(), myGamePalica.fetchY(), 100, 20);
            myGamePalica.newPos('desno');
            myGamePalica.update();
        }
    });
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.id = "myGameCanvas";
        this.canvas.width = 1200;
        this.canvas.height = 650;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        for (let j = 0; j < (brojCigli/brojStupaca); j++) {
            this.context.shadowBlur = 20;
            this.context.shadowColor = "black";
            this.context.fillStyle = boje[j];
            for (let index = 0; index < (brojCigli/brojRedova); index++) {
                this.context.fillRect(40+(115*index), 90+35*j, 85, 20);   
            }
        }

        this.context.font = "20px verdana";
        this.context.textAlign="left";
        this.context.textBaseline="top";
        this.context.fillStyle="#FFFFFF";
        this.context.fillText(gameScore.toString(), 20, 20);
        this.context.textAlign="right";
        this.context.textBaseline="top";
        this.context.fillText(score.toString(), 1100, 20);
        
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        myGamePalica.update();
    },
    stop : function() {
        clearInterval(this.interval);
        if (gameScore == 50){
            this.context.font = "bold 40px verdana";
            this.context.textAlign="center";
            this.context.textBaseline="middle";
            this.context.fillStyle="#FFFF00";
            this.context.fillText("YOU WON! CONGRATS!", 600, 325);
        } else {
            this.context.font = "bold 40px verdana";
            this.context.textAlign="center";
            this.context.textBaseline="middle";
            this.context.fillStyle="#FFFF00";
            this.context.fillText("GAME OVER", 600, 325);
        }
        if (gameScore > localStorage.getItem('highestGame')){
            localStorage.setItem('highestGame', gameScore);
        }
    },
    clear : function() {
        this.context.clearRect(myGamePiece.fetchX()-15, myGamePiece.fetchY()-15, 30, 30);
        this.context.clearRect(10, 10, 30, 50);
        this.context.clearRect(1090, 10, 30, 50);
        this.context.font = "20px verdana";
        this.context.textAlign="left";
        this.context.textBaseline="top";
        this.context.fillStyle="#FFFFFF";
        this.context.fillText(gameScore.toString(), 20, 20);
        this.context.textAlign="right";
        this.context.textBaseline="top";
        this.context.fillText(score.toString(), 1100, 20);
    }
}

function loptica(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    var pocSmjer = Math.floor(Math.random()*2);
    if (pocSmjer)
        this.speed_x = pocBrzina*1;
    else
        this.speed_x = pocBrzina*(-1);
    this.speed_y = pocBrzina;
    this.x = x;
    this.y = y;
    this.fetchX = function() {
        return this.x;
    }
    this.fetchY = function(){
        return this.y;
    }
    this.update = function() {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.shadowBlur = 5;
        ctx.shadowColor = "black";
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }
    this.newPos = function() {
        if (this.x - this.width / 2 < 0)
            this.speed_x = pocBrzina;
        else if ((this.x + this.width / 2) >= myGameArea.context.canvas.width)
            this.speed_x = -pocBrzina;
        if (this.y - this.height / 2 < 0)
            this.speed_y = -pocBrzina;
        else if ((this.y + this.height / 2) >= myGameArea.context.canvas.height)
            myGameArea.stop();
        if (((this.x + this.width) >= (myGamePalica.fetchX())) && ((this.x) <= (myGamePalica.fetchX() + 100)) && (this.y + this.height) >= (myGamePalica.fetchY()) && (this.y <= myGamePalica.fetchY() + 20)){
            this.speed_y = pocBrzina;
        }
        for(let i = 0; i < pozCigli.length; i++){
            if (pozCigli[i].x < 0) continue;
            if (((this.y + this.height) >= pozCigli[i].y) && ((this.y) <= (pozCigli[i].y + 20)) && ((this.x + this.width) >= pozCigli[i].x) && ((this.x) <= pozCigli[i].x+100)){
                let overlapLeft   = this.x + this.width - pozCigli[i].x;
                let overlapRight  = pozCigli[i].x + 100 - this.x;
                let overlapTop    = this.y + this.height - pozCigli[i].y;
                let overlapBottom = pozCigli[i].y + 20 - this.y;

                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                // Determine collision side by smallest penetration
                if (minOverlap == overlapLeft) {
                    // Hit from left
                    this.speed_x = -this.speed_x *1.2;
                    //this.x = pozCigli[i].x - this.width - 0.1;
                }
                else if (minOverlap == overlapRight) {
                    // Hit from right
                    this.speed_x = this.speed_x *1.2;
                    //this.x = pozCigli[i].x + 100 + 0.1;
                }
                else if (minOverlap == overlapTop) {
                    // Hit from top
                    this.speed_y = this.speed_y *1.2;
                    //this.y = pozCigli[i].y - this.height - 0.1;
                }
                else if (minOverlap == overlapBottom) {
                    // Hit from bottom
                    this.speed_y = -this.speed_y *1.2;
                    //this.y = pozCigli[i].y + 20 + 0.1;
                }

                myGameArea.context.clearRect(pozCigli[i].x, pozCigli[i].y, 100, 20);
                pozCigli[i].x = -9999;
                pozCigli[i].y = -9999;
                this.x += this.speed_x;
                this.y -= this.speed_y;
                gameScore++;
                break;
            }
        }
        this.x += this.speed_x;
        this.y -= this.speed_y;
    }
}

function palica(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.color = color;
    this.pomak_x = 0;
    this.x = x;
    this.y = y;
    this.fetchX = function() {
        return this.x;
    }
    this.fetchY = function(){
        return this.y;
    }
    this.update = function() {
        ctx = myGameArea.context;
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = "black";
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
    this.newPos = function(smjer) {
        if (smjer == 'lijevo')
            this.pomak_x = -5;
        else if (smjer == 'desno')
            this.pomak_x = 5;
        if ((this.x + this.pomak_x) <= 2)
            this.pomak_x = 0;
        else if ((this.x + this.width + this.pomak_x) >= (myGameArea.context.canvas.width -2))
            this.pomak_x = 0;
        this.x += this.pomak_x;
    }
}

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.newPos();
    myGamePiece.update();
    if (gameScore == 50)
        myGameArea.stop();
}