const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 40;

// プレイヤー情報
let player = { x: 1, y: 1, hp: 20, maxHp: 20, level: 1, exp: 0 };

// 敵情報（複数）
let enemies = [
  { x:3, y:2, hp:10, maxHp:10, alive:true },
  { x:6, y:5, hp:12, maxHp:12, alive:true },
  { x:8, y:7, hp:15, maxHp:15, alive:true }
];

let map = [
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,0,0,0,1,0,0],
  [0,1,0,1,0,0,0,1,0,0],
  [0,0,0,0,0,1,0,0,0,0],
  [0,0,1,0,0,1,0,0,1,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,0,1,0,1,0,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0],
  [0,1,0,0,0,1,0,0,1,0],
  [0,0,0,0,0,0,0,0,0,0]
];

let inBattle = false;
let currentEnemy = null;

// 描画
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // マップ
  for(let y=0;y<10;y++){
    for(let x=0;x<10;x++){
      if(map[y][x]===1){
        ctx.fillStyle="grey";
        ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
      }
    }
  }
  // プレイヤー
  ctx.fillStyle="blue";
  ctx.fillRect(player.x*tileSize, player.y*tileSize, tileSize, tileSize);
  // 敵
  if(!inBattle){
    enemies.forEach(e=>{
      if(e.alive){
        ctx.fillStyle="red";
        ctx.fillRect(e.x*tileSize, e.y*tileSize, tileSize, tileSize);
      }
    });
  }
  // ステータス
  ctx.fillStyle="white";
  ctx.fillText(`HP: ${player.hp}/${player.maxHp}  LV:${player.level}  EXP:${player.exp}`,10,15);
}

draw();

// 移動
document.addEventListener("keydown", e=>{
  if(inBattle) return;
  let nx=player.x, ny=player.y;
  if(e.key==="ArrowUp") ny--;
  if(e.key==="ArrowDown") ny++;
  if(e.key==="ArrowLeft") nx--;
  if(e.key==="ArrowRight") nx++;
  if(map[ny][nx]===0){
    player.x=nx;
    player.y=ny;
    checkBattle();
  }
  draw();
});

// バトル判定
function checkBattle(){
  enemies.forEach(e=>{
    if(e.alive && player.x===e.x && player.y===e.y){
      inBattle=true;
      currentEnemy=e;
      alert("敵に遭遇！バトル開始！");
      drawBattle();
    }
  });
}

// 戦闘描画
function drawBattle(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="black";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  // プレイヤー
  ctx.fillStyle="blue";
  ctx.fillRect(50,200,50,50);
  // 敵
  if(currentEnemy.alive){
    ctx.fillStyle="red";
    ctx.fillRect(300,200,50,50);
  }
  ctx.fillStyle="white";
  ctx.fillText(`プレイヤーHP: ${player.hp}`,50,180);
  ctx.fillText(`敵HP: ${currentEnemy.hp}`,300,180);
  ctx.fillText(`LV:${player.level} EXP:${player.exp}`,50,20);
}

// 戦闘アクション
function action(type){
  if(!inBattle) return;
  if(type==="attack"){
    currentEnemy.hp -= Math.floor(Math.random()*5)+1;
  } else if(type==="defend"){
    player.hp += 2;
    if(player.hp>player.maxHp) player.hp=player.maxHp;
  }
  // 敵生存なら攻撃
  if(currentEnemy.hp>0){
    player.hp -= Math.floor(Math.random()*4)+1;
    if(player.hp<=0){
      alert("ゲームオーバー");
      player.hp=player.maxHp;
      player.x=1;
      player.y=1;
      inBattle=false;
      draw();
      return;
    }
  } else {
    // 敵倒した
    alert("勝利！");
    player.exp += 5;
    inBattle=false;
    currentEnemy.alive=false;
    // レベルアップ
    if(player.exp>=10){
      player.level++;
      player.exp=0;
      player.maxHp +=5;
      player.hp = player.maxHp;
      alert("レベルアップ！");
    }
  }
  drawBattle();
}

