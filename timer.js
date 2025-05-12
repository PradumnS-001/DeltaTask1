let isGamePaused = true;
let isGameOver = false;
let isPlacementPhase = true;
let tempVar, n = null;
etime = 0;
let move = false;
const image = document.getElementById("gameMap");
let sizingRatio = 844 / image.clientHeight;
let ulkdnodes = [1,2,3,4,5,6];
let inner = [18,17,16,15,14,13];
let nodes = [
    [1,[2,6,7],[2,3,1]],
    [2,[1,3],[2,1]],
    [3,[2,4,9],[1,2,1]],
    [4,[3,5],[2,1]],
    [5,[4,6,11],[1,1,1]],
    [6,[1,5],[3,1]],
    [7,[1,8,12],[1,5,4]],
    [8,[7,9,17],[5,6,1]],
    [9,[3,8,10],[1,6,4]],
    [10,[9,11,15],[4,5,1]],
    [11,[5,10,12],[1,5,6]],
    [12,[7,11,13],[4,6,1]],
    [13,[12,14,18],[1,8,9]],
    [14,[13,18],[8,8]],
    [15,[10,14,16],[1,8,9]],
    [16,[15,17],[9,8]],
    [17,[8,16,18],[1,8,8]],
    [18,[13,17],[9,8]]
];
let x,y = 0;
const rect = image.getBoundingClientRect();

image.addEventListener("click", (event)=>{        
        x = event.pageX - rect.left;
        y = event.pageY - rect.top;
        if(!isGamePaused && !isGameOver){
            n = whichNode();

            if(red.tloc.length === 4 && blue.tloc.length === 4 && isPlacementPhase){
                isPlacementPhase = false;
            }
            if(isPlacementPhase && isnValid(n) == 1){
                if(blue.isTurn){
                    blue.tloc.push(n);
                    allTitansInGame();
                    score();
                    placeTitan();
                    swapTurn();
                }
                else if(red.isTurn){
                    red.tloc.push(n);
                    allTitansInGame();
                    score();
                    placeTitan();
                    swapTurn();
                }
            }
            else if(isnValid(n) == 2 && !move){
                tempVar = n;
                move = true;
            }  
            else if(isnValid(n)==1 && move && nodes[tempVar-1][1].includes(n) && blue.isTurn){
                blue.tloc[blue.tloc.indexOf(tempVar)] = n;
                move = false;
                allTitansInGame();
                score();
                placeTitan();
                swapTurn();
            }
            else if(isnValid(n)==1 && move && nodes[tempVar-1][1].includes(n) && red.isTurn){
                red.tloc[red.tloc.indexOf(tempVar)] = n;
                move = false;
                allTitansInGame();
                score();
                placeTitan();
                swapTurn();
            }

            if(isInnerCirc())
                isGameOver = true;
            if(isGameOver){EndGame();}
        }
    });

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
    isPlacementPhase = true;
    isGameOver = false;
    isGamePaused = true;
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

function whichNode(){
    let ax,ay = 0; 
    ax = x*sizingRatio;
    ay = y*sizingRatio;

    for(let node of nodes){
        let dist = (node[2][0]-ax)**2 + (node[2][1]-ay)**2;
        if(dist <= 484){
            return node[0];
        }
    }
    return 0;
}

function placeTitan(){
    const blueTitan1 = document.getElementById("blueTitan1");
    const blueTitan2 = document.getElementById("blueTitan2");
    const blueTitan3 = document.getElementById("blueTitan3");
    const blueTitan4 = document.getElementById("blueTitan4");
    const redTitan1 = document.getElementById("redTitan1");
    const redTitan2 = document.getElementById("redTitan2");
    const redTitan3 = document.getElementById("redTitan3");
    const redTitan4 = document.getElementById("redTitan4");

    if(blue.tloc[0] == 0){blueTitan1.style.display = "None";}
    else{
        blueTitan1.style.display = "Block";
        blueTitan1.left = nodes[blue.tloc[0]-1][2][0] / sizingRatio;
        blueTitan1.top = nodes[blue.tloc[0]-1][2][1] / sizingRatio;
    }
    if(blue.tloc.length > 1){
        if(blue.tloc[1] == 0){blueTitan2.style.display = "None";}
        else{
            blueTitan2.style.display = "Block";
            blueTitan2.left = nodes[blue.tloc[1]-1][2][0] / sizingRatio;
            blueTitan2.top = nodes[blue.tloc[1]-1][2][1] / sizingRatio;
        }
        if(blue.tloc.length > 2){
            if(blue.tloc[2] == 0){blueTitan3.style.display = "None";}
            else{
                blueTitan3.style.display = "Block";
                blueTitan3.left = nodes[blue.tloc[2]-1][2][0] / sizingRatio;
                blueTitan3.top = nodes[blue.tloc[2]-1][2][1] / sizingRatio;
            }
            if(blue.tloc.length > 3){
                if(blue.tloc[3] == 0){blueTitan4.style.display = "None";}
                else{
                    blueTitan4.style.display = "Block";
                    blueTitan4.left = nodes[blue.tloc[3]-1][2][0] / sizingRatio;
                    blueTitan4.top = nodes[blue.tloc[3]-1][2][1] / sizingRatio;
                }
            }
        }
    }
    if(red.tloc.length > 0){
        if(red.tloc[0] == 0){redTitan1.style.display = "None";}
        else{
            redTitan1.style.display = "Block";
            redTitan1.left = nodes[red.tloc[0]-1][2][0] / sizingRatio;
            redTitan1.top = nodes[red.tloc[0]-1][2][1] / sizingRatio;
        }
    }
    if(red.tloc.length > 1){
        if(red.tloc[1] == 0){redTitan2.style.display = "None";}
        else{
            redTitan2.style.display = "Block";
            redTitan2.left = nodes[red.tloc[1]-1][2][0] / sizingRatio;
            redTitan2.top = nodes[red.tloc[1]-1][2][1] / sizingRatio;
        }
        if(red.tloc.length > 2){
            if(red.tloc[2] == 0){redTitan3.style.display = "None";}
            else{
                redTitan3.style.display = "Block";
                redTitan3.left = nodes[red.tloc[2]-1][2][0] / sizingRatio;
                redTitan3.top = nodes[red.tloc[2]-1][2][1] / sizingRatio;
            }
            if(red.tloc.length > 3){
                if(red.tloc[3] == 0){redTitan4.style.display = "None";}
                else{
                    redTitan4.style.display = "Block";
                    redTitan4.left = nodes[red.tloc[3]-1][2][0] / sizingRatio;
                    redTitan4.top = nodes[red.tloc[3]-1][2][1] / sizingRatio;
                }
            }
        }
    }
}

function isnValid(n){
    if(n == 0){return 0;}
    if(blue.isTurn){
        for(let i of blue.tloc){
            if(i == n)
                return 2;
        }
        for(let i of red.tloc){
            if(i == n)
                return 0;
        }
    }
    if(red.isTurn){
        for(let i of red.tloc){
            if(i == n)
                return 2;
        }
        for(let i of blue.tloc){
            if(i == n)
                return 0;
        }
    }
    for(let i of ulkdnodes){
            if(i == n)
                return 1;
        }
}

function allTitansInGame(){
    let surrounded = true;
    for(let i of blue.tloc){
        for(let j of nodes[i-1][1]){
            if(!red.tloc.includes(j))
                surrounded = false;
        }
        if(surrounded){
            blue.tloc[blue.tloc.indexOf(i)] = 0;
        }
        else{surrounded = true;}
    }
    surrounded = true;
    for(let i of red.tloc){
        for(let j of nodes[i-1][1]){
            if(!blue.tloc.includes(j))
                surrounded = false;
        }
        if(surrounded){
            red.tloc[red.tloc.indexOf(i)] = 0;
        }
        else{surrounded = true;}
    }
}

function score(){
    let redr, blur = [];

    for(let i of blue.tloc){
        if(i != 0){blur.push(i);}
    }
    if(blur.length < 2){isGameOver = true;blue.score = 0;}
    else{
        for(i of blur){
            for(j of blur){
                if(nodes[i-1][1].contains(j)){
                    blue.score += (nodes[i-1][3][nodes[i-1][1].indexOf(j)]);
                }
            }
        }
        if(blue.score != 0){blue.score /= 2;}
    }

    for(let i of red.tloc){
        if(i != 0){redr.push(i);}
    }
    if(redr.length < 2){isGameOver = true;red.score = 0;}
    else{
        for(i of redr){
            for(j of redr){
                if(nodes[i-1][1].contains(j)){
                    red.score += (nodes[i-1][3][nodes[i-1][1].indexOf(j)]);
                }
            }
        }
        if(red.score != 0){red.score /= 2;}
    }

    document.getElementById("rs").innerHTML = `+${red.score}`;
    document.getElementById("bs").innerHTML = `+${blue.score}`;
}

function isInnerCirc(){
    let loc = (blue.tloc).concat(red.tloc);
    let flag = true;
    for(let i of inner){
        if(!loc.contains(i))
            flag = false;
    }
    return flag;
}

function EndGame(){
}

function blueWon(){
}

function redWon(){
}