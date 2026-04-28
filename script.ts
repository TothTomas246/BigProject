abstract class hero {
    private hp:number = -1
    private maxhp:number = -1
    atk:number = -1
    private name:string = ""
    shield:number = -1

    constructor(hp:number, atk:number, shield:number, name:string){
        this.maxhp = hp
        this.hp = hp
        this.name = name
        this.atk = atk
        this.shield = shield
    }

    heal(healamount:number):void {
        this.hp += healamount
        if (this.hp > this.maxhp) {this.hp = this.maxhp}
    }
}

abstract class enemy {
    maxhp:number = -1
    hp:number = -1
    atk:number = -1
    pos:number = -1

    constructor(hp:number, atk:number, pos:number) {
        this.hp = hp
        this.maxhp = hp
        this.atk = atk
        this.pos = pos
    }
}

class mage extends hero {
    private mana:number = -1
    private maxmana:number = -1
    constructor(hp:number, atk:number, name:string, mana:number, shield:number){
        super(hp, atk, shield, name)
        this.mana = mana
        this.maxmana = mana
    }

    fireball(enemy:enemy) {
        enemy.hp -= 20
        this.mana -= 20
        if (enemy.hp<=0) {
            var posi = enemy.pos
            enemies[posi-1] = null
        }
    }
}

class warrior extends hero {
    constructor(hp:number, atk:number, name:string, shield:number){
        super(hp, atk, shield, name)
    }

    basicatk(enemy:enemy) {
        //ještě nemám vymyšleno
    }
}

class bard extends hero {
    constructor(hp:number, atk:number, name:string, shield:number){
        super(hp, atk, shield, name)
    }

    melodyofcourage() {
        //ještě nemám vymyšleno
    }
}

class goomba extends enemy {
    constructor(hp:number, atk:number, pos:number) {
        super(hp, atk, pos)
    }
}

const mageBtn = document.getElementById("MageActBtn") as HTMLButtonElement

const actionDiv = document.getElementById("actions") as HTMLDivElement; 
const targetDiv = document.getElementById("targets") as HTMLDivElement;

const mage1 = new mage(50, 40, "Maxmilián", 100, 0)
const warrior1 = new warrior(100, 50, "Miroslav Nekvinda", 25)
const bard1 = new bard(70, 20, "Dariviel", 0)

var slot1: any = new goomba(100, 30, 1)
var slot2: any = new goomba(100, 30, 2)
var slot3: any = new goomba(100, 30, 3)
var enemies=[slot1, slot2, slot3]
console.log(actionDiv.children)
function MageBtnPressed() {

    if (actionDiv.children.length > 0) {
        actCancelBtnPressed()
    }

    const fireball = document.createElement("button") as HTMLButtonElement
    fireball.innerHTML = "fireball"
    fireball.id = "fireballBtn"
    fireball.onclick = fireballBtnPressed
    actionDiv.appendChild(fireball)

    const cancel = document.createElement("button") as HTMLButtonElement
    cancel.innerHTML = "Cancel"
    cancel.id = "cancelBtn"
    cancel.onclick = actCancelBtnPressed
    actionDiv.appendChild(cancel)
    
}

function fireballBtnPressed() {
    console.log("boom")
}

function actCancelBtnPressed() {
    const children = Array.from(actionDiv.children);
    for (let object of children) {
        object.remove();
    }
}

console.log(mage1)
console.log(warrior1)
console.log(bard1)

console.log(enemies[0])
console.log(enemies[1])
console.log(enemies[2])