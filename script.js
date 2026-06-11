"use strict";
const techDiv = document.getElementById("technical");
const characterDiv = document.getElementById("characters");
const actionDiv = document.getElementById("actions");
const targetDiv = document.getElementById("targets");
const StartBtn = document.getElementById("startBtn");
var thingymabobDiv;
var descriptionBox = null;
var finishTurnBtn = null;
var mage1;
var warrior1;
var bard1;
heroes = [];
function setDescription(text) {
    if (!descriptionBox) {
        return;
    }
    descriptionBox.textContent = text;
}
function attachDescription(button, description) {
    button.addEventListener("mouseenter", () => setDescription(description));
    button.addEventListener("mouseleave", () => setDescription("Hover an action or enemy for details"));
}
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
var w1s1 = new baby(1);
var w1s2 = new springer(2);
var w1s3 = new baby(3);
var wave1 = [w1s1, w1s2, w1s3];
var w2s1 = new springer(1);
var w2s2 = new springer(2);
var w2s3 = new springer(3);
var wave2 = [w2s1, w2s2, w2s3];
var w3s1 = new springer(1);
var w3s2 = new springer(2);
var w3s3 = new springer(3);
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
    document.body.classList.add("name-select");
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
    document.getElementById("continueBtn")?.remove();
    document.body.classList.remove("name-select");
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
        <div class="statBox">
            <div id="MageName"></div>
            <div id="MageHp"></div>
            <div id="MageMana"></div>
        </div>
        <div class="actionTargetBox">
            <div id="MageActionArea" class="heroActionArea"></div>
        </div>
        <div class="actionTargetBox hidden">
            <div id="MageTargetArea" class="heroTargetArea"></div>
        </div>
    `;
    characterStats.appendChild(mageStats);
    const warriorStats = document.createElement("div");
    warriorStats.className = "characterStats";
    warriorStats.id = "WarriorStats";
    warriorStats.innerHTML = `
        <img src="img/WarriorPlaceholder.png" id="WarriorImg" class="heroImage" width="100px">
        <div class="statBox">
            <div id="WarriorName"></div>
            <div id="WarriorHp"></div>
        </div>
        <div class="actionTargetBox">
            <div id="WarriorActionArea" class="heroActionArea"></div>
        </div>
        <div class="actionTargetBox hidden">
            <div id="WarriorTargetArea" class="heroTargetArea"></div>
        </div>
    `;
    characterStats.appendChild(warriorStats);
    const bardStats = document.createElement("div");
    bardStats.className = "characterStats";
    bardStats.id = "BardStats";
    bardStats.innerHTML = `
        <img src="img/BardPlaceholder.png" id="BardImg" class="heroImage" width="100px">
        <div class="statBox">
            <div id="BardName"></div>
            <div id="BardHp"></div>
        </div>
        <div class="actionTargetBox">
            <div id="BardActionArea" class="heroActionArea"></div>
        </div>
        <div class="actionTargetBox hidden">
            <div id="BardTargetArea" class="heroTargetArea"></div>
        </div>
    `;
    characterStats.appendChild(bardStats);
    statsDiv.appendChild(characterStats);
    const enemyStats = document.createElement("div");
    enemyStats.className = "characterStats";
    enemyStats.id = "enemyStats";
    const enemy1Stats = document.createElement("div");
    enemy1Stats.className = "characterStats";
    enemy1Stats.id = "enemy1Stats";
    enemy1Stats.innerHTML = `
        <img id="Enemy1Img" width="100" height="100">
        <div class="statBox">
            <div id="enemy1Name"></div>
            <div id="enemy1HP"></div>
        </div>
    `;
    enemyStats.appendChild(enemy1Stats);
    const enemy2Stats = document.createElement("div");
    enemy2Stats.className = "characterStats";
    enemy2Stats.id = "enemy2Stats";
    enemy2Stats.innerHTML = `
        <img id="Enemy2Img" width="100" height="100">
        <div class="statBox">
            <div id="enemy2Name"></div>
            <div id="enemy2HP"></div>
        </div>
    `;
    enemyStats.appendChild(enemy2Stats);
    const enemy3Stats = document.createElement("div");
    enemy3Stats.className = "characterStats";
    enemy3Stats.id = "enemy3Stats";
    enemy3Stats.innerHTML = `
        <img id="Enemy3Img" width="100" height="100">
        <div class="statBox">
            <div id="enemy3Name"></div>
            <div id="enemy3HP"></div>
        </div>
    `;
    enemyStats.appendChild(enemy3Stats);
    statsDiv.appendChild(enemyStats);
    characterDiv.appendChild(statsDiv);
    mageActionDiv = document.getElementById("MageActionArea");
    mageTargetDiv = document.getElementById("MageTargetArea");
    warriorActionDiv = document.getElementById("WarriorActionArea");
    warriorTargetDiv = document.getElementById("WarriorTargetArea");
    bardActionDiv = document.getElementById("BardActionArea");
    bardTargetDiv = document.getElementById("BardTargetArea");
    hideActionBoxes();
    hideTargetBoxes();
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
    descriptionBox = document.createElement("div");
    descriptionBox.id = "ActionDescription";
    descriptionBox.className = "descriptionBox";
    descriptionBox.textContent = "Hover an action for details";
    thingymabob.appendChild(descriptionBox);
    const endTurnBtn = document.createElement("button");
    endTurnBtn.innerHTML = "Finish Turn";
    endTurnBtn.onclick = () => TurnFinishpressed();
    endTurnBtn.id = "TurnFinish";
    finishTurnBtn = endTurnBtn;
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
    const enemy1Card = document.getElementById("enemy1Stats");
    const enemy2Card = document.getElementById("enemy2Stats");
    const enemy3Card = document.getElementById("enemy3Stats");
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
        // show enemy description on hover
        const e0desc = (enemies[0].name.toLowerCase() === "goomba") ? descriptions.goomba : (enemies[0].name.toLowerCase() === "koopa") ? descriptions.koopa : (enemies[0].name.toLowerCase() === "baby") ? descriptions.baby : (enemies[0].name.toLowerCase() === "springer") ? descriptions.springer : "";
        enemy1ImgHtml.onmouseenter = () => setDescription(e0desc);
        enemy1ImgHtml.onmouseleave = () => setDescription("Hover an action or enemy for details");
        if (enemy1Card) {
            enemy1Card.style.visibility = "visible";
            enemy1Card.style.opacity = "1";
        }
    }
    else {
        enemy1NameHtml.innerHTML = "";
        enemy1HpHtml.innerHTML = "";
        enemy1ImgHtml.src = "";
        if (enemy1Card) {
            enemy1Card.style.visibility = "hidden";
            enemy1Card.style.opacity = "0";
        }
    }
    if (enemies[1] != null) {
        enemy2NameHtml.innerHTML = enemies[1].name;
        enemy2HpHtml.innerHTML = "HP: " + String(enemies[1].hp) + " / " + String(enemies[1].maxhp);
        enemy2ImgHtml.src = String("img/EnemySprites/" + enemies[1].name + ".jpg");
        // show enemy description on hover
        const e1desc = (enemies[1].name.toLowerCase() === "goomba") ? descriptions.goomba : (enemies[1].name.toLowerCase() === "koopa") ? descriptions.koopa : (enemies[1].name.toLowerCase() === "baby") ? descriptions.baby : (enemies[1].name.toLowerCase() === "springer") ? descriptions.springer : "";
        enemy2ImgHtml.onmouseenter = () => setDescription(e1desc);
        enemy2ImgHtml.onmouseleave = () => setDescription("Hover an action or enemy for details");
        if (enemy2Card) {
            enemy2Card.style.visibility = "visible";
            enemy2Card.style.opacity = "1";
        }
    }
    else {
        enemy2NameHtml.innerHTML = "";
        enemy2HpHtml.innerHTML = "";
        enemy2ImgHtml.src = "";
        if (enemy2Card) {
            enemy2Card.style.visibility = "hidden";
            enemy2Card.style.opacity = "0";
        }
    }
    if (enemies[2] != null) {
        enemy3NameHtml.innerHTML = enemies[2].name;
        enemy3HpHtml.innerHTML = "HP: " + String(enemies[2].hp) + " / " + String(enemies[2].maxhp);
        enemy3ImgHtml.src = String("img/EnemySprites/" + enemies[2].name + ".jpg");
        // show enemy description on hover
        const e2desc = (enemies[2].name.toLowerCase() === "goomba") ? descriptions.goomba : (enemies[2].name.toLowerCase() === "koopa") ? descriptions.koopa : (enemies[2].name.toLowerCase() === "baby") ? descriptions.baby : (enemies[2].name.toLowerCase() === "springer") ? descriptions.springer : "";
        enemy3ImgHtml.onmouseenter = () => setDescription(e2desc);
        enemy3ImgHtml.onmouseleave = () => setDescription("Hover an action or enemy for details");
        if (enemy3Card) {
            enemy3Card.style.visibility = "visible";
            enemy3Card.style.opacity = "1";
        }
    }
    else {
        enemy3NameHtml.innerHTML = "";
        enemy3HpHtml.innerHTML = "";
        enemy3ImgHtml.src = "";
        if (enemy3Card) {
            enemy3Card.style.visibility = "hidden";
            enemy3Card.style.opacity = "0";
        }
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
        else if (wave == 3) {
            enemies = wave3;
        }
        else if (wave == 4) {
            // all waves cleared -> show victory screen and stop further turns
            enemies = [null, null, null];
            showVictoryScreen();
            return;
        }
    }
    console.log(enemies);
    console.log(heroes);
    updateHtmlStats();
}
//mazání tlačítek na vybrání akce
function hideActionBoxes() {
    const areas = [mageActionDiv, warriorActionDiv, bardActionDiv];
    for (let area of areas) {
        if (!area) {
            continue;
        }
        const wrapper = area.closest(".actionTargetBox");
        wrapper?.classList.add("hidden");
    }
}
function hideTargetBoxes() {
    const areas = [mageTargetDiv, warriorTargetDiv, bardTargetDiv];
    for (let area of areas) {
        if (!area) {
            continue;
        }
        const wrapper = area.closest(".actionTargetBox");
        wrapper?.classList.add("hidden");
    }
}
function showActionBox(area) {
    hideActionBoxes();
    hideTargetBoxes();
    if (!area) {
        return;
    }
    const wrapper = area.closest(".actionTargetBox");
    wrapper?.classList.remove("hidden");
}
function showTargetBox(area) {
    hideTargetBoxes();
    if (!area) {
        return;
    }
    const wrapper = area.closest(".actionTargetBox");
    wrapper?.classList.remove("hidden");
}
function actCancelBtnPressed() {
    const areas = [mageActionDiv, warriorActionDiv, bardActionDiv, actionDiv];
    for (let area of areas) {
        if (!area) {
            continue;
        }
        Array.from(area.children).forEach(child => child.remove());
        const wrapper = area.closest(".actionTargetBox");
        wrapper?.classList.add("hidden");
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
        const wrapper = area.closest(".actionTargetBox");
        wrapper?.classList.add("hidden");
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
// show a simple victory overlay and stop the game
function showVictoryScreen() {
    if (finishTurnBtn) {
        finishTurnBtn.style.display = "none";
    }
    // hide main game UI so only the victory overlay is visible
    try {
        techDiv.style.display = "none";
    }
    catch (e) { }
    try {
        characterDiv.style.display = "none";
    }
    catch (e) { }
    try {
        actionDiv.style.display = "none";
    }
    catch (e) { }
    try {
        targetDiv.style.display = "none";
    }
    catch (e) { }
    const thing = document.getElementById("Thingymabob");
    if (thing) {
        thing.style.display = "none";
    }
    // avoid duplicating overlay
    if (document.getElementById("VictoryScreen")) {
        return;
    }
    const overlay = document.createElement("div");
    overlay.id = "VictoryScreen";
    overlay.className = "victory-screen";
    overlay.innerHTML = `
        <div class="victory-content">
            <h1>Victory!</h1>
            <p>You defeated all waves.</p>
            <button id="playAgainBtn">Play Again</button>
        </div>
    `;
    document.body.appendChild(overlay);
    const playAgain = document.getElementById("playAgainBtn");
    if (playAgain) {
        playAgain.onclick = () => location.reload();
    }
}
function showLoseScreen() {
    if (finishTurnBtn) {
        finishTurnBtn.style.display = "none";
    }
    // hide main game UI so only the victory overlay is visible
    try {
        techDiv.style.display = "none";
    }
    catch (e) { }
    try {
        characterDiv.style.display = "none";
    }
    catch (e) { }
    try {
        actionDiv.style.display = "none";
    }
    catch (e) { }
    try {
        targetDiv.style.display = "none";
    }
    catch (e) { }
    const thing = document.getElementById("Thingymabob");
    if (thing) {
        thing.style.display = "none";
    }
    // avoid duplicating overlay
    if (document.getElementById("VictoryScreen")) {
        return;
    }
    const overlay = document.createElement("div");
    overlay.id = "VictoryScreen";
    overlay.className = "victory-screen";
    overlay.innerHTML = `
        <div class="victory-content">
            <h1>Loss!</h1>
            <p>You DIED!!.</p>
            <button id="playAgainBtn">Play Again</button>
        </div>
    `;
    document.body.appendChild(overlay);
    const playAgain = document.getElementById("playAgainBtn");
    if (playAgain) {
        playAgain.onclick = () => location.reload();
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
    actCancelBtnPressed();
    selectCancelBtnPressed();
    if (finishTurnBtn) {
        finishTurnBtn.style.display = "none";
    }
    for (let enemy of enemies) {
        if (enemy != null) {
            enemy.Attack();
        }
    }
    setTimeout(() => {
        if (finishTurnBtn) {
            finishTurnBtn.style.display = "inline-flex";
        }
    }, 1000);
    if (mage1.dead && warrior1.dead && bard1.dead) {
        showLoseScreen();
        return;
    }
    newturn();
}
//všechny funkce níže jsou jen k vytváření tlačítek a ukládání dat do [Hrdina]Act a [Hrdina]Targ
function MageBtnPressed() {
    if (mage1.dead) {
        return;
    }
    actCancelBtnPressed();
    selectCancelBtnPressed();
    showActionBox(mageActionDiv);
    if (!mageActionDiv) {
        return;
    }
    if (mage1.mana >= 30) {
        const fireball = document.createElement("button");
        fireball.innerHTML = "Fireball";
        fireball.id = "fireballBtn";
        fireball.onclick = fireballBtnPressed;
        attachDescription(fireball, descriptions.fireball);
        mageActionDiv.appendChild(fireball);
    }
    if (mage1.mana >= 20) {
        const lightningStrike = document.createElement("button");
        lightningStrike.innerHTML = "Lightning Strike";
        lightningStrike.id = "lightningStrikeBtn";
        lightningStrike.onclick = lightningStrikeBtnPressed;
        attachDescription(lightningStrike, descriptions.lightningStrike);
        mageActionDiv.appendChild(lightningStrike);
    }
    const rechargeMana = document.createElement("button");
    rechargeMana.innerHTML = "Recharge Mana";
    rechargeMana.id = "rechargeManaBtn";
    rechargeMana.onclick = rechargeManaBtnPressed;
    attachDescription(rechargeMana, descriptions.rechargeMana);
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
    showTargetBox(mageTargetDiv);
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
    showTargetBox(mageTargetDiv);
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
    if (warrior1.dead) {
        return;
    }
    actCancelBtnPressed();
    selectCancelBtnPressed();
    showActionBox(warriorActionDiv);
    if (!warriorActionDiv) {
        return;
    }
    const swordslash = document.createElement("button");
    swordslash.innerHTML = "Sword Slash";
    swordslash.id = "swordSlashbtn";
    swordslash.onclick = swordSlashBtnPressed;
    attachDescription(swordslash, descriptions.swordSlash);
    warriorActionDiv.appendChild(swordslash);
    const mightyRoar = document.createElement("button");
    mightyRoar.innerHTML = "Warrior's roar";
    mightyRoar.id = "mightyRoarbtn";
    mightyRoar.onclick = mightyRoarBtnPressed;
    attachDescription(mightyRoar, descriptions.mightyRoar);
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
    hideActionBoxes();
    showTargetBox(warriorTargetDiv);
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
    if (bard1.dead) {
        return;
    }
    actCancelBtnPressed();
    selectCancelBtnPressed();
    showActionBox(bardActionDiv);
    if (!bardActionDiv) {
        return;
    }
    const healingMelody = document.createElement("button");
    healingMelody.innerHTML = "Healing Melody";
    healingMelody.id = "healingMelodybtn";
    healingMelody.onclick = healingMelodyBtnPressed;
    attachDescription(healingMelody, descriptions.healingMelody);
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
