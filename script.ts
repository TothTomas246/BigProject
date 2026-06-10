const techDiv = document.getElementById("technical") as HTMLDivElement
const characterDiv = document.getElementById("characters") as HTMLDivElement; 
const actionDiv = document.getElementById("actions") as HTMLDivElement; 
const targetDiv = document.getElementById("targets") as HTMLDivElement;
const StartBtn = document.getElementById("startBtn") as HTMLButtonElement;
var thingymabobDiv:HTMLElement
var descriptionBox: HTMLDivElement | null = null

var mage1:mage 
var warrior1:warrior 
var bard1:bard 
heroes = []

function setDescription(text: string) {
    if (!descriptionBox) { return }
    descriptionBox.textContent = text
}

function attachDescription(button: HTMLButtonElement, description: string) {
    button.addEventListener("mouseenter", () => setDescription(description))
    button.addEventListener("mouseleave", () => setDescription("Hover an action for details"))
}

//deklarace všech statistik v HTML
var MageNameHtml: HTMLDivElement
var MageHpHtml: HTMLDivElement
var MageManaHtml: HTMLDivElement
var WarriorNameHtml: HTMLDivElement
var WarriorHpHtml: HTMLDivElement
var BardNameHtml: HTMLDivElement
var BardHpHtml: HTMLDivElement
var enemy1NameHtml: HTMLDivElement
var enemy1HpHtml: HTMLDivElement
var enemy2NameHtml: HTMLDivElement
var enemy2HpHtml: HTMLDivElement
var enemy3NameHtml: HTMLDivElement
var enemy3HpHtml: HTMLDivElement

var mageActionDiv: HTMLDivElement | null = null
var mageTargetDiv: HTMLDivElement | null = null
var warriorActionDiv: HTMLDivElement | null = null
var warriorTargetDiv: HTMLDivElement | null = null
var bardActionDiv: HTMLDivElement | null = null
var bardTargetDiv: HTMLDivElement | null = null

//interní vypsání nepřátelů na každou vlnu (w1s1 = wave 1 slot 1)
var w1s1 = new goomba(1)
var w1s2 = new goomba(2)
var w1s3 = new goomba(3)
var wave1 = [w1s1, w1s2, w1s3]

var w2s1 = new goomba(1)
var w2s2 = new koopa(2)
var w2s3 = new goomba(3)
var wave2 = [w2s1, w2s2, w2s3] 

var w3s1 = new koopa(1)
var w3s2 = new koopa(2)
var w3s3 = new koopa(3)
var wave3 = [w3s1, w3s2, w3s3]

//variable pro útoky hrdinů
var mageAct: ((enemy: enemy) => void) | null | ((hero: enemy) => hero) | (() => void) = null
var warriorAct: ((enemy: enemy) => void) | null | ((hero: hero) => void) | (() => void) = null
var bardAct: ((heroes: hero[]) => void) | null | ((ememies: enemy[]) => void) & (() => void) = null

//variable pro cílenou skupinu | nepřítele
var mageTarg: enemy | null | hero = null
var warriorTarg:  enemy | null | hero = null
var bardTarg:  null |enemy[]|hero[] = null

//variable pro kolo a vlnu
var turncounter:number = 1
var wave:number = 1

function nameInputSequence() {

    const ContinueBtn = document.createElement("Button")
    ContinueBtn.innerHTML = "Confirm"
    ContinueBtn.id = "continueBtn"
    ContinueBtn.onclick = start
    techDiv.appendChild(ContinueBtn)

    const mageName = document.createElement("input")
    mageName.id = "mageNameInp"
    const mageLabel = document.createElement("label")
    mageLabel.innerHTML = "Input the name of the mage: "
    mageLabel.htmlFor = "MageNameInp"
    mageLabel.id="mageNameLab"
    characterDiv.appendChild(mageLabel)
    characterDiv.appendChild(mageName)

    const warriorName = document.createElement("input")
    warriorName.id = "warriorNameInp"
    const warriorLabel = document.createElement("label")
    warriorLabel.innerHTML = "Input the name of the warrior: "
    warriorLabel.htmlFor = "warriorNameInp"
    warriorLabel.id="warriorNameLab"
    actionDiv.appendChild(warriorLabel)
    actionDiv.appendChild(warriorName)

    const bardName = document.createElement("input")
    bardName.id = "bardNameInp"
    const bardLabel = document.createElement("label")
    bardLabel.innerHTML = "Input the name of the bard: "
    bardLabel.htmlFor = "bardNameInp"
    bardLabel.id="bardNameLab"
    targetDiv.appendChild(bardLabel)
    targetDiv.appendChild(bardName)

    document.body.classList.add("name-select")
    StartBtn.remove()
}

function start() {
    enemies = wave1

    document.getElementById("continueBtn")?.remove()

    const mageInp = document.getElementById("mageNameInp") as HTMLInputElement
    const warriorInp = document.getElementById("warriorNameInp") as HTMLInputElement
    const bardInp = document.getElementById("bardNameInp") as HTMLInputElement

    if (String(mageInp.value) == "" || String(warriorInp.value) == "" || String(bardInp.value) =="") {
        console.warn("C'mon man... give them all a name")
        return
    }

    document.body.classList.remove("name-select")

    mage1 = new mage(80, 60, String(mageInp.value), 100, 0, 1)
    warrior1 = new warrior(100, 50, String(warriorInp.value), 25, 2)
    bard1 = new bard(70, 20, String(bardInp.value), 0, 3)
    heroes=[mage1, warrior1, bard1]

    charCancelBtnPressed()
    actCancelBtnPressed()
    selectCancelBtnPressed()

    // CREATE STATS ELEMENTS INSTEAD OF USING innerHTML +=
    const statsDiv = document.createElement("div")
    statsDiv.id = "Stats"

    const characterStats = document.createElement("div")
    characterStats.id = "characterStats"

    const mageStats = document.createElement("div")
    mageStats.className = "characterStats"
    mageStats.id = "MageStats"
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
    `
    characterStats.appendChild(mageStats)

    const warriorStats = document.createElement("div")
    warriorStats.className = "characterStats"
    warriorStats.id = "WarriorStats"
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
    `
    characterStats.appendChild(warriorStats)

    const bardStats = document.createElement("div")
    bardStats.className = "characterStats"
    bardStats.id = "BardStats"
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
    `
    characterStats.appendChild(bardStats)

    statsDiv.appendChild(characterStats)

    const enemyStats = document.createElement("div")
    enemyStats.className = "characterStats"
    enemyStats.id = "enemyStats"

    const enemy1Stats = document.createElement("div")
    enemy1Stats.className = "characterStats"
    enemy1Stats.id = "enemy1Stats"
    enemy1Stats.innerHTML = `
        <img id="Enemy1Img" width="100" height="100">
        <div class="statBox">
            <div id="enemy1Name"></div>
            <div id="enemy1HP"></div>
        </div>
    `
    enemyStats.appendChild(enemy1Stats)

    const enemy2Stats = document.createElement("div")
    enemy2Stats.className = "characterStats"
    enemy2Stats.id = "enemy2Stats"
    enemy2Stats.innerHTML = `
        <img id="Enemy2Img" width="100" height="100">
        <div class="statBox">
            <div id="enemy2Name"></div>
            <div id="enemy2HP"></div>
        </div>
    `
    enemyStats.appendChild(enemy2Stats)

    const enemy3Stats = document.createElement("div")
    enemy3Stats.className = "characterStats"
    enemy3Stats.id = "enemy3Stats"
    enemy3Stats.innerHTML = `
        <img id="Enemy3Img" width="100" height="100">
        <div class="statBox">
            <div id="enemy3Name"></div>
            <div id="enemy3HP"></div>
        </div>
    `
    enemyStats.appendChild(enemy3Stats)

    statsDiv.appendChild(enemyStats)
    characterDiv.appendChild(statsDiv)

    mageActionDiv = document.getElementById("MageActionArea") as HTMLDivElement
    mageTargetDiv = document.getElementById("MageTargetArea") as HTMLDivElement
    warriorActionDiv = document.getElementById("WarriorActionArea") as HTMLDivElement
    warriorTargetDiv = document.getElementById("WarriorTargetArea") as HTMLDivElement
    bardActionDiv = document.getElementById("BardActionArea") as HTMLDivElement
    bardTargetDiv = document.getElementById("BardTargetArea") as HTMLDivElement

    hideActionBoxes()
    hideTargetBoxes()

    const mageImg = document.getElementById("MageImg") as HTMLImageElement
    const warriorImg = document.getElementById("WarriorImg") as HTMLImageElement
    const bardImg = document.getElementById("BardImg") as HTMLImageElement
    mageImg.addEventListener("click", MageBtnPressed)
    warriorImg.addEventListener("click", WarriorBtnPressed)
    bardImg.addEventListener("click", BardBtnPressed)

    MageNameHtml = document.getElementById("MageName") as HTMLDivElement
    MageHpHtml = document.getElementById("MageHp") as HTMLDivElement
    MageManaHtml = document.getElementById("MageMana") as HTMLDivElement
    WarriorNameHtml = document.getElementById("WarriorName") as HTMLDivElement
    WarriorHpHtml = document.getElementById("WarriorHp") as HTMLDivElement
    BardNameHtml = document.getElementById("BardName") as HTMLDivElement
    BardHpHtml = document.getElementById("BardHp") as HTMLDivElement
    enemy1NameHtml = document.getElementById("enemy1Name") as HTMLDivElement
    enemy1HpHtml = document.getElementById("enemy1HP") as HTMLDivElement
    enemy2NameHtml = document.getElementById("enemy2Name") as HTMLDivElement
    enemy2HpHtml = document.getElementById("enemy2HP") as HTMLDivElement
    enemy3NameHtml = document.getElementById("enemy3Name") as HTMLDivElement
    enemy3HpHtml = document.getElementById("enemy3HP") as HTMLDivElement

    const thingymabob = document.createElement("div")
    document.body.appendChild(thingymabob)
    thingymabob.id="Thingymabob"

    const endTurnBtn = document.createElement("button") as HTMLButtonElement
    endTurnBtn.innerHTML = "Finish Turn"
    endTurnBtn.onclick = () => TurnFinishpressed()
    endTurnBtn.id = "TurnFinish"
    thingymabob.appendChild(endTurnBtn)

    descriptionBox = document.createElement("div") as HTMLDivElement
    descriptionBox.id = "ActionDescription"
    descriptionBox.className = "descriptionBox"
    descriptionBox.textContent = "Hover an action for details"
    thingymabob.appendChild(descriptionBox)

    updateHtmlStats()
    console.log(enemies);
    console.log(heroes);
}

//funkce která kontroluje jestli jsou všichni nepřátelé mrtví
function enemiesDeadChecker():boolean {
    var deadcounter = 0 
    for (var i=0; i<3; i++) {
        if (enemies[i] == null) {deadcounter++}
    }
    if (deadcounter == 3) {return true} else {return false}
}

function updateHtmlStats() {
    MageNameHtml.innerHTML = mage1.name
    MageHpHtml.innerHTML = "HP: "+String(mage1.hp)+" / "+String(mage1.maxhp)
    MageManaHtml.innerHTML = "Mana: "+String(mage1.mana)+" / "+String(mage1.maxmana)
    WarriorNameHtml.innerHTML = warrior1.name
    WarriorHpHtml.innerHTML = "HP: "+String(warrior1.hp)+" / "+String(warrior1.maxhp)
    BardNameHtml.innerHTML = bard1.name
    BardHpHtml.innerHTML = "HP: "+String(bard1.hp)+" / "+String(bard1.maxhp)

    const enemy1ImgHtml = document.getElementById("Enemy1Img") as HTMLImageElement
    const enemy2ImgHtml = document.getElementById("Enemy2Img") as HTMLImageElement
    const enemy3ImgHtml = document.getElementById("Enemy3Img") as HTMLImageElement

    if (mage1.dead) {MageNameHtml.innerHTML+=" (Dead)"}
    if (warrior1.dead) {WarriorNameHtml.innerHTML+=" (Dead)"}
    if (bard1.dead) {BardNameHtml.innerHTML+=" (Dead)"}

    if (enemies[0]!=null) {enemy1NameHtml.innerHTML=enemies[0].name; enemy1HpHtml.innerHTML="HP: "+String(enemies[0].hp)+" / "+String(enemies[0].maxhp);enemy1ImgHtml.src = String("img/EnemySprites/"+enemies[0].name+".jpg")} else {enemy1NameHtml.innerHTML=""; enemy1HpHtml.innerHTML=""; enemy1ImgHtml.src=""}
    if (enemies[1]!=null) {enemy2NameHtml.innerHTML=enemies[1].name; enemy2HpHtml.innerHTML="HP: "+String(enemies[1].hp)+" / "+String(enemies[1].maxhp);enemy2ImgHtml.src = String("img/EnemySprites/"+enemies[1].name+".jpg")} else {enemy2NameHtml.innerHTML=""; enemy2HpHtml.innerHTML=""; enemy2ImgHtml.src=""}
    if (enemies[2]!=null) {enemy3NameHtml.innerHTML=enemies[2].name; enemy3HpHtml.innerHTML="HP: "+String(enemies[2].hp)+" / "+String(enemies[2].maxhp);enemy3ImgHtml.src = String("img/EnemySprites/"+enemies[2].name+".jpg")} else {enemy3NameHtml.innerHTML=""; enemy3HpHtml.innerHTML=""; enemy3ImgHtml.src=""}
}

//pause funkce kterou jsem si půjčil z internetu
function sleep(ms: number): Promise<void> {
return new Promise(resolve => setTimeout(resolve, ms));
}
async function newturn() {
        await sleep(1000);
        turncounter+=1

        //pokud jsou všichni nepřátelé mrtví, přivolej další vlnu
        if (enemiesDeadChecker()) {
            wave++
            //pokud začíná nová vlna a hrdina ja mrtvý, oživ ho
            for (var hero of heroes) {
                if (hero.dead) {
                    hero.heal(20)
                    hero.dead = false
                }
            }
            if (wave==2) {enemies = wave2}
            if (wave==3) {enemies = wave3}
            if (wave==4) {enemy1NameHtml.innerHTML="you win!!"}
        }

        console.log(enemies)
        console.log(heroes)

        updateHtmlStats()
}


//mazání tlačítek na vybrání akce
function hideActionBoxes() {
    const areas = [mageActionDiv, warriorActionDiv, bardActionDiv]
    for (let area of areas) {
        if (!area) { continue }
        const wrapper = area.closest(".actionTargetBox") as HTMLDivElement | null
        wrapper?.classList.add("hidden")
    }
}

function hideTargetBoxes() {
    const areas = [mageTargetDiv, warriorTargetDiv, bardTargetDiv]
    for (let area of areas) {
        if (!area) { continue }
        const wrapper = area.closest(".actionTargetBox") as HTMLDivElement | null
        wrapper?.classList.add("hidden")
    }
}

function showActionBox(area: HTMLDivElement | null) {
    hideActionBoxes()
    hideTargetBoxes()
    if (!area) { return }
    const wrapper = area.closest(".actionTargetBox") as HTMLDivElement | null
    wrapper?.classList.remove("hidden")
}

function showTargetBox(area: HTMLDivElement | null) {
    hideTargetBoxes()
    if (!area) { return }
    const wrapper = area.closest(".actionTargetBox") as HTMLDivElement | null
    wrapper?.classList.remove("hidden")
}

function actCancelBtnPressed() {
    const areas = [mageActionDiv, warriorActionDiv, bardActionDiv, actionDiv]
    for (let area of areas) {
        if (!area) { continue }
        Array.from(area.children).forEach(child => child.remove())
        const wrapper = area.closest(".actionTargetBox") as HTMLDivElement | null
        wrapper?.classList.add("hidden")
    }
}

//mazání tlačítek na vybrání cíle
function selectCancelBtnPressed() {
    const areas = [mageTargetDiv, warriorTargetDiv, bardTargetDiv, targetDiv]
    for (let area of areas) {
        if (!area) { continue }
        Array.from(area.children).forEach(child => child.remove())
        const wrapper = area.closest(".actionTargetBox") as HTMLDivElement | null
        wrapper?.classList.add("hidden")
    }
}

//mazání tlačítek na výběr hrdiny
function charCancelBtnPressed() {
    const children = Array.from(characterDiv.children)
    for (let object of children) {
        object.remove()
    }
}

function thingymabobRemove() {
    const children = Array.from(characterDiv.children)
    for (let object of children) {
        object.remove()
    }
}

//funkce pro zmáčknutí tlaćítka "Konec Tahu"
function TurnFinishpressed() {
    if (bardAct !== null) { if (bardTarg != null) {bardAct(bardTarg);} } bardAct = null;
    if (mageAct !== null && mageTarg !== null && heroes !== null) { mageAct(mageTarg); } mageAct = null;
    if (warriorAct !== null && warriorTarg !== null && heroes !== null) { warriorAct(warriorTarg);} warriorAct = null;
    charCancelBtnPressed()
    actCancelBtnPressed()
    selectCancelBtnPressed()
    const something = document.getElementById("TurnFinish")
    if (something!=null) {something.remove}
    for (let enemy of enemies) {
        if (enemy != null) {
            enemy.Attack()
        }
    }
    const thingymabob = document.getElementById("Thingymabob")

    const endTurnBtn = document.createElement("button") as HTMLButtonElement
        endTurnBtn.innerHTML = "Finish Turn"
        endTurnBtn.onclick = () => TurnFinishpressed()
        endTurnBtn.id = "TurnFinish"
        thingymabob?.appendChild(endTurnBtn)

    newturn()
}

//všechny funkce níže jsou jen k vytváření tlačítek a ukládání dat do [Hrdina]Act a [Hrdina]Targ
function MageBtnPressed() {
    actCancelBtnPressed()
    selectCancelBtnPressed()
    showActionBox(mageActionDiv)
    if (!mageActionDiv) { return }

    if (mage1.mana>=30) {
        const fireball = document.createElement("button") as HTMLButtonElement
        fireball.innerHTML = "Fireball"
        fireball.id = "fireballBtn"
        fireball.onclick = fireballBtnPressed
        attachDescription(fireball, descriptions.fireball)
        mageActionDiv.appendChild(fireball)
    }

    if (mage1.mana>=20) {
        const lightningStrike = document.createElement("button") as HTMLButtonElement
        lightningStrike.innerHTML = "Lightning Strike"
        lightningStrike.id = "lightningStrikeBtn"
        lightningStrike.onclick = lightningStrikeBtnPressed
        attachDescription(lightningStrike, descriptions.lightningStrike)
        mageActionDiv.appendChild(lightningStrike)
    }

    const rechargeMana = document.createElement("button") as HTMLButtonElement
    rechargeMana.innerHTML = "Recharge Mana"
    rechargeMana.id = "rechargeManaBtn"
    rechargeMana.onclick = rechargeManaBtnPressed
    attachDescription(rechargeMana, descriptions.rechargeMana)
    mageActionDiv.appendChild(rechargeMana)

    const cancel = document.createElement("button") as HTMLButtonElement
    cancel.innerHTML = "Cancel"
    cancel.id = "cancelBtn"
    cancel.onclick = () => {
        actCancelBtnPressed();
        selectCancelBtnPressed();
    }
    mageActionDiv.appendChild(cancel)
}

function rechargeManaBtnPressed() {
    mageAct = () => mage1.rechargeMana()
    actCancelBtnPressed()
    selectCancelBtnPressed()
}

function fireballBtnPressed() {
    selectCancelBtnPressed()
    if (!mageTargetDiv) { return }
    showTargetBox(mageTargetDiv)
    for (let slot in enemies) {
        if (enemies[slot]==null) {
        } else {
            const enemySelect = document.createElement("button") as HTMLButtonElement
            enemySelect.innerHTML = enemies[slot].name
            enemySelect.id = "EnemyPos"+String(enemies[slot].pos)
            mageTargetDiv.appendChild(enemySelect)
            enemySelect.addEventListener("click", (event: Event) => {
                var selectedEnemyPos = Number(enemySelect.id[enemySelect.id.length - 1])
                mageAct = (enemy: enemy) => mage1.fireball(enemy)
                mageTarg = enemies[selectedEnemyPos-1]
                actCancelBtnPressed()
                selectCancelBtnPressed()
            })
        }
    }
    const cancelBtn = document.createElement("button") as HTMLButtonElement
    cancelBtn.innerHTML = "Cancel"
    cancelBtn.onclick = selectCancelBtnPressed
    mageTargetDiv.appendChild(cancelBtn)
}

function lightningStrikeBtnPressed() {
    selectCancelBtnPressed()
    if (!mageTargetDiv) { return }
    showTargetBox(mageTargetDiv)
    for (let slot in enemies) {
        if (enemies[slot]==null) {
        } else {
            const enemySelect = document.createElement("button") as HTMLButtonElement
            enemySelect.innerHTML = enemies[slot].name
            enemySelect.id = "EnemyPos"+String(enemies[slot].pos)
            mageTargetDiv.appendChild(enemySelect)
            enemySelect.addEventListener("click", (event: Event) => {
                var selectedEnemyPos = Number(enemySelect.id[enemySelect.id.length - 1])
                mageAct = (enemy: enemy) => mage1.lightningStrike(enemy)
                mageTarg = enemies[selectedEnemyPos-1]
                actCancelBtnPressed()
                selectCancelBtnPressed()
            })
        }
    }
    const cancelBtn = document.createElement("button") as HTMLButtonElement
    cancelBtn.innerHTML = "Cancel"
    cancelBtn.onclick = selectCancelBtnPressed
    mageTargetDiv.appendChild(cancelBtn)
}

function WarriorBtnPressed() {
    actCancelBtnPressed()
    selectCancelBtnPressed()
    showActionBox(warriorActionDiv)
    if (!warriorActionDiv) { return }

    const swordslash = document.createElement("button") as HTMLButtonElement
    swordslash.innerHTML = "Sword Slash"
    swordslash.id = "swordSlashbtn"
    swordslash.onclick = swordSlashBtnPressed
    attachDescription(swordslash, descriptions.swordSlash)
    warriorActionDiv.appendChild(swordslash)

    const mightyRoar = document.createElement("button") as HTMLButtonElement
    mightyRoar.innerHTML = "Warrior's roar"
    mightyRoar.id = "mightyRoarbtn"
    mightyRoar.onclick = mightyRoarBtnPressed
    attachDescription(mightyRoar, descriptions.mightyRoar)
    warriorActionDiv.appendChild(mightyRoar)

    const cancel = document.createElement("button") as HTMLButtonElement
    cancel.innerHTML = "Cancel"
    cancel.id = "cancelBtn"
    cancel.onclick = () => {
        actCancelBtnPressed();
        selectCancelBtnPressed();
    }
    warriorActionDiv.appendChild(cancel)
}

function swordSlashBtnPressed() {
    selectCancelBtnPressed()
    hideActionBoxes()
    showTargetBox(warriorTargetDiv)
    if (!warriorTargetDiv) { return }
    for (let slot in enemies) {
        if (enemies[slot]==null) {
        } else {
            const enemySelect = document.createElement("button") as HTMLButtonElement
            enemySelect.innerHTML = enemies[slot].name
            enemySelect.id = "EnemyPos"+String(enemies[slot].pos)
            warriorTargetDiv.appendChild(enemySelect)
            enemySelect.addEventListener("click", (event: Event) => {
                var selectedEnemyPos = Number(enemySelect.id[enemySelect.id.length - 1])
                warriorAct = (enemy: enemy) => warrior1.swordslash(enemy)
                warriorTarg = enemies[selectedEnemyPos-1]
                actCancelBtnPressed()
                selectCancelBtnPressed()
            })
        }
    }

    const cancelBtn = document.createElement("button") as HTMLButtonElement
    cancelBtn.innerHTML = "Cancel"
    cancelBtn.onclick = selectCancelBtnPressed
    warriorTargetDiv.appendChild(cancelBtn)
} 

function mightyRoarBtnPressed() {
    selectCancelBtnPressed()
    actCancelBtnPressed()
    warriorAct = () => warrior1.mightyRoar()
}

function BardBtnPressed() {
    actCancelBtnPressed()
    selectCancelBtnPressed()
    showActionBox(bardActionDiv)
    if (!bardActionDiv) { return }

    const healingMelody = document.createElement("button") as HTMLButtonElement
    healingMelody.innerHTML = "Healing Melody"
    healingMelody.id = "healingMelodybtn"
    healingMelody.onclick = healingMelodyBtnPressed
    attachDescription(healingMelody, descriptions.healingMelody)
    bardActionDiv.appendChild(healingMelody)

    const cancel = document.createElement("button") as HTMLButtonElement
    cancel.innerHTML = "Cancel"
    cancel.id = "cancelBtn"
    cancel.onclick = () => {
        actCancelBtnPressed();
        selectCancelBtnPressed();
    }
    bardActionDiv.appendChild(cancel)
}

function healingMelodyBtnPressed() {
    selectCancelBtnPressed()
    bardAct = (heroes: hero[]) => bard1.healingMelody(heroes)
    bardTarg = heroes
    actCancelBtnPressed()
}