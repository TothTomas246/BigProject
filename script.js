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
    constructor(hp, atk) {
        this.hp = hp;
        this.maxhp = hp;
        this.atk = atk;
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
        //ještě nemám vymyšleno
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
    constructor(hp, atk) {
        super(hp, atk);
    }
}
const mage1 = new mage(50, 40, "Maxmilián", 100, 0);
const warrior1 = new warrior(100, 50, "Henry", 25);
const bard1 = new bard(70, 20, "Dariviel", 0);
const goomba1 = new goomba(100, 30);
console.log(mage1);
console.log(warrior1);
console.log(bard1);
console.log(goomba1);
