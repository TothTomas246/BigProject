"use strict";
const techDiv = document.getElementById("technical");
const characterDiv = document.getElementById("characters");
const actionDiv = document.getElementById("actions");
const targetDiv = document.getElementById("targets");
const StartBtn = document.getElementById("startBtn");
var thingymabobDiv;
var mage1;
var warrior1;
var bard1;
heroes = [];
//deklarace všech statistik v HTML
var MageNameHtml;
var MageHpHtml;
var MageManaHtml;
var WarriorNameHtml;
var WarriorHpHtml;
var BardNameHtml;
var BardHpHtml;
var enemy1NameHtml;
var enemy1HpHtml;
var enemy2NameHtml;
var enemy2HpHtml;
var enemy3NameHtml;
var enemy3HpHtml;
var mageActionDiv = null;
var mageTargetDiv = null;
var warriorActionDiv = null;
var warriorTargetDiv = null;
var bardActionDiv = null;
var bardTargetDiv = null;
//interní vypsání nepřátelů na každou vlnu (w1s1 = wave 1 slot 1)
var w1s1 = new goomba(1);
var w1s2 = new goomba(2);
var w1s3 = new goomba(3);
var wave1 = [w1s1, w1s2, w1s3];
var w2s1 = new goomba(1);
var w2s2 = new koopa(2);
var w2s3 = new goomba(3);
var wave2 = [w2s1, w2s2, w2s3];
var w3s1 = new koopa(1);
var w3s2 = new koopa(2);
var w3s3 = new koopa(3);
var wave3 = [w3s1, w3s2, w3s3];
//variable pro útoky hrdinů
var mageAct = null;
var warriorAct = null;
var bardAct = null;
//variable pro cílenou skupinu | nepřítele
var mageTarg = null;
var warriorTarg = null;
var bardTarg = null;
//variable pro kolo a vlnu
var turncounter = 1;
var wave = 1;
function nameInputSequence() {
    const ContinueBtn = document.createElement("Button");
    ContinueBtn.innerHTML = "Confirm";
    ContinueBtn.id = "continueBtn";
    ContinueBtn.onclick = start;
    techDiv.appendChild(ContinueBtn);
    const mageName = document.createElement("input");
    mageName.id = "mageNameInp";
    const mageLabel = document.createElement("label");
    mageLabel.innerHTML = "Input the name of the mage: ";
    mageLabel.htmlFor = "MageNameInp";
    mageLabel.id = "mageNameLab";
    characterDiv.appendChild(mageLabel);
    characterDiv.appendChild(mageName);
    const warriorName = document.createElement("input");
    warriorName.id = "warriorNameInp";
    const warriorLabel = document.createElement("label");
    warriorLabel.innerHTML = "Input the name of the warrior: ";
    warriorLabel.htmlFor = "warriorNameInp";
    warriorLabel.id = "warriorNameLab";
    actionDiv.appendChild(warriorLabel);
    actionDiv.appendChild(warriorName);
    const bardName = document.createElement("input");
    bardName.id = "bardNameInp";
    const bardLabel = document.createElement("label");
    bardLabel.innerHTML = "Input the name of the bard: ";
    bardLabel.htmlFor = "bardNameInp";
    bardLabel.id = "bardNameLab";
    targetDiv.appendChild(bardLabel);
    targetDiv.appendChild(bardName);
    StartBtn.remove();
}
function start() {
    enemies = wave1;
    const mageInp = document.getElementById("mageNameInp");
    const warriorInp = document.getElementById("warriorNameInp");
    const bardInp = document.getElementById("bardNameInp");
    if (String(mageInp.value) == "" || String(warriorInp.value) == "" || String(bardInp.value) == "") {
        console.warn("C'mon man... give them all a name");
        return;
    }
    mage1 = new mage(80, 60, String(mageInp.value), 100, 0, 1);
    warrior1 = new warrior(100, 50, String(warriorInp.value), 25, 2);
    bard1 = new bard(70, 20, String(bardInp.value), 0, 3);
    heroes = [mage1, warrior1, bard1];
    charCancelBtnPressed();
    actCancelBtnPressed();
    selectCancelBtnPressed();
    // CREATE STATS ELEMENTS INSTEAD OF USING innerHTML +=
    const statsDiv = document.createElement("div");
    statsDiv.id = "Stats";
    const characterStats = document.createElement("div");
    characterStats.id = "characterStats";
    const mageStats = document.createElement("div");
    mageStats.className = "characterStats";
    mageStats.id = "MageStats";
    mageStats.innerHTML = `
        <img src="img/MagePlaceholder.jpg" id="MageImg" class="heroImage" width="100px">
        <div id="MageName"></div>
        <div id="MageHp"></div>
        <div id="MageMana"></div>
        <div id="MageActionArea" class="heroActionArea"></div>
        <div id="MageTargetArea" class="heroTargetArea"></div>
    `;
    characterStats.appendChild(mageStats);
    const warriorStats = document.createElement("div");
    warriorStats.className = "characterStats";
    warriorStats.id = "WarriorStats";
    warriorStats.innerHTML = `
        <img src="img/WarriorPlaceholder.png" id="WarriorImg" class="heroImage" width="100px">
        <div id="WarriorName"></div>
        <div id="WarriorHp"></div>
        <div id="WarriorActionArea" class="heroActionArea"></div>
        <div id="WarriorTargetArea" class="heroTargetArea"></div>
    `;
    characterStats.appendChild(warriorStats);
    const bardStats = document.createElement("div");
    bardStats.className = "characterStats";
    bardStats.id = "BardStats";
    bardStats.innerHTML = `
        <img src="img/BardPlaceholder.png" id="BardImg" class="heroImage" width="100px">
        <div id="BardName"></div>
        <div id="BardHp"></div>
        <div id="BardActionArea" class="heroActionArea"></div>
        <div id="BardTargetArea" class="heroTargetArea"></div>
    `;
    characterStats.appendChild(bardStats);
    statsDiv.appendChild(characterStats);
    const enemyStats = document.createElement("div");
    enemyStats.className = "characterStats";
    enemyStats.id = "enemyStats";
    const enemy1Stats = document.createElement("div");
    enemy1Stats.id = "enemy1Stats";
    enemy1Stats.innerHTML = `
        <image id="Enemy1Img" Width=100px>
        <div id="enemy1Name"></div>
        <div id="enemy1HP"></div>
    `;
    enemyStats.appendChild(enemy1Stats);
    const enemy2Stats = document.createElement("div");
    enemy2Stats.className = "characterStats";
    enemy2Stats.id = "enemy2Stats";
    enemy2Stats.innerHTML = `
        <image id="Enemy2Img" Width=100px>
        <div id="enemy2Name"></div>
        <div id="enemy2HP"></div>
    `;
    enemyStats.appendChild(enemy2Stats);
    const enemy3Stats = document.createElement("div");
    enemy3Stats.className = "characterStats";
    enemy3Stats.id = "enemy3Stats";
    enemy3Stats.innerHTML = `
        <image id="Enemy3Img" Width=100px>
        <div id="enemy3Name"></div>
        <div id="enemy3HP"></div>
    `;
    enemyStats.appendChild(enemy3Stats);
    statsDiv.appendChild(enemyStats);
    document.body.appendChild(statsDiv);
    mageActionDiv = document.getElementById("MageActionArea");
    mageTargetDiv = document.getElementById("MageTargetArea");
    warriorActionDiv = document.getElementById("WarriorActionArea");
    warriorTargetDiv = document.getElementById("WarriorTargetArea");
    bardActionDiv = document.getElementById("BardActionArea");
    bardTargetDiv = document.getElementById("BardTargetArea");
    const mageImg = document.getElementById("MageImg");
    const warriorImg = document.getElementById("WarriorImg");
    const bardImg = document.getElementById("BardImg");
    mageImg.addEventListener("click", MageBtnPressed);
    warriorImg.addEventListener("click", WarriorBtnPressed);
    bardImg.addEventListener("click", BardBtnPressed);
    MageNameHtml = document.getElementById("MageName");
    MageHpHtml = document.getElementById("MageHp");
    MageManaHtml = document.getElementById("MageMana");
    WarriorNameHtml = document.getElementById("WarriorName");
    WarriorHpHtml = document.getElementById("WarriorHp");
    BardNameHtml = document.getElementById("BardName");
    BardHpHtml = document.getElementById("BardHp");
    enemy1NameHtml = document.getElementById("enemy1Name");
    enemy1HpHtml = document.getElementById("enemy1HP");
    enemy2NameHtml = document.getElementById("enemy2Name");
    enemy2HpHtml = document.getElementById("enemy2HP");
    enemy3NameHtml = document.getElementById("enemy3Name");
    enemy3HpHtml = document.getElementById("enemy3HP");
    const thingymabob = document.createElement("div");
    document.body.appendChild(thingymabob);
    thingymabob.id = "Thingymabob";
    const endTurnBtn = document.createElement("button");
    endTurnBtn.innerHTML = "Finish Turn";
    endTurnBtn.onclick = () => TurnFinishpressed();
    endTurnBtn.id = "TurnFinish";
    thingymabob.appendChild(endTurnBtn);
    updateHtmlStats();
    console.log(enemies);
    console.log(heroes);
}
//funkce která kontroluje jestli jsou všichni nepřátelé mrtví
function enemiesDeadChecker() {
    var deadcounter = 0;
    for (var i = 0; i < 3; i++) {
        if (enemies[i] == null) {
            deadcounter++;
        }
    }
    if (deadcounter == 3) {
        return true;
    }
    else {
        return false;
    }
}
function updateHtmlStats() {
    MageNameHtml.innerHTML = mage1.name;
    MageHpHtml.innerHTML = "HP: " + String(mage1.hp) + " / " + String(mage1.maxhp);
    MageManaHtml.innerHTML = "Mana: " + String(mage1.mana) + " / " + String(mage1.maxmana);
    WarriorNameHtml.innerHTML = warrior1.name;
    WarriorHpHtml.innerHTML = "HP: " + String(warrior1.hp) + " / " + String(warrior1.maxhp);
    BardNameHtml.innerHTML = bard1.name;
    BardHpHtml.innerHTML = "HP: " + String(bard1.hp) + " / " + String(bard1.maxhp);
    const enemy1ImgHtml = document.getElementById("Enemy1Img");
    const enemy2ImgHtml = document.getElementById("Enemy2Img");
    const enemy3ImgHtml = document.getElementById("Enemy3Img");
    if (mage1.dead) {
        MageNameHtml.innerHTML += " (Dead)";
    }
    if (warrior1.dead) {
        WarriorNameHtml.innerHTML += " (Dead)";
    }
    if (bard1.dead) {
        BardNameHtml.innerHTML += " (Dead)";
    }
    if (enemies[0] != null) {
        enemy1NameHtml.innerHTML = enemies[0].name;
        enemy1HpHtml.innerHTML = "HP: " + String(enemies[0].hp) + " / " + String(enemies[0].maxhp);
        enemy1ImgHtml.src = String("img/EnemySprites/" + enemies[0].name + ".jpg");
    }
    else {
        enemy1NameHtml.innerHTML = "";
        enemy1HpHtml.innerHTML = "";
        enemy1ImgHtml.src = "";
    }
    if (enemies[1] != null) {
        enemy2NameHtml.innerHTML = enemies[1].name;
        enemy2HpHtml.innerHTML = "HP: " + String(enemies[1].hp) + " / " + String(enemies[1].maxhp);
        enemy2ImgHtml.src = String("img/EnemySprites/" + enemies[1].name + ".jpg");
    }
    else {
        enemy2NameHtml.innerHTML = "";
        enemy2HpHtml.innerHTML = "";
        enemy2ImgHtml.src = "";
    }
    if (enemies[2] != null) {
        enemy3NameHtml.innerHTML = enemies[2].name;
        enemy3HpHtml.innerHTML = "HP: " + String(enemies[2].hp) + " / " + String(enemies[2].maxhp);
        enemy3ImgHtml.src = String("img/EnemySprites/" + enemies[2].name + ".jpg");
    }
    else {
        enemy3NameHtml.innerHTML = "";
        enemy3HpHtml.innerHTML = "";
        enemy3ImgHtml.src = "";
    }
}
//pause funkce kterou jsem si půjčil z internetu
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function newturn() {
    await sleep(1000);
    turncounter += 1;
    //pokud jsou všichni nepřátelé mrtví, přivolej další vlnu
    if (enemiesDeadChecker()) {
        wave++;
        //pokud začíná nová vlna a hrdina ja mrtvý, oživ ho
        for (var hero of heroes) {
            if (hero.dead) {
                hero.heal(20);
                hero.dead = false;
            }
        }
        if (wave == 2) {
            enemies = wave2;
        }
        if (wave == 3) {
            enemies = wave3;
        }
        if (wave == 4) {
            enemy1NameHtml.innerHTML = "you win!!";
        }
    }
    console.log(enemies);
    console.log(heroes);
    updateHtmlStats();
}
//mazání tlačítek na vybrání akce
function actCancelBtnPressed() {
    const areas = [mageActionDiv, warriorActionDiv, bardActionDiv, actionDiv];
    for (let area of areas) {
        if (!area) {
            continue;
        }
        Array.from(area.children).forEach(child => child.remove());
    }
}
//mazání tlačítek na vybrání cíle
function selectCancelBtnPressed() {
    const areas = [mageTargetDiv, warriorTargetDiv, bardTargetDiv, targetDiv];
    for (let area of areas) {
        if (!area) {
            continue;
        }
        Array.from(area.children).forEach(child => child.remove());
    }
}
//mazání tlačítek na výběr hrdiny
function charCancelBtnPressed() {
    const children = Array.from(characterDiv.children);
    for (let object of children) {
        object.remove();
    }
}
function thingymabobRemove() {
    const children = Array.from(characterDiv.children);
    for (let object of children) {
        object.remove();
    }
}
//funkce pro zmáčknutí tlaćítka "Konec Tahu"
function TurnFinishpressed() {
    if (bardAct !== null) {
        if (bardTarg != null) {
            bardAct(bardTarg);
        }
    }
    bardAct = null;
    if (mageAct !== null && mageTarg !== null && heroes !== null) {
        mageAct(mageTarg);
    }
    mageAct = null;
    if (warriorAct !== null && warriorTarg !== null && heroes !== null) {
        warriorAct(warriorTarg);
    }
    warriorAct = null;
    charCancelBtnPressed();
    actCancelBtnPressed();
    selectCancelBtnPressed();
    const something = document.getElementById("TurnFinish");
    if (something != null) {
        something.remove;
    }
    for (let enemy of enemies) {
        if (enemy != null) {
            enemy.Attack();
        }
    }
    const thingymabob = document.getElementById("Thingymabob");
    const endTurnBtn = document.createElement("button");
    endTurnBtn.innerHTML = "Finish Turn";
    endTurnBtn.onclick = () => TurnFinishpressed();
    endTurnBtn.id = "TurnFinish";
    thingymabob?.appendChild(endTurnBtn);
    newturn();
}
//všechny funkce níže jsou jen k vytváření tlačítek a ukládání dat do [Hrdina]Act a [Hrdina]Targ
function MageBtnPressed() {
    actCancelBtnPressed();
    selectCancelBtnPressed();
    if (!mageActionDiv) {
        return;
    }
    if (mage1.mana >= 30) {
        const fireball = document.createElement("button");
        fireball.innerHTML = "Fireball";
        fireball.id = "fireballBtn";
        fireball.onclick = fireballBtnPressed;
        mageActionDiv.appendChild(fireball);
    }
    if (mage1.mana >= 20) {
        const lightningStrike = document.createElement("button");
        lightningStrike.innerHTML = "Lightning Strike";
        lightningStrike.id = "lightningStrikeBtn";
        lightningStrike.onclick = lightningStrikeBtnPressed;
        mageActionDiv.appendChild(lightningStrike);
    }
    const rechargeMana = document.createElement("button");
    rechargeMana.innerHTML = "Recharge Mana";
    rechargeMana.id = "rechargeManaBtn";
    rechargeMana.onclick = rechargeManaBtnPressed;
    mageActionDiv.appendChild(rechargeMana);
    const cancel = document.createElement("button");
    cancel.innerHTML = "Cancel";
    cancel.id = "cancelBtn";
    cancel.onclick = () => {
        actCancelBtnPressed();
        selectCancelBtnPressed();
    };
    mageActionDiv.appendChild(cancel);
}
function rechargeManaBtnPressed() {
    mageAct = () => mage1.rechargeMana();
    actCancelBtnPressed();
    selectCancelBtnPressed();
}
function fireballBtnPressed() {
    selectCancelBtnPressed();
    if (!mageTargetDiv) {
        return;
    }
    for (let slot in enemies) {
        if (enemies[slot] == null) {
        }
        else {
            const enemySelect = document.createElement("button");
            enemySelect.innerHTML = enemies[slot].name;
            enemySelect.id = "EnemyPos" + String(enemies[slot].pos);
            mageTargetDiv.appendChild(enemySelect);
            enemySelect.addEventListener("click", (event) => {
                var selectedEnemyPos = Number(enemySelect.id[enemySelect.id.length - 1]);
                mageAct = (enemy) => mage1.fireball(enemy);
                mageTarg = enemies[selectedEnemyPos - 1];
                actCancelBtnPressed();
                selectCancelBtnPressed();
            });
        }
    }
    const cancelBtn = document.createElement("button");
    cancelBtn.innerHTML = "Cancel";
    cancelBtn.onclick = selectCancelBtnPressed;
    mageTargetDiv.appendChild(cancelBtn);
}
function lightningStrikeBtnPressed() {
    selectCancelBtnPressed();
    if (!mageTargetDiv) {
        return;
    }
    for (let slot in enemies) {
        if (enemies[slot] == null) {
        }
        else {
            const enemySelect = document.createElement("button");
            enemySelect.innerHTML = enemies[slot].name;
            enemySelect.id = "EnemyPos" + String(enemies[slot].pos);
            mageTargetDiv.appendChild(enemySelect);
            enemySelect.addEventListener("click", (event) => {
                var selectedEnemyPos = Number(enemySelect.id[enemySelect.id.length - 1]);
                mageAct = (enemy) => mage1.lightningStrike(enemy);
                mageTarg = enemies[selectedEnemyPos - 1];
                actCancelBtnPressed();
                selectCancelBtnPressed();
            });
        }
    }
    const cancelBtn = document.createElement("button");
    cancelBtn.innerHTML = "Cancel";
    cancelBtn.onclick = selectCancelBtnPressed;
    mageTargetDiv.appendChild(cancelBtn);
}
function WarriorBtnPressed() {
    actCancelBtnPressed();
    selectCancelBtnPressed();
    if (!warriorActionDiv) {
        return;
    }
    const swordslash = document.createElement("button");
    swordslash.innerHTML = "Sword Slash";
    swordslash.id = "swordSlashbtn";
    swordslash.onclick = swordSlashBtnPressed;
    warriorActionDiv.appendChild(swordslash);
    const mightyRoar = document.createElement("button");
    mightyRoar.innerHTML = "Warrior's roar";
    mightyRoar.id = "mightyRoarbtn";
    mightyRoar.onclick = mightyRoarBtnPressed;
    warriorActionDiv.appendChild(mightyRoar);
    const cancel = document.createElement("button");
    cancel.innerHTML = "Cancel";
    cancel.id = "cancelBtn";
    cancel.onclick = () => {
        actCancelBtnPressed();
        selectCancelBtnPressed();
    };
    warriorActionDiv.appendChild(cancel);
}
function swordSlashBtnPressed() {
    selectCancelBtnPressed();
    if (!warriorTargetDiv) {
        return;
    }
    for (let slot in enemies) {
        if (enemies[slot] == null) {
        }
        else {
            const enemySelect = document.createElement("button");
            enemySelect.innerHTML = enemies[slot].name;
            enemySelect.id = "EnemyPos" + String(enemies[slot].pos);
            warriorTargetDiv.appendChild(enemySelect);
            enemySelect.addEventListener("click", (event) => {
                var selectedEnemyPos = Number(enemySelect.id[enemySelect.id.length - 1]);
                warriorAct = (enemy) => warrior1.swordslash(enemy);
                warriorTarg = enemies[selectedEnemyPos - 1];
                actCancelBtnPressed();
                selectCancelBtnPressed();
            });
        }
    }
    const cancelBtn = document.createElement("button");
    cancelBtn.innerHTML = "Cancel";
    cancelBtn.onclick = selectCancelBtnPressed;
    warriorTargetDiv.appendChild(cancelBtn);
}
function mightyRoarBtnPressed() {
    selectCancelBtnPressed();
    actCancelBtnPressed();
    warriorAct = () => warrior1.mightyRoar();
}
function BardBtnPressed() {
    actCancelBtnPressed();
    selectCancelBtnPressed();
    if (!bardActionDiv) {
        return;
    }
    const healingMelody = document.createElement("button");
    healingMelody.innerHTML = "Healing Melody";
    healingMelody.id = "healingMelodybtn";
    healingMelody.onclick = healingMelodyBtnPressed;
    bardActionDiv.appendChild(healingMelody);
    const cancel = document.createElement("button");
    cancel.innerHTML = "Cancel";
    cancel.id = "cancelBtn";
    cancel.onclick = () => {
        actCancelBtnPressed();
        selectCancelBtnPressed();
    };
    bardActionDiv.appendChild(cancel);
}
function healingMelodyBtnPressed() {
    selectCancelBtnPressed();
    bardAct = (heroes) => bard1.healingMelody(heroes);
    bardTarg = heroes;
    actCancelBtnPressed();
}
