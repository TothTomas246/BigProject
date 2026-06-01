var enemies:enemy[]|null[]|hero[]=[]
var heroes:hero[]|enemy[] = []


//hrdina
abstract class hero {
    hp:number = -1;
    maxhp:number = -1;
    atk:number = -1;
    name:string = "";
    shield:number = -1;
    pos:number = -1;
    attackcounter:number = -1
    dead:boolean = false
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
            this.hp = 0
            this.dead = true
        }
    }

    Attack() {

    }
}

//záporák
abstract class enemy {
    maxhp:number = -1;
    hp:number = -1;
    atk:number = -1;
    pos:number = -1;
    name:string = "";
    attackcounter:number = 1
    shield:number = 0
    dead:boolean = false
    heal(ammounToHeal) {
        this.hp += ammounToHeal
        if (this.hp> this.maxhp) {
            this.hp = this.maxhp
        }
    }

    damage(damageamount) {
        this.hp -= damageamount-Math.ceil((damageamount)*this.shield/100);
        if (this.hp <= 0) {
            var curpos = this.pos
            enemies[curpos-1] = null
        }
    }

    constructor(hp, atk, pos) {
        this.hp = hp;
        this.maxhp = hp;
        this.atk = atk;
        this.pos = pos;
    }
    abstract Attack()
}

//typy hrdin
class mage extends hero {
    mana:number = -1;
    maxmana:number = -1;
    constructor(hp, atk, name, mana, shield, pos) {
        super(hp, atk, shield, name, pos);
        this.mana = mana;
        this.maxmana = mana;
    }
    fireball(enemy) {
        this.mana -= 30;
        enemy.damage(this.atk/2)
        var targEnPos = enemy.pos-1
        for (var i = -1; i<=1; i++) {
            var targEnemyNear=enemies[targEnPos+i]
            if (targEnemyNear!=null) {
                targEnemyNear.damage(this.atk/2);
            }
        }
    }
    lightningStrike(enemy) {
        this.mana -= 20;
        enemy.damage(this.atk)
    }
    rechargeMana() {
        this.mana+=50
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
            enemy.damage(this.atk*2.5)
        } else {
            enemy.damage(this.atk)
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
class bard extends hero {
    constructor(hp, atk, name, shield, pos) {
        super(hp, atk, shield, name, pos);
    }
    healingMelody(groupToHeal) {
        for (var heroe of groupToHeal) {
            heroe.heal(30)
        }
    }
}

//typy záporáků
class goomba extends enemy {
    constructor(pos) {
        super(100, 30, pos);
        this.name = "Goomba";
    }

    Attack() {
        var choice = Math.floor(Math.random()*2.999)
        var chosen = heroes[choice]
        if (chosen != null) {
            chosen.damage(this.atk)
        }
        this.attackcounter++
    }
}
class koopa extends enemy {
    constructor(pos) {
        super(150, 30, pos);
        this.name = "Koopa";
    }

    Attack() {
        var choice = Math.floor(Math.random()*2.999)
        var chosen = heroes[choice]
        if (chosen != null) {
            chosen.damage(this.atk)
        }
        this.attackcounter++
    }
}

//logika útočení (např to, že záporák útočí jenom každý sudý tah) bude napsána ve funkci Attack()