(function () {
'use strict';

const DEBUG_HITBOX = false;
class Item {
    constructor() {
        this.spriteMaterial = game.physics.p2.createMaterial('spriteMaterial');
    }
    spawn(x, y) {
        const sprite = game.add.sprite(x, y, this.key);
        game.physics.p2.enable(sprite, DEBUG_HITBOX);
        sprite.body.setMaterial(this.spriteMaterial);
        return sprite;
    }
}
class Ball extends Item {
    constructor(key, bboxRadius) {
        super();
        this.key = key;
        this.bboxRadius = bboxRadius;
    }
    spawn(x, y) {
        const sprite = super.spawn(x, y);
        sprite.body.setCircle(this.bboxRadius);
        return sprite;
    }
}
class StaticItem extends Item {
    constructor() {
        super();
    }
    spawn(x, y) {
        const sprite = super.spawn(x, y);
        sprite.body.dynamic = false;
        return sprite;
    }
}

class Pizza extends StaticItem {
    constructor(...args) {
        super(...args);
        this.key = 'pizza';
        this.width = 69;
        this.height = 32;
    }
    spawn(x, y) {
        const sprite = super.spawn(x, y);
        sprite.body.setRectangle(this.width, this.height);
        return sprite;
    }
}

var timeStarted = 0;
class ItemsBar {
    constructor(items = []) {
        this.items = items;
        this.selectedItem = null;
        this.itemSprites = [];
        timeStarted = Date.now();
        game.add.sprite(1120, 0, 'items_bar');
        const playButton = game.add.sprite(1144, 12, 'button_play');
        const undoButton = game.add.sprite(1204, 12, 'button_undo');
        playButton.inputEnabled = true;
        playButton.events.onInputDown.add(e => {
            if (game.paused) {
                playButton.loadTexture('button_restart');
                game.paused = false;
            }
            else {
                playButton.loadTexture('button_play');
                game.paused = true;
                this.initSprites();
            }
        });
        undoButton.inputEnabled = true;
        undoButton.events.onInputDown.add(() => {
            playButton.loadTexture('button_play');
            game.paused = true;
            this.initSprites();
        });
        this.timeText = game.add.text(0, 0, "", {
            font: "24px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });
        this.timeText.setTextBounds(1151, 104, 96, 32);
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        this.initSprites();
    }
    initSprites() {
        this.clearSprites();
    }
    clearSprites() {
        for (let sprite of this.itemSprites) {
            sprite.destroy();
        }
        this.itemSprites = [];
    }
    updateTime() {
        const time = new Date(Date.now() - timeStarted);
        let [m, s] = [time.getMinutes(), time.getSeconds()];
        this.timeText.text = `${m < 10 ? '0' + m : m} : ${s < 10 ? '0' + s : s}`;
    }
}

class ObjectiveBar {
    constructor(objective) {
        this.objective = objective;
        this.sprite = game.add.sprite(0, 0, 'objective_bar');
        this.text = game.add.text(0, 0, this.objective, {
            font: "bold 16px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle",
        });
        this.text.setTextBounds(0, 0, 1120, 64);
    }
}

class Level {
    constructor() {
        this.sprites = [];
        this.items = [];
    }
    initialize() {
        this.itemsBar = new ItemsBar(this.items);
        this.objectiveBar = new ObjectiveBar(this.objective);
        this.initSprites();
    }
    initSprites() {
        this.clearSprites();
    }
    clearSprites() {
        for (let sprite of this.sprites) {
            sprite.destroy();
        }
        this.sprites = [];
    }
    update() {
    }
    getSpritesInZone(x1, y1, x2, y2) {
        if (x2 < x1)
            [x1, x2] = [x2, x1];
        if (y2 < y1)
            [y1, y2] = [y2, y1];
        return this.sprites.filter(sprite => sprite.position.x + sprite.width >= x1
            && sprite.position.x <= x2
            && sprite.position.y + sprite.height >= y1
            && sprite.position.y <= y2);
    }
}

function getBalls() {
    const Football = new Ball('ball_football', 32);
    return {
        Football
    };
}
//# sourceMappingURL=balls.js.map

class Bouncer extends StaticItem {
    constructor(key, polygon) {
        super(key);
        this.polygon = polygon;
        this.bounceFactor = 1.5;
    }
    spawn(x, y) {
        const sprite = super.spawn(x, y);
        const body = sprite.body;
        body.clearShapes();
        body.addPolygon(null, this.polygon);
        body.onBeginContact.add(onContact, this);
        return sprite;
    }
}
function onContact(body, bodyB, shapeA, shapeB, equations) {
    const contactEquation = equations[0];
    const isTopSurface = contactEquation.contactPointA[0] === 0;
    if (isTopSurface)
        contactEquation.restitution = this.bounceFactor;
}
function getBouncers() {
    const Bouncy = new Bouncer('bouncer', [[0, 0], [60, 0], [60, 20], [0, 20]]);
    return {
        Bouncy
    };
}

class Ramp extends StaticItem {
    constructor(key, polygon) {
        super();
        this.key = key;
        this.polygon = polygon;
    }
    spawn(x, y) {
        const sprite = super.spawn(x, y);
        const body = sprite.body;
        body.clearShapes();
        body.addPolygon(null, this.polygon);
        return sprite;
    }
}
function getRamps() {
    const MetalRamp1 = new Ramp('metal_ramp1', [[78, 0], [96, 18], [18, 96], [0, 76]]);
    const MetalRamp2 = new Ramp('metal_ramp2', [[18, 0], [96, 77], [78, 96], [0, 18]]);
    return { MetalRamp1, MetalRamp2 };
}

var DIRECTION;
(function (DIRECTION) {
    DIRECTION[DIRECTION["LEFT"] = 0] = "LEFT";
    DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
})(DIRECTION || (DIRECTION = {}));

class Animal extends Item {
    constructor() {
        super();
        this.lookingDir = DIRECTION.RIGHT;
        this.isWalking = false;
        this.speed = 100;
    }
    spawn(x, y) {
        this.sprite = super.spawn(x, y);
        this.sprite.body.setRectangle(this.width, this.height);
        this.sprite.update = () => this.update();
        this.sprite.animations.add('walkLeft', [0, 1, 2], 3, true);
        this.sprite.animations.add('walkRight', [3, 4, 5], 3, true);
        this.sprite.animations.add('idleLeft', [1]);
        this.sprite.animations.add('idleRight', [4]);
        this.idle();
        return this.sprite;
    }
    walk() {
        this.sprite.animations.play(this.lookingDir === DIRECTION.RIGHT ? 'walkRight' : 'walkLeft');
        this.isWalking = true;
    }
    idle() {
        this.sprite.animations.play(this.lookingDir === DIRECTION.RIGHT ? 'idleRight' : 'idleLeft');
        this.isWalking = false;
    }
    update() {
        //game.debug.spriteInfo(this.sprite);
        if (this.isWalking && this.sprite.body.angle > -30 && this.sprite.body.angle < 30) {
            if (this.lookingDir === DIRECTION.RIGHT) {
                this.sprite.body.moveRight(this.speed);
            }
            else {
                this.sprite.body.moveLeft(this.speed);
            }
        }
        let eye = {
            x: this.lookingDir === DIRECTION.RIGHT ? this.sprite.position.x + 50 : this.sprite.position.x - 5,
            y: this.sprite.position.y + 10
        };
        const pizza = level.getSpritesInZone(eye.x, eye.y - 15, eye.x + 500 * (this.lookingDir === DIRECTION.RIGHT ? 1 : -1), eye.y + 15).find((sprite) => {
            return sprite.key === "pizza";
        });
        if (pizza && !this.isWalking)
            this.walk();
        else if (!pizza && this.isWalking)
            this.idle();
    }
}
function getAnimals() {
    class Turtle extends Animal {
        constructor(...args) {
            super(...args);
            this.key = "turtle";
            this.width = 45;
            this.height = 30;
            this.speed = 50;
        }
    }
    return {
        Turtle
    };
}

class Level1 extends Level {
    constructor(...args) {
        super(...args);
        this.objective = "Faire tomber les 4 tortues dans le bac radioactif";
    }
    initialize() {
        super.initialize();
    }
    initSprites() {
        super.initSprites();
        const { Football } = getBalls();
        const { MetalRamp1, MetalRamp2 } = getRamps();
        const { Bouncy } = getBouncers();
        const { Turtle } = getAnimals();
        const donatello = new Turtle();
        const leonardo = new Turtle();
        const raphael = new Turtle();
        const michelangelo = new Turtle();
        leonardo.lookingDir = DIRECTION.LEFT;
        const pizza = new Pizza();
        this.sprites.push(donatello.spawn(130, 170), leonardo.spawn(1016, 325), raphael.spawn(600, 424), michelangelo.spawn(130, 520), Football.spawn(515, 315));
        game.input.onTap.add((pointer) => {
            this.sprites.push(pizza.spawn(pointer.x, pointer.y));
        }, this);
    }
}

var level$1;
const game$1 = new Phaser.Game(1280, 960, Phaser.AUTO, 'content', {
    preload() {
        game$1.load.image('logo', 'assets/phaser2.png');
        game$1.load.image('objective_bar', 'assets/objective_bar.png');
        game$1.load.image('items_bar', 'assets/items_bar.png');
        game$1.load.image('city_tiles', 'assets/tiles/city_tiles.png');
        game$1.load.image('dirt_tiles', 'assets/tiles/dirt_tiles.png');
        game$1.load.image('industrial_tiles', 'assets/tiles/industrial_tiles.png');
        game$1.load.image('metal_tiles', 'assets/tiles/metal_tiles.png');
        game$1.load.image('metal_tiles_2', 'assets/tiles/metal_tiles_2.png');
        game$1.load.image('mytilesheet', 'assets/tiles/mytilesheet.png');
        game$1.load.image('button_play', 'assets/sprites/button_play.png');
        game$1.load.image('button_restart', 'assets/sprites/button_restart.png');
        game$1.load.image('button_undo', 'assets/sprites/button_undo.png');
        game$1.load.image('ball_football', 'assets/sprites/ball_football.png');
        game$1.load.image('metal_ramp1', 'assets/sprites/metal_ramp1.png');
        game$1.load.image('metal_ramp2', 'assets/sprites/metal_ramp2.png');
        game$1.load.image('metal_pipe1', 'assets/sprites/metal_pipe1.png');
        game$1.load.image('pizza', 'assets/sprites/pizza.png');
        game$1.load.spritesheet('turtle', 'assets/sprites/turtle_sheet.png', 45, 32);
        game$1.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
    },
    create() {
        game$1.paused = true;
        game$1.world.setBounds(0, 64, 32 * 35, 32 * 28);
        game$1.stage.backgroundColor = "#4488AA";
        initPhysics();
        const map = game$1.add.tilemap('level1');
        map.addTilesetImage('city_tiles');
        map.addTilesetImage('dirt_tiles');
        map.addTilesetImage('industrial_tiles');
        map.addTilesetImage('metal_tiles');
        map.addTilesetImage('metal_tiles_2');
        map.addTilesetImage('mytilesheet');
        window.map = map;
        //  Creates a new blank layer and sets the map dimensions.
        //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
        //const layer = map.create('level', 40, 30, 32, 32);
        map.createLayer('decor');
        map.createLayer('decor_fg');
        const layerWalls = map.createLayer('walls');
        layerWalls.resizeWorld();
        map.setCollisionByExclusion([], true, layerWalls);
        //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
        //  This call returns an array of body objects which you can perform addition actions on if
        //  required. There is also a parameter to control optimising the map build.
        game$1.physics.p2.convertTilemap(map, layerWalls);
        level$1 = new Level1();
        window.level = level$1;
        level$1.initialize();
    },
    update() {
        level$1.update();
    },
    render() {
    }
});
function initPhysics() {
    game$1.physics.startSystem(Phaser.Physics.P2JS);
    game$1.physics.p2.gravity.y = 1000;
    const worldMaterial = game$1.physics.p2.createMaterial('worldMaterial');
    //  4 trues = the 4 faces of the world in left, right, top, bottom order
    game$1.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
    game$1.physics.p2.world.defaultMaterial = worldMaterial;
    Object.assign(game$1.physics.p2.world.defaultContactMaterial, {
        friction: 0.5,
        restitution: 0.65,
        stiffness: 1e7,
        relaxation: 3,
    });
}
window.game = game$1;
//# sourceMappingURL=app.js.map

}());
//# sourceMappingURL=app.js.map
