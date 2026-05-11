"use strict";
class hero {
    hp = -1; //když dám private tak to říká že "private" nebo "protected" jsou použitelné jen v typescriptu
    maxhp = -1;
    atk = -1;
    name = "";
    shield = -1;
    pos = -1;
    attackcounter = -1
    constructor(hp, atk, shield, name, pos) {
        this.maxhp = hp;
        this.hp = hp;
        this.name = name;
        this.atk = atk;
        this.shield = shield;
        this.pos = pos;
    }
    heal(healamount) {
        this.hp += healamount;
        if (this.hp > this.maxhp) {
            this.hp = this.maxhp;
        }
    }
    damage(damageamount) {
        this.hp -= damageamount-((damageamount/100)*this.shield);
        if (this.hp <= 0) {
            console.log(this.name+" dead") //eště domyslim nějak
        }
    }
}
class enemy {
    maxhp = -1;
    hp = -1;
    atk = -1;
    pos = -1;
    name = "";
    attackcounter = 1
    constructor(hp, atk, pos) {
        this.hp = hp;
        this.maxhp = hp;
        this.atk = atk;
        this.pos = pos;
    }
    Attack() {

    }
}
class mage extends hero {
    mana = -1;
    maxmana = -1;
    constructor(hp, atk, name, mana, shield, pos) {
        super(hp, atk, shield, name, pos);
        this.mana = mana;
        this.maxmana = mana;
    }
    fireball(enemy) {
        enemy.hp -= this.atk;
        this.mana -= 30;
        if (enemy.hp <= 0) {
            var posi = enemy.pos;
            enemies[posi - 1] = null;
        }
    }
}
class warrior extends hero {
    constructor(hp, atk, name, shield, pos) {
        super(hp, atk, shield, name, pos);
    }
    swordslash(enemy) {
        enemy.hp -= this.atk
        if (enemy.hp<=0) {
            var posi = enemy.pos;
            enemies[posi - 1] = null;
        }
    }
}

warrior.damage = undefined;
class bard extends hero {
    constructor(hp, atk, name, shield, pos) {
        super(hp, atk, shield, name, pos);
    }
    healingMelody(groupToHeal) {
        for (var heroe of groupToHeal) {
            heroe.hp += 30
            if (heroe.hp>maxhp) {
                heroe.hp = maxhp
            }
        }
    }
}
class goomba extends enemy {
    constructor(hp, atk, pos) {
        super(hp, atk, pos);
        this.name = "Goomba";
    }

    Attack() {
        var choice = Math.floor(Math.random()*2.999)
        var chosen = heroes[choice]
        chosen.damage(20)
    }
}
