let isGamePaused = true;
let isGameOver = false;
etime = 0;
class Player{
    constructor(isTurn){
        this.isTurn = isTurn;
        this.score = 0;
        this.tloc = [];
        this.time = 300;
    }
}

let blue = new Player(true);
let red = new Player(false);

function toggle(){
    if(!isGamePaused && !isGameOver){
        isGamePaused = true;
        document.getElementById("toggle").src = "imgs/play.png";
        document.getElementById("reset").style.display = "block";
    }
    else if(isGamePaused && !isGameOver){
        isGamePaused = false;
        document.getElementById("toggle").src = "imgs/pause.png";
        document.getElementById("reset").style.display = "none";
    }

    let t = setInterval(()=>{
        if(red.time !=0 && blue.time!=0 && !isGamePaused)
            etime++;
        else if(red.time == 0 || blue.time == 0)
            isGameOver = true;
        else if(isGamePaused || isGameOver){
            clearInterval(t);
            t = null;
        }
        updateTime();        
    },1000);
}

function reset(){
    blue = new Player(true);
    red = new Player(false);
    document.getElementById("redTimer").innerHTML = "5:00";
    document.getElementById("blueTimer").innerHTML = "5:00";
    document.getElementById("blueTimer").style.backgroundColor = "#bfff0f";
    document.getElementById("blue").style.border = "1px solid #bfff0f";
    document.getElementById("blueInfo").style.backgroundColor = "#bfff0f";
    document.getElementById("redTimer").style.backgroundColor = "whitesmoke";
    document.getElementById("red").style.border = "1px solid rgba(237, 51, 38, 0.8)";
    document.getElementById("redInfo").style.backgroundColor = "whitesmoke";
}

function swapTurn(){
    if(!isGamePaused && blue.isTurn){
        blue.isTurn = false;
        red.isTurn = true;
        document.getElementById("blueTimer").style.backgroundColor = "whitesmoke";
        document.getElementById("blue").style.border = "1px solid rgba(7, 27, 87, 0.914)";
        document.getElementById("blueInfo").style.backgroundColor = "whitesmoke";
        document.getElementById("redTimer").style.backgroundColor = "#bfff0f";
        document.getElementById("red").style.border = "1px solid #bfff0f";
        document.getElementById("redInfo").style.backgroundColor = "#bfff0f";
    }
    else if(!isGamePaused && red.isTurn){
        red.isTurn = false;
        blue.isTurn = true;
        document.getElementById("blueTimer").style.backgroundColor = "#bfff0f";
        document.getElementById("blue").style.border = "1px solid #bfff0f";
        document.getElementById("blueInfo").style.backgroundColor = "#bfff0f";
        document.getElementById("redTimer").style.backgroundColor = "whitesmoke";
        document.getElementById("red").style.border = "1px solid rgba(237, 51, 38, 0.8)";
        document.getElementById("redInfo").style.backgroundColor = "whitesmoke";
    }
}

function updateTime(){
    if(blue.isTurn && !isGameOver){
    blue.time -= etime;
    etime = 0;
    const mins = Math.floor(blue.time/60);
    const sec = blue.time - mins * 60;
    document.getElementById("blueTimer").innerHTML = `${mins}:${sec}`;
    }
    if(red.isTurn && !isGameOver){
    red.time -= etime;        etime = 0;
    const mins = Math.floor(red.time/60);
    const sec = red.time - mins * 60;
    document.getElementById("redTimer").innerHTML = `${mins}:${sec}`;
    }
}