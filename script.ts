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

    constructor(hp:number, atk:number) {
        this.hp = hp
        this.maxhp = hp
        this.atk = atk
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
        //ještě nemám vymyšleno
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
    constructor(hp:number, atk:number) {
        super(hp, atk)
    }
}

const mage1 = new mage(50, 40, "Maxmilián", 100, 0)
const warrior1 = new warrior(100, 50, "Henry", 25)
const bard1 = new bard(70, 20, "Dariviel", 0)

const goomba1 = new goomba(100, 30)

console.log(mage1)
console.log(warrior1)
console.log(bard1)
console.log(goomba1)