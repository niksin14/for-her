/* ================= STAGE NAVIGATION ================= */

function nextStage(n){
  document.querySelectorAll(".stage").forEach(s=>s.classList.remove("active"));
  document.getElementById("stage"+n).classList.add("active");
  updateProgress(n);
}

function updateProgress(n){
  let map={1:1,2:1,3:2,4:2,5:3,6:3,7:3,8:3,9:4};
  let main=map[n];
  document.getElementById("stageText").innerText="Stage "+main+" / 4";
  document.getElementById("progressFill").style.width=(main/4)*100+"%";
}

/* ================= XO GAME ================= */

let board=["","","","","","","","",""];
let active=true;
const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function createBoard(){
  const el=document.getElementById("board");
  el.innerHTML="";
  board=["","","","","","","","",""];
  board.forEach((_,i)=>{
    let c=document.createElement("div");
    c.classList.add("cell");
    c.onclick=()=>move(i);
    el.appendChild(c);
  });
}
createBoard();

function move(i){
  if(!active||board[i]!="")return;
  board[i]="❤️";
  update();

  if(check("❤️")){ end("You win 😍"); return; }
  if(!board.includes("")){ end("Draw"); return; }

  setTimeout(ai,400);
}

function ai(){
  let empty=board.map((v,i)=>v==""?i:null).filter(v=>v!==null);
  if(empty.length===0)return;
  board[empty[Math.floor(Math.random()*empty.length)]]="💙";
  update();
  if(check("💙")) end("I win 😏");
}

function update(){
  document.querySelectorAll(".cell").forEach((c,i)=>c.innerText=board[i]);
}

function check(sym){
  return wins.some(w=>w.every(i=>board[i]===sym));
}

function end(msg){
  document.getElementById("gameStatus").innerText=msg;
  active=false;

  let btn=document.getElementById("toQA");

  if(msg==="You win 😍"){
    btn.style.display="inline-block";
  }else{
    btn.style.display="none";
  }
}

function resetGame(){
  createBoard();
  active=true;
  document.getElementById("gameStatus").innerText="";
  document.getElementById("toQA").style.display="none";
}

/* ================= Q&A ================= */

const questions=[
{q:"What is my favourite food?",o:["Chicken","Varan Batti","Puran Poli"],a:0},
{q:"My favourite color?",o:["Green","Blue","White"],a:0},
{q:"My favourite place to visit?",o:["Mountains","A peaceful place","Any other country"],a:1}
];

let current=0;

function startQA(){
  current=0;
  nextStage(4);
  loadQ();
}

function loadQ(){
  let q=questions[current];
  document.getElementById("question").innerText=q.q;
  document.getElementById("qaResult").innerText="";
  let div=document.getElementById("options");
  div.innerHTML="";
  q.o.forEach((opt,i)=>{
    let b=document.createElement("button");
    b.innerText=opt;
    b.onclick=()=>answer(i,b);
    div.appendChild(b);
  });
}

function answer(i,btn){
  let correct=questions[current].a;
  let buttons=document.querySelectorAll("#options button");
  buttons.forEach(b=>b.disabled=true);

  if(i===correct){
    btn.classList.add("correct");
    document.getElementById("qaResult").innerText="Correct 😍";

    setTimeout(()=>{
      current++;
      if(current<questions.length){
        loadQ();
      }else{
        startHeartGame();
      }
    },800);

  }else{
    btn.classList.add("wrong");
    document.getElementById("qaResult").innerText="Seriously! 😏 Try again!";

    setTimeout(()=>{
      buttons.forEach(b=>{
        b.disabled=false;
        b.classList.remove("wrong");
      });
    },600);
  }
}

/* ================= HEART GAME ================= */

let score=0, interval;

function startHeartGame(){
  score=0;
  document.getElementById("heartScore").innerText=score;
  nextStage(5);
  showHeartInstruction();
}

function showHeartInstruction(){
  let area=document.getElementById("heartGame");

  let overlay=document.createElement("div");
  overlay.style.position="absolute";
  overlay.style.top="0";
  overlay.style.left="0";
  overlay.style.width="100%";
  overlay.style.height="100%";
  overlay.style.display="flex";
  overlay.style.justifyContent="center";
  overlay.style.alignItems="center";
  overlay.style.borderRadius="15px";
  overlay.style.background="linear-gradient(135deg,#ff9a9e,#fad0c4)";
  overlay.style.zIndex="10";

  overlay.innerHTML=`
    <div style="background:rgba(255,255,255,0.25);padding:20px;border-radius:20px;color:white;text-align:center;width:85%;">
      <h2>💖 Ready?</h2>
      <p>Collect <b>10 hearts</b> to unlock the next stage.</p>
      <button id="startCatchBtn">Start Catching 💗</button>
    </div>
  `;

  area.appendChild(overlay);

  document.getElementById("startCatchBtn").onclick=function(){
    overlay.remove();
    interval=setInterval(createHeart,800);
  };
}

function createHeart(){
  let area=document.getElementById("heartGame");
  let h=document.createElement("div");
  h.classList.add("falling");
  h.innerText="💖";
  h.style.left=Math.random()*90+"%";
  h.style.animationDuration=(Math.random()*2+3)+"s";

  h.onclick=function(){
    h.remove();
    score++;
    document.getElementById("heartScore").innerText=score;

    if(score>=10){
      clearInterval(interval);
      showHeartCompletion();
    }
  };

  area.appendChild(h);
  setTimeout(()=>h.remove(),5000);
}

function showHeartCompletion(){
  let area=document.getElementById("heartGame");

  let overlay=document.createElement("div");
  overlay.style.position="absolute";
  overlay.style.top="0";
  overlay.style.left="0";
  overlay.style.width="100%";
  overlay.style.height="100%";
  overlay.style.display="flex";
  overlay.style.justifyContent="center";
  overlay.style.alignItems="center";
  overlay.style.borderRadius="15px";
  overlay.style.background="linear-gradient(135deg,#ff9a9e,#fad0c4)";
  overlay.style.zIndex="20";

  overlay.innerHTML=`
    <div style="background:rgba(255,255,255,0.3);padding:25px;border-radius:20px;color:white;text-align:center;width:85%;">
      <h2>You caught all my love 💖</h2>
      <p>You didn’t miss a single one 😌</p>
      <button id="continueAfterHeart">Continue 💗</button>
    </div>
  `;

  area.appendChild(overlay);

  document.getElementById("continueAfterHeart").onclick=function(){
    overlay.remove();
    nextStage(6);
  };
}

/* ================= CONFIRMATION ================= */

function scaredMessage(stage){
  let messages={
    6:"I knew you were scared 😏",
    7:"Still scared? 😈",
    8:"There’s no escape now 😂"
  };
  document.getElementById("scare"+stage).innerText=messages[stage];
}

/* ================= FINAL SCREEN ================= */

function showFinal(){
  document.querySelector(".container").style.display="none";
  document.getElementById("finalScreen").style.display="flex";
  setInterval(createFinalHeart,700);
}

/* ================= FLOATING BACKGROUND HEARTS ================= */

function bgHeart(){
  let h=document.createElement("div");
  h.classList.add("bg-heart");
  h.innerText="❤️";
  h.style.left=Math.random()*100+"vw";
  h.style.fontSize=(Math.random()*20+15)+"px";
  h.style.animationDuration=(Math.random()*5+5)+"s";
  document.querySelector(".bg-hearts").appendChild(h);
  setTimeout(()=>h.remove(),8000);
}
setInterval(bgHeart,500);

/* Alternate typing bubbles */

setInterval(()=>{
  let girlBubble=document.querySelector(".girl .bubble");
  let boyBubble=document.querySelector(".boy .bubble");

  girlBubble.style.opacity="1";
  boyBubble.style.opacity="0.4";

  setTimeout(()=>{
    girlBubble.style.opacity="0.4";
    boyBubble.style.opacity="1";
  },1200);

},2400);

/* Final floating hearts */

function createFinalHeart(){
  let screen=document.getElementById("finalScreen");
  let h=document.createElement("div");
  h.classList.add("final-heart");
  h.innerText="💗";
  h.style.left=Math.random()*100+"vw";
  h.style.animationDuration=(Math.random()*5+5)+"s";
  screen.appendChild(h);
  setTimeout(()=>h.remove(),8000);
}
