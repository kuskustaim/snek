let canvas, ctx;
let snek = [];
let ShouldGrow = false;
let Fruit = {};
let CurrentKey = "";

const FOODC = "rgba(232, 22, 22, 1)";
const SNEKC = "rgba(153, 215, 53, 1)";
const LBACK = "rgba(75, 167, 253, 1)";
const DBACK = "rgba(75, 157, 234, 1)";

let StartSound = new Audio("start.wav");
let GotFruit = new Audio("fruit.wav");
let MoveSound = new Audio("move.wav");
let FailSound = new Audio("fail.wav");


function StartGame(){
    document.getElementById("counter").innerHTML = 0;
    StartSound.play();
    document.getElementById("Menu").style.display = "none";
    document.getElementById('BackgroudShadow').style.display = 'block';

    canvas = document.getElementById("snekuskus");
    ctx = canvas.getContext("2d");
    ctx.fillStyle = DBACK;
    PrepareBack();

    ctx.fillStyle = SNEKC;
    snek = [
        {x: canvas.width / 3 - 30, y: canvas.height / 2 - 15}, 
        {x: canvas.width / 3 - 60, y: canvas.height / 2 - 15},
        {x: canvas.width / 3 - 90, y: canvas.height / 2 - 15}
    ];
    ShouldGrow = false;

    Fruit = {x: snek[0].x + 300, y: snek[0].y}

    for (let i = 0; i < snek.length; i++)
        ctx.fillRect(snek[i].x, snek[i].y, 30, 30);

    ctx.fillStyle = FOODC;
    ctx.fillRect(Fruit.x, Fruit.y, 30, 30);

    MakeBorder();

    CurrentKey = "";

    window.addEventListener("keydown", function(event) {
        if (NotOpposite(event.key)){
            CurrentKey = event.key;
            MoveSound.play();
        }
    });

    GameLoop()
}


function GameLoop(){
    if (!SelfCollision()) {
        if (Math.round(snek[0].x) === Fruit.x && Math.round(snek[0].y) === Fruit.y){
            GotFruit.play();
            document.getElementById("counter").innerHTML++; 
            do{
                Fruit.x = Math.floor((Math.random() * 25) + 1) * 30;
                Fruit.y = Math.floor((Math.random() * 17) + 1) * 30;
            } while (getPixelColor(Fruit.x, Fruit.y) === SNEKC)
            ctx.fillStyle = FOODC;
            ctx.fillRect(Fruit.x, Fruit.y, 30, 30);
            ShouldGrow = true;
        }
        MoveS(CurrentKey);

        setTimeout(GameLoop, 150); // Call again after 150 ms
    }
    else{
        document.getElementById("Menu").style.display = "block";
        FailSound.play();
    }
        
}

function FillBack(flag, x, y){
    if (!flag){
        if ((x + y) % 2 == 0)
            ctx.fillStyle = LBACK;
        else
            ctx.fillStyle = DBACK;
        ctx.fillRect(x * 30, y  * 30, 30, 30)
    }
}

function PrepareBack(){
    ctx.fillStyle = LBACK;
    ctx.fillRect(0,0, 810, 570);
    for (let i = 0; i < 15 ; i++){
        for (let j = 0; j < 19; j++){
            ctx.fillStyle = DBACK;
            let flag = j % 2 + 1;
            ctx.fillRect(i * 60 - 30 * flag, j * 30, 30, 30);
        }
    }
}

function MoveS(dir){
    switch(dir){
        case "ArrowRight":
            FillBack(ShouldGrow, snek[0].x / 30, snek[0].y / 30);
            MoveFullSnek();
            snek[0].x += 30;
            ctx.fillStyle = SNEKC;
            ctx.fillRect(snek[0].x, snek[0].y, 30, 30);
            break;
        case "ArrowLeft":
            FillBack(ShouldGrow, snek[0].x / 30, snek[0].y / 30);
            MoveFullSnek();
            snek[0].x -= 30;
            ctx.fillStyle = SNEKC;
            ctx.fillRect(snek[0].x, snek[0].y, 30, 30);
            break;
        case "ArrowUp":
            FillBack(ShouldGrow, snek[0].x / 30, snek[0].y / 30);
            MoveFullSnek();
            snek[0].y -= 30;
            ctx.fillStyle = SNEKC;
            ctx.fillRect(snek[0].x, snek[0].y, 30, 30);
            break;
        case "ArrowDown":
            FillBack(ShouldGrow, snek[0].x / 30, snek[0].y / 30);
            MoveFullSnek();
            snek[0].y += 30;
            ctx.fillStyle = SNEKC;
            ctx.fillRect(snek[0].x, snek[0].y, 30, 30);
            break;
    }
}

function NotOpposite(dir){
    if (snek.length < 2) return true;
    if (!(dir === "ArrowRight" || dir === "ArrowUp" || dir === "ArrowDown" || dir === "ArrowLeft"))
        return false;
    let head = snek[0];
    let neck = snek[1];
    
    if (dir === "ArrowRight")
        return !(neck.x === head.x + 30 && neck.y === head.y);
    if (dir === "ArrowLeft")
        return !(neck.x === head.x - 30 && neck.y === head.y);
    if (dir === "ArrowUp")
        return !(neck.x === head.x && neck.y === head.y - 30);
    if (dir === "ArrowDown")
        return !(neck.x === head.x && neck.y === head.y + 30);
    
    return true; // allow by default
}

function MoveFullSnek(){
    if (ShouldGrow){
        snek.push({x: snek[snek.length - 1].x, y: snek[snek.length - 1].y})
        ctx.fillStyle = SNEKC;
        ctx.fillRect(snek[snek.length - 1].x, snek[snek.length - 1].y, 30, 30);
        ShouldGrow = false;
    }
    else{
        FillBack(ShouldGrow, snek[snek.length - 1].x / 30, snek[snek.length - 1].y / 30);
    }
    for (let i = snek.length - 1; i > 0; i--){
        snek[i].x = snek[i - 1].x;
        snek[i].y = snek[i - 1].y;
        ctx.fillStyle = SNEKC;
        ctx.fillRect(snek[i].x, snek[i].y, 30, 30);
    }
}

function getPixelColor(x, y) {
    const imageData = ctx.getImageData(x, y, 1, 1); 
    const data = imageData.data; // Uint8ClampedArray with [R, G, B, A]
    
    const r = data[0];
    const g = data[1];
    const b = data[2];
    const a = data[3] / 255; // alpha 0–1

    return String("rgba(" + r + ", " + g + ", " + b + ", " + a + ")"); 
}

function SelfCollision(){
    let head = snek[0];
    if (head.x === 0 || head.x === 780 || head.y === 0 || head.y === 540)
        return true;
    for (let i = 1; i < snek.length; i++){
        if (snek[0].x === snek[i].x && snek[0].y === snek[i].y)
            return true;
    }
    return false
}

function MakeBorder(){
    ctx.fillStyle = "rgba(14, 49, 166 ,1)"
    ctx.fillRect(0, 0, 810, 17); // top
    ctx.fillRect(0, 0, 17, 570); //left
    ctx.fillRect(0, 553, 810, 17); //bottom
    ctx.fillRect(793, 0, 17, 570); //right
}