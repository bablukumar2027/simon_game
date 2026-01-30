let gameSeq = [];
let userSeq = [];

let started = false;
let level = 0;

let btns = ["red","yellow","green","blue"];

let h3 = document.querySelector("h3");

document.addEventListener("keypress" ,function(){
    if (started == false) {
        console.log("Game is started");
        started = true;
        levelUp();
    }  
});




function checkAns(idx) {
    
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length == gameSeq.length){
            setTimeout(levelUp, 1000)

        }
    } else {
        h3.innerHTML = `Game over! <b> Your score was ${level}</b> <br> press any key to restart`;
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function () {
            document.querySelector("body").style.backgroundColor = "white";
        },250);
        reset();
    }
}




function gameFlash(btn) {
    btn.classList.add("flash");
    setTimeout(function () {
        btn.classList.remove("flash");
    },250)
}
function userFlash(btn) {
    btn.classList.add("userflash");
    setTimeout(function () {
        btn.classList.remove("userflash");
    },550)
}  
function levelUp(){
    userSeq = [];
    level++;
    h3.innerText =`level ${level}`;

    let randIdx = Math.floor(Math.random() * 3);
    let randColor = btns[randIdx];
    let randBtns = document.querySelector(`.${randColor}`)
    gameSeq.push(randColor);
    console.log(gameSeq);

    gameFlash(randBtns);
}
function btnPress() {
    let btn = this;
    userFlash(btn);

    userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkAns(userSeq.length - 1);
}



let allBtns = document.querySelectorAll(".btn");
for (btn of allBtns) {
    btn.addEventListener("click", btnPress);

}
function reset(){
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}