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
        this.hp -= damageamount-Math.ceil((damageamount)*this.shield/100);
        if (this.hp <= 0) {
            //this = null
        }
    }

    Attack() {

    }
}
class enemy {
    maxhp = -1;
    hp = -1;
    atk = -1;
    pos = -1;
    name = "";
    attackcounter = 1
    shield = 0
    heal(ammounToHeal) {
        this.hp += ammounToHeal
        if (this.hp> this.maxhp) {
            this.hp = this.maxhp
        }
    }

    damage() {
    }

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
        this.mana -= 30;
        enemy.hp -= this.atk/2-Math.ceil((this.atk/2)*(enemy.shield/100));
        var targEnPos = enemy.pos-1
        for (var i = -1; i<=1; i++) {
            var targEnemyNear=enemies[targEnPos+i]
            if (targEnemyNear!=null) {
                targEnemyNear.hp -= this.atk/2-Math.ceil((this.atk/2)*(enemy.shield/100));
                if (targEnemyNear.hp <= 0) {
                    enemies[targEnPos+i] = null
                }
            }
        }
    }
    lightningStrike(enemy) {
        this.mana -= 20;
        enemy.hp -= this.atk-Math.ceil((this.atk)*(enemy.shield/100));
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
    roarActive = false
    swordslash(enemy) {
        if (this.roarActive) {
            this.roarActive = false;
            enemy.hp-=this.atk*2.5-Math.ceil((this.atk*2.5)*(enemy.shield/100))
        } else {
            enemy.hp-=this.atk-Math.ceil((this.atk)*(enemy.shield/100))
        }
        if (enemy.hp<=0) {
            var posi = enemy.pos;
            enemies[posi - 1] = null;
        }
    }
    mightyRoar() {
        this.roarActive=true
        console.log("raahh")
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
            if (heroe.hp>heroe.maxhp) {
                heroe.hp = heroe.maxhp
            }
        }
    }
}
class goomba extends enemy {
    constructor(hp, atk, pos) {
        super(100, 30, pos);
        this.name = "Goomba";
    }

    Attack() {
        var choice = Math.floor(Math.random()*2.999)
        var chosen = heroes[choice]
        chosen.damage(this.atk)
    }
}
