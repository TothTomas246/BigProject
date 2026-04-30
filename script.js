"use strict";
class hero {
    hp = -1;
    maxhp = -1;
    atk = -1;
    name = "";
    shield = -1;
    constructor(hp, atk, shield, name) {
        this.maxhp = hp;
        this.hp = hp;
        this.name = name;
        this.atk = atk;
        this.shield = shield;
    }
    heal(healamount) {
        this.hp += healamount;
        if (this.hp > this.maxhp) {
            this.hp = this.maxhp;
        }
    }
}
class enemy {
    maxhp = -1;
    hp = -1;
    atk = -1;
    pos = -1;
    name = "";
    constructor(hp, atk, pos) {
        this.hp = hp;
        this.maxhp = hp;
        this.atk = atk;
        this.pos = pos;
    }
}
class mage extends hero {
    mana = -1;
    maxmana = -1;
    constructor(hp, atk, name, mana, shield) {
        super(hp, atk, shield, name);
        this.mana = mana;
        this.maxmana = mana;
    }
    fireball(enemy) {
        console.log(enemy);
        enemy.hp -= this.atk;
        this.mana -= 20;
        if (enemy.hp <= 0) {
            var posi = enemy.pos;
            enemies[posi - 1] = null;
        }
    }
}
class warrior extends hero {
    constructor(hp, atk, name, shield) {
        super(hp, atk, shield, name);
    }
    basicatk(enemy) {
        //ještě nemám vymyšleno
    }
}
class bard extends hero {
    constructor(hp, atk, name, shield) {
        super(hp, atk, shield, name);
    }
    melodyofcourage() {
        //ještě nemám vymyšleno
    }
}
class goomba extends enemy {
    constructor(hp, atk, pos) {
        super(hp, atk, pos);
        this.name = "Goomba";
    }
}
const mageBtn = document.getElementById("MageActBtn");
const actionDiv = document.getElementById("actions");
const targetDiv = document.getElementById("targets");
const mage1 = new mage(50, 40, "Maxmilián", 100, 0);
const warrior1 = new warrior(100, 50, "Miroslav Nekvinda", 25);
const bard1 = new bard(70, 20, "Dariviel", 0);
var slot1 = new goomba(100, 30, 1);
var slot2 = new goomba(100, 30, 2);
var slot3 = new goomba(100, 30, 3);
var enemies = [slot1, slot2, slot3];
var mageAct = null;
var warriorAct = null;
var bardAct = null;
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
function MageBtnPressed() {
    if (actionDiv.children.length > 0) {
        actCancelBtnPressed();
    }
    const fireball = document.createElement("button");
    fireball.innerHTML = "fireball";
    fireball.id = "fireballBtn";
    fireball.onclick = fireballBtnPressed;
    actionDiv.appendChild(fireball);
    const cancel = document.createElement("button");
    cancel.innerHTML = "Cancel";
    cancel.id = "cancelBtn";
    cancel.onclick = actCancelBtnPressed;
    actionDiv.appendChild(cancel);
}
function fireballBtnPressed() {
    for (let slot in enemies) {
        console.log(slot);
        console.log(enemies[slot]);
        if (enemies[slot] == null) {
        }
        else {
            const enemySelect = document.createElement("button");
            enemySelect.innerHTML = enemies[slot].name;
            enemySelect.id = "EnemyPos" + String(enemies[slot].pos);
            targetDiv.appendChild(enemySelect);
            enemySelect.addEventListener("click", (event) => {
                var selectedEnemyPos = Number(enemySelect.id[enemySelect.id.length - 1]);
                console.log(selectedEnemyPos);
                mageAct = (enemy) => mage1.fireball(enemy);
                mageAct(enemies[selectedEnemyPos - 1]);
            });
        }
    }
    const cancelBtn = document.createElement("button");
    cancelBtn.innerHTML = "Cancel";
    cancelBtn.onclick = selectCancelBtnPressed;
    targetDiv.appendChild(cancelBtn);
}
function WarriorBtnpressed() {
    if (actionDiv.children.length > 0) {
        actCancelBtnPressed();
    }
    const fireball = document.createElement("button");
    fireball.innerHTML = "fireball";
    fireball.id = "fireballBtn";
    fireball.onclick = fireballBtnPressed;
    actionDiv.appendChild(fireball);
    const cancel = document.createElement("button");
    cancel.innerHTML = "Cancel";
    cancel.id = "cancelBtn";
    cancel.onclick = actCancelBtnPressed;
    actionDiv.appendChild(cancel);
}
function TurnFinishpressed() {
    if (bardAct !== null) {
        bardAct;
    }
    bardAct = null;
    if (mageAct !== null) {
        mageAct;
    }
    mageAct = null;
    if (warriorAct !== null) {
        warriorAct;
    }
    warriorAct = null;
    console.log(enemies);
}
console.log(enemies);
