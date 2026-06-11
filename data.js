"use strict";
var enemies = [];
var heroes = [];
//abstraktní třída hrdiny
class hero {
    hp = -1;
    maxhp = -1;
    atk = -1;
    name = "";
    shield = -1;
    pos = -1;
    attackcounter = -1;
    dead = false;
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
        this.hp -= damageamount - Math.ceil((damageamount) * this.shield / 100);
        if (this.hp <= 0) {
            this.hp = 0;
            this.dead = true;
        }
    }
    Attack() {
    }
}
//abstraktní třída záporáka
class enemy {
    maxhp = -1;
    hp = -1;
    atk = -1;
    pos = -1;
    name = "";
    attackcounter = 1;
    shield = 0;
    dead = false;
    heal(ammounToHeal) {
        this.hp += ammounToHeal;
        if (this.hp > this.maxhp) {
            this.hp = this.maxhp;
        }
    }
    damage(damageamount) {
        this.hp -= damageamount - Math.ceil((damageamount) * this.shield / 100);
        if (this.hp <= 0) {
            var curpos = this.pos;
            enemies[curpos - 1] = null;
        }
    }
    constructor(hp, atk, pos) {
        this.hp = hp;
        this.maxhp = hp;
        this.atk = atk;
        this.pos = pos;
    }
}
//typy hrdin
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
        enemy.damage(this.atk / 2);
        var targEnPos = enemy.pos - 1;
        for (var i = -1; i <= 1; i++) {
            var targEnemyNear = enemies[targEnPos + i];
            if (targEnemyNear != null) {
                targEnemyNear.damage(this.atk / 2);
            }
        }
    }
    lightningStrike(enemy) {
        this.mana -= 20;
        enemy.damage(this.atk);
    }
    rechargeMana() {
        this.mana += 50;
        if (this.mana > this.maxmana) {
            this.mana = this.maxmana;
        }
    }
}
class warrior extends hero {
    constructor(hp, atk, name, shield, pos) {
        super(hp, atk, shield, name, pos);
    }
    roarActive = false;
    swordslash(enemy) {
        if (this.roarActive) {
            this.roarActive = false;
            enemy.damage(this.atk * 2.5);
        }
        else {
            enemy.damage(this.atk);
        }
        if (enemy.hp <= 0) {
            var posi = enemy.pos;
            enemies[posi - 1] = null;
        }
    }
    mightyRoar() {
        this.roarActive = true;
        console.log("raahh");
    }
}
class bard extends hero {
    constructor(hp, atk, name, shield, pos) {
        super(hp, atk, shield, name, pos);
    }
    healingMelody(groupToHeal) {
        for (var heroe of groupToHeal) {
            if (heroe != null) {
                heroe.heal(30);
            }
        }
    }
}
//typy záporáků
//goomba a koopa jsou placeholdeři, ale chtěl jsem je tady nechat, protože jsou roztomilí
class goomba extends enemy {
    constructor(pos) {
        super(100, 30, pos);
        this.name = "Goomba";
    }
    Attack() {
        // tohle vybírá náhodně jednoho živého hrdinu a útočí na něj, pokud nejsou žádní živí hrdinové, neútočí
        const alive = heroes.filter(h => h != null && h.dead == false);
        if (alive.length === 0) {
            return;
        }
        const chosen = alive[Math.floor(Math.random() * alive.length)];
        chosen.damage(this.atk);
        this.attackcounter++;
    }
}
class koopa extends enemy {
    constructor(pos) {
        super(150, 30, pos);
        this.name = "Koopa";
    }
    Attack() {
        const alive = heroes.filter(h => h != null && h.dead == false);
        if (alive.length === 0) {
            return;
        }
        const chosen = alive[Math.floor(Math.random() * alive.length)];
        chosen.damage(this.atk);
        this.attackcounter++;
    }
}
//baby útočí na všechny
class baby extends enemy {
    constructor(pos) {
        super(75, 10, pos);
        this.name = "Baby";
    }
    Attack() {
        for (var hero of heroes) {
            if (hero != null && hero.dead == false) {
                hero.damage(this.atk);
            }
        }
    }
}
class springer extends enemy {
    constructor(pos) {
        super(110, 30, pos);
        this.name = "Springer";
    }
    Attack() {
        const alive = heroes.filter(h => h != null && h.dead == false);
        if (alive.length === 0) {
            return;
        }
        const chosen = alive[Math.floor(Math.random() * alive.length)];
        chosen.damage(this.atk);
        this.attackcounter++;
    }
}
class husk extends enemy {
    constructor(pos) {
        super(50, 60, pos);
        this.name = "Husk";
        this.shield = 50;
    }
    Attack() {
        //útočí jen každý druhý tah
        if (this.attackcounter % 2 == 0) {
            const alive = heroes.filter(h => h != null && h.dead == false);
            if (alive.length === 0) {
                return;
            }
            const chosen = alive[Math.floor(Math.random() * alive.length)];
            chosen.damage(this.atk);
        }
        this.attackcounter++;
    }
}
class guardian extends enemy {
    constructor(pos) {
        super(200, 8, pos);
        this.name = "Guardian";
    }
    Attack() {
        //stejně jako útok který útočí na jednoho, ale je opakován 5krát
        for (var i = 0; i < 5; i++) {
            if (heroes.every(h => h == null || h.dead == true)) {
                return;
            }
            const alive = heroes.filter(h => h != null && h.dead == false);
            if (alive.length === 0) {
                return;
            }
            const chosen = alive[Math.floor(Math.random() * alive.length)];
            chosen.damage(this.atk);
        }
    }
}
class VBGuardian extends enemy {
    constructor(pos) {
        super(400, 10, pos);
        this.name = "Voidbound Guardian";
        this.shield = 25;
    }
    Attack() {
        //každý sudý tah útočí podobně jako guardian, každý lichý tah útočí podobně jako baby
        if (this.attackcounter % 2 == 0) {
            for (var i = 0; i < 8; i++) {
                if (heroes.every(h => h == null || h.dead == true)) {
                    return;
                }
                const alive = heroes.filter(h => h != null && h.dead == false);
                if (alive.length === 0) {
                    return;
                }
                const chosen = alive[Math.floor(Math.random() * alive.length)];
                chosen.damage(this.atk);
            }
        }
        else {
            for (var hero of heroes) {
                if (hero != null && hero.dead == false) {
                    hero.damage(30);
                }
            }
        }
    }
}
//popisky pro útoky a nepřátele, myslel jsem si že by bylo lehčí je mít všechny pohromadě než je mít v různých funkcích
class descriptions {
    static lightningStrike = "Smites the enemy with the power of the heavens, deals 60 damage and costs 20 mana.";
    static fireball = "Launches a big ball of flame at the enemy, dealing 60 damage to the target and 30 damage to all adjacent enemies, costs 30 mana";
    static rechargeMana = "The mage does nothing for a turn, but regains 50 mana";
    static swordSlash = "Runs up to the enemy and deals 50 damage";
    static mightyRoar = "The warrior lets out a mighty roar, deals 2.5x damage on the next attack";
    static healingMelody = "The bard plays a calming melody, healing all allies for 30 hp";
    static goomba = "The TEST TEST TEST TEST TEST";
    static koopa = "Uhhmm... uhhhh guh?";
    static baby = "Dashes at the heroes all at once, dealing 10 damage to everyone";
    static springer = "Jumps and crushes a target, dealing 30 damage";
    static guardian = "Shoots a volley of 5 magical bullets, dealing 8 damage per shot (choses a different target for each shot)";
    static husk = "The remains of a mighty warrior, deals 60 damage but only attacks every other turn";
    static VoidboundGuardian = "A stronger version of the guardian, cycles between shooting 8 magic attacks, each dealing 10 damage, and a powerful blast that deals 30 damage to everyone";
}
