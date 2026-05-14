const characterDiv = document.getElementById("characters") as HTMLDivElement; 
const actionDiv = document.getElementById("actions") as HTMLDivElement; 
const targetDiv = document.getElementById("targets") as HTMLDivElement;

const mage1 = new mage(80, 60, "Maxmilián", 100, 0)
const warrior1 = new warrior(100, 50, "Miroslav Nekvinda", 25)
const bard1 = new bard(70, 20, "Dariviel", 0)
var heroes:hero[]= [mage1, warrior1, bard1]

var slot1: any = new goomba(100, 30, 1)
var slot2: any = new goomba(100, 30, 2)
var slot3: any = new goomba(100, 30, 3)
var enemies:enemy[]=[slot1, slot2, slot3]

var mageAct: ((enemy: enemy) => void) | null | ((hero: enemy) => hero) | (() => void) = null
var warriorAct: ((enemy: enemy) => void) | null | ((hero: hero) => void) | (() => void) = null
var bardAct: ((heroes: hero[]) => void) | null | ((ememies: enemy[]) => void) | (() => void) = null

var mageTarg: enemy | null | hero = null
var warriorTarg:  enemy | null | hero = null
var bardTarg:  enemy | null | hero = null

var turncounter:number = 1
var wave:number = 1

//pause funkce kterou jsem si půjčil z internetu
function sleep(ms: number): Promise<void> {
return new Promise(resolve => setTimeout(resolve, ms));
}
async function newturn() {
        await sleep(1000);
        turncounter+=1

        console.log(enemies)
        console.log(heroes)

        if (mage1 != null) {
        const mageBtn = document.createElement("button") as HTMLButtonElement
        mageBtn.innerHTML = "Mage"
        mageBtn.onclick = MageBtnPressed
        mageBtn.id = "MageActBtn"
        characterDiv.appendChild(mageBtn)
        }

        if (warrior1 != null) {
        const warriorBtn = document.createElement("button") as HTMLButtonElement
        warriorBtn.innerHTML = "Warrior"
        warriorBtn.onclick = WarriorBtnPressed
        warriorBtn.id = "MageActBtn"
        characterDiv.appendChild(warriorBtn)
        }

        if (bard1 != null) {
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
}
function actCancelBtnPressed() {
    const children = Array.from(actionDiv.children);
    for (let object of children) {
        object.remove();
    }
}

function selectCancelBtnPressed() {
    const children = Array.from(targetDiv.children);
    for (let object of children) {
        object.remove();
    }
}


function TurnFinishpressed() {
    if (bardAct !== null) { bardAct(heroes); } bardAct = null;
    if (mageAct !== null && mageTarg !== null) { mageAct(mageTarg); } mageAct = null;
    if (warriorAct !== null && warriorTarg !== null) { warriorAct(warriorTarg);} warriorAct = null;
    const children = Array.from(characterDiv.children)
    for (let object of children) {
        object.remove()
    }
    actCancelBtnPressed()
    selectCancelBtnPressed()
    for (let enemy of enemies) {
        if (enemy != null) {
            enemy.Attack()
        }
    }

    newturn()
}

function MageBtnPressed() {
    actCancelBtnPressed()
    selectCancelBtnPressed()

    if (mage1.mana>=30) {
        const fireball = document.createElement("button") as HTMLButtonElement
        fireball.innerHTML = "fireball"
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

    const cancel = document.createElement("button") as HTMLButtonElement
    cancel.innerHTML = "Cancel"
    cancel.id = "cancelBtn"
    cancel.onclick = actCancelBtnPressed, selectCancelBtnPressed
    actionDiv.appendChild(cancel)
    
}

function fireballBtnPressed() {
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
    cancel.onclick = actCancelBtnPressed, selectCancelBtnPressed
    actionDiv.appendChild(cancel)
}

function swordSlashBtnPressed() {
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
    warriorAct = () => warrior1.mightyRoar()
    warriorTarg = new enemy
    actCancelBtnPressed()
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
    cancel.onclick = actCancelBtnPressed, selectCancelBtnPressed
    actionDiv.appendChild(cancel)
}

function healingMelodyBtnPressed() {
    bardAct = (heroes: hero[]) => bard1.healingMelody(heroes)
    actCancelBtnPressed()
}
console.log(enemies);
console.log(heroes);