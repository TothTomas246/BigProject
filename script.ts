const techDiv = document.getElementById("technical") as HTMLDivElement
const characterDiv = document.getElementById("characters") as HTMLDivElement; 
const actionDiv = document.getElementById("actions") as HTMLDivElement; 
const targetDiv = document.getElementById("targets") as HTMLDivElement;
const StartBtn = document.getElementById("startBtn") as HTMLButtonElement;

var mage1:mage 
var warrior1:warrior 
var bard1:bard 
heroes = []

//deklarace všech statistik v HTML
var MageNameHtml
var MageHpHtml
var MageManaHtml
var WarriorNameHtml
var WarriorHpHtml
var BardNameHtml
var BardHpHtml
var enemy1NameHtml
var enemy1HpHtml
var enemy2NameHtml
var enemy2HpHtml
var enemy3NameHtml
var enemy3HpHtml

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

    StartBtn.remove()
}

function start() {
    enemies = wave1

    const mageInp = document.getElementById("mageNameInp") as HTMLInputElement
    const warriorInp = document.getElementById("warriorNameInp") as HTMLInputElement
    const bardInp = document.getElementById("bardNameInp") as HTMLInputElement

    if (String(mageInp.value) == "" || String(warriorInp.value) == "" || String(bardInp.value) =="") {
        console.warn("C'mon man... give them all a name")
        return
    }

    const thing = document.getElementById("continueBtn") as HTMLButtonElement
    thing.remove()

    mage1 = new mage(80, 60, String(mageInp.value), 100, 0, 1)
    warrior1 = new warrior(100, 50, String(warriorInp.value), 25, 2)
    bard1 = new bard(70, 20, String(bardInp.value), 0, 3)
    heroes=[mage1, warrior1, bard1]

    charCancelBtnPressed()
    actCancelBtnPressed()
    selectCancelBtnPressed()

    const mageBtn = document.createElement("button") as HTMLButtonElement
    mageBtn.innerHTML = "Mage"
    mageBtn.onclick = () => MageBtnPressed()
    mageBtn.id = "MageActBtn"
    characterDiv.appendChild(mageBtn)
        
    const warriorBtn = document.createElement("button") as HTMLButtonElement
    warriorBtn.innerHTML = "Warrior"
    warriorBtn.onclick = () => WarriorBtnPressed()
    warriorBtn.id = "WarriorActBtn"
    characterDiv.appendChild(warriorBtn)

    const bardBtn = document.createElement("button") as HTMLButtonElement
    bardBtn.innerHTML = "Bard"
    bardBtn.onclick = () => BardBtnPressed()
    bardBtn.id = "BardActBtn"
    characterDiv.appendChild(bardBtn)

    const endTurnBtn = document.createElement("button") as HTMLButtonElement
    endTurnBtn.innerHTML = "Finish Turn"
    endTurnBtn.onclick = () => TurnFinishpressed()
    endTurnBtn.id = "TurnFinish"
    characterDiv.appendChild(endTurnBtn)

    // CREATE STATS ELEMENTS INSTEAD OF USING innerHTML +=
    const statsDiv = document.createElement("div")
    statsDiv.id = "Stats"

    const characterStats = document.createElement("div")
    characterStats.id = "characterStats"

    const mageStats = document.createElement("div")
    mageStats.className = "characterStats"
    mageStats.id = "MageStats"
    mageStats.innerHTML = `
        <div id="MageName"></div>
        <div id="MageHp"></div>
        <div id="MageMana"></div>
    `
    characterStats.appendChild(mageStats)

    const warriorStats = document.createElement("div")
    warriorStats.className = "characterStats"
    warriorStats.id = "WarriorStats"
    warriorStats.innerHTML = `
        <div id="WarriorName"></div>
        <div id="WarriorHp"></div>
    `
    characterStats.appendChild(warriorStats)

    const bardStats = document.createElement("div")
    bardStats.className = "characterStats"
    bardStats.id = "BardStats"
    bardStats.innerHTML = `
        <div id="BardName"></div>
        <div id="BardHp"></div>
    `
    characterStats.appendChild(bardStats)

    statsDiv.appendChild(characterStats)

    const enemyStats = document.createElement("div")
    enemyStats.className = "characterStats"
    enemyStats.id = "enemyStats"

    const enemy1Stats = document.createElement("div")
    enemy1Stats.id = "enemy1Stats"
    enemy1Stats.innerHTML = `
        <div id="enemy1Name"></div>
        <div id="enemy1HP"></div>
    `
    enemyStats.appendChild(enemy1Stats)

    const enemy2Stats = document.createElement("div")
    enemy2Stats.className = "characterStats"
    enemy2Stats.id = "enemy2Stats"
    enemy2Stats.innerHTML = `
        <div id="enemy2Name"></div>
        <div id="enemy2HP"></div>
    `
    enemyStats.appendChild(enemy2Stats)

    const enemy3Stats = document.createElement("div")
    enemy3Stats.className = "characterStats"
    enemy3Stats.id = "enemy3Stats"
    enemy3Stats.innerHTML = `
        <div id="enemy3Name"></div>
        <div id="enemy3HP"></div>
    `
    enemyStats.appendChild(enemy3Stats)

    statsDiv.appendChild(enemyStats)
    document.body.appendChild(statsDiv)

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

    if (mage1.dead) {MageNameHtml.innerHTML+=" (Dead)"}
    if (warrior1.dead) {WarriorNameHtml.innerHTML+=" (Dead)"}
    if (bard1.dead) {BardNameHtml.innerHTML+=" (Dead)"}

    if (enemies[0]!=null) {enemy1NameHtml.innerHTML=enemies[0].name; enemy1HpHtml.innerHTML="HP: "+String(enemies[0].hp)+" / "+String(enemies[0].maxhp)} else {enemy1NameHtml.innerHTML=""; enemy1HpHtml.innerHTML=""}
    if (enemies[1]!=null) {enemy2NameHtml.innerHTML=enemies[1].name; enemy2HpHtml.innerHTML="HP: "+String(enemies[1].hp)+" / "+String(enemies[1].maxhp)} else {enemy2NameHtml.innerHTML=""; enemy2HpHtml.innerHTML=""}
    if (enemies[2]!=null) {enemy3NameHtml.innerHTML=enemies[2].name; enemy3HpHtml.innerHTML="HP: "+String(enemies[2].hp)+" / "+String(enemies[2].maxhp)} else {enemy3NameHtml.innerHTML=""; enemy3HpHtml.innerHTML=""}
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

        if (mage1 != null && !mage1.dead) {
        const mageBtn = document.createElement("button") as HTMLButtonElement
        mageBtn.innerHTML = "Mage"
        mageBtn.onclick = MageBtnPressed
        mageBtn.id = "MageActBtn"
        characterDiv.appendChild(mageBtn)
        }

        if (warrior1 != null && !warrior1.dead) {
        const warriorBtn = document.createElement("button") as HTMLButtonElement
        warriorBtn.innerHTML = "Warrior"
        warriorBtn.onclick = WarriorBtnPressed
        warriorBtn.id = "MageActBtn"
        characterDiv.appendChild(warriorBtn)
        }

        if (bard1 != null && !bard1.dead) {
        const bardBtn = document.createElement("button") as HTMLButtonElement
        bardBtn.innerHTML = "Bard"
        bardBtn.onclick = BardBtnPressed
        bardBtn.id = "BardActBtn"
        characterDiv.appendChild(bardBtn)
        }

        const endTurnBtn = document.createElement("button") as HTMLButtonElement
        endTurnBtn.innerHTML = "Finish Turn"
        endTurnBtn.onclick = TurnFinishpressed
        endTurnBtn.id = "TurnFinish"
        characterDiv.appendChild(endTurnBtn)
        
        updateHtmlStats()
}

//mazání tlačítek na vybrání akce
function actCancelBtnPressed() {
    const children = Array.from(actionDiv.children);
    for (let object of children) {
        object.remove();
    }
}

//mazání tlačítek na vybrání cíle
function selectCancelBtnPressed() {
    const children = Array.from(targetDiv.children);
    for (let object of children) {
        object.remove();
    }
}

//mazání tlačítek na výběr hrdiny
function charCancelBtnPressed() {
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
    for (let enemy of enemies) {
        if (enemy != null) {
            enemy.Attack()
        }
    }

    newturn()
}

//všechny funkce níže jsou jen k vytváření tlačítek a ukládání dat do [Hrdina]Act a [Hrdina]Targ
function MageBtnPressed() {
    actCancelBtnPressed()
    selectCancelBtnPressed()

    if (mage1.mana>=30) {
        const fireball = document.createElement("button") as HTMLButtonElement
        fireball.innerHTML = "Fireball"
        fireball.id = "fireballBtn"
        fireball.onclick = fireballBtnPressed
        actionDiv.appendChild(fireball)
    }

    if (mage1.mana>=20) {
        const lightningStrike = document.createElement("button") as HTMLButtonElement
        lightningStrike.innerHTML = "Lightning Strike"
        lightningStrike.id = "lightningStrikeBtn"
        lightningStrike.onclick = lightningStrikeBtnPressed
        actionDiv.appendChild(lightningStrike)
    }

    const rechargeMana = document.createElement("button") as HTMLButtonElement
        rechargeMana.innerHTML = "Recharge Mana"
        rechargeMana.id = "rechargeManaBtn"
        rechargeMana.onclick = rechargeManaBtnPressed
        actionDiv.appendChild(rechargeMana)

    const cancel = document.createElement("button") as HTMLButtonElement
    cancel.innerHTML = "Cancel"
    cancel.id = "cancelBtn"
    cancel.onclick = () => {
        actCancelBtnPressed();
        selectCancelBtnPressed();
    }
    actionDiv.appendChild(cancel)
    
}

function rechargeManaBtnPressed() {
    mageAct = () => mage1.rechargeMana()
    actCancelBtnPressed()
    selectCancelBtnPressed()
}

function fireballBtnPressed() {
    selectCancelBtnPressed()
    for (let slot in enemies) {
        if (enemies[slot]==null) {
        } else {
            const enemySelect = document.createElement("button") as HTMLButtonElement
            enemySelect.innerHTML = enemies[slot].name
            enemySelect.id = "EnemyPos"+String(enemies[slot].pos)
            targetDiv.appendChild(enemySelect)
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
        targetDiv.appendChild(cancelBtn)
}

function lightningStrikeBtnPressed() {
    selectCancelBtnPressed()
    for (let slot in enemies) {
        if (enemies[slot]==null) {
        } else {
            const enemySelect = document.createElement("button") as HTMLButtonElement
            enemySelect.innerHTML = enemies[slot].name
            enemySelect.id = "EnemyPos"+String(enemies[slot].pos)
            targetDiv.appendChild(enemySelect)
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
        targetDiv.appendChild(cancelBtn)
}

function WarriorBtnPressed() {
    actCancelBtnPressed()
    selectCancelBtnPressed()

    const swordslash = document.createElement("button") as HTMLButtonElement
    swordslash.innerHTML = "Sword Slash"
    swordslash.id = "swordSlashbtn"
    swordslash.onclick = swordSlashBtnPressed
    actionDiv.appendChild(swordslash)

    const mightyRoar = document.createElement("button") as HTMLButtonElement
    mightyRoar.innerHTML = "Warrior's roar"
    mightyRoar.id = "mightyRoarbtn"
    mightyRoar.onclick = mightyRoarBtnPressed
    actionDiv.appendChild(mightyRoar)

    const cancel = document.createElement("button") as HTMLButtonElement
    cancel.innerHTML = "Cancel"
    cancel.id = "cancelBtn"
    cancel.onclick = () => {
        actCancelBtnPressed();
        selectCancelBtnPressed();
    }
    actionDiv.appendChild(cancel)
}

function swordSlashBtnPressed() {
    selectCancelBtnPressed()
    for (let slot in enemies) {
        if (enemies[slot]==null) {
        } else {
            const enemySelect = document.createElement("button") as HTMLButtonElement
            enemySelect.innerHTML = enemies[slot].name
            enemySelect.id = "EnemyPos"+String(enemies[slot].pos)
            targetDiv.appendChild(enemySelect)
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
    targetDiv.appendChild(cancelBtn)
} 

function mightyRoarBtnPressed() {
    selectCancelBtnPressed()
    actCancelBtnPressed()
    warriorAct = () => warrior1.mightyRoar()
}

function BardBtnPressed() {
    actCancelBtnPressed()
    selectCancelBtnPressed()

    const healingMelody = document.createElement("button") as HTMLButtonElement
    healingMelody.innerHTML = "Healing Melody"
    healingMelody.id = "healingMelodybtn"
    healingMelody.onclick = healingMelodyBtnPressed
    actionDiv.appendChild(healingMelody)

    const cancel = document.createElement("button") as HTMLButtonElement
    cancel.innerHTML = "Cancel"
    cancel.id = "cancelBtn"
    cancel.onclick = () => {
        actCancelBtnPressed();
        selectCancelBtnPressed();
    }
    actionDiv.appendChild(cancel)
}

function healingMelodyBtnPressed() {
    selectCancelBtnPressed()
    bardAct = (heroes: hero[]) => bard1.healingMelody(heroes)
    bardTarg = heroes
    actCancelBtnPressed()
}