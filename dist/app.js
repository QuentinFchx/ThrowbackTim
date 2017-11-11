(function () {
'use strict';

var timeStarted = 0;
class Level {
    constructor() {
        this.sprites = [];
        this.items = [];
    }
    initialize() {
        timeStarted = Date.now();
        const objectiveBar = game.add.sprite(0, 0, 'objective_bar');
        const itemsBar = game.add.sprite(1120, 0, 'items_bar');
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
        undoButton.events.onInputDown.add(e => {
            playButton.loadTexture('button_play');
            game.paused = true;
            this.initSprites();
            this.initItems();
        });
        const objectiveText = game.add.text(0, 0, this.objective, {
            font: "bold 16px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle",
        });
        objectiveText.setTextBounds(0, 0, 1120, 64);
        this.timeText = game.add.text(1158, 100, "", { fill: "#000" });
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        this.initSprites();
        this.initItems();
    }
    initSprites() {
        this.clearSprites();
    }
    initItems() {
    }
    clearSprites() {
        for (let sprite of this.sprites) {
            sprite.destroy();
        }
    }
    update() {
    }
    updateTime() {
        const time = new Date(Date.now() - timeStarted);
        let [m, s] = [time.getMinutes(), time.getSeconds()];
        this.timeText.text = `${m < 10 ? '0' + m : m} : ${s < 10 ? '0' + s : s}`;
    }
}

const DEBUG_HITBOX = true;
class Item {
    constructor(tileSrc) {
        this.tileSrc = tileSrc;
        this.spriteMaterial = game.physics.p2.createMaterial('spriteMaterial');
    }
    spawn(x, y) {
        const sprite = game.add.sprite(x, y, this.tileSrc);
        game.physics.p2.enable(sprite, DEBUG_HITBOX);
        sprite.body.setMaterial(this.spriteMaterial);
        return sprite;
    }
}
class Ball extends Item {
    constructor(tileSrc, bboxRadius) {
        super(tileSrc);
        this.bboxRadius = bboxRadius;
    }
    spawn(x, y) {
        const sprite = super.spawn(x, y);
        sprite.body.setCircle(this.bboxRadius);
        return sprite;
    }
}
class StaticItem extends Item {
    constructor(tileSrc) {
        super(tileSrc);
    }
    spawn(x, y) {
        const sprite = super.spawn(x, y);
        sprite.body.dynamic = false;
        return sprite;
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
    constructor(tileSrc, polygon) {
        super(tileSrc);
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
    constructor(tileSrc, polygon) {
        super(tileSrc);
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
        //const { MetalPipe1 } = getPipes();
        const { Bouncy } = getBouncers();
        this.sprites.push(Football.spawn(430, 140), Football.spawn(130, 120), Football.spawn(630, 120), Football.spawn(810, 120), Football.spawn(1080, 140), MetalRamp1.spawn(400, 300), MetalRamp2.spawn(700, 300), Bouncy.spawn(700, 500));
        /*
        game.input.onTap.add((pointer: Phaser.Pointer) => {
            Football.spawn(pointer.x, pointer.y);
        }, this);
        */
    }
}

var level;
const game$1 = new Phaser.Game(1280, 960, Phaser.AUTO, 'content', {
    preload() {
        game$1.load.image('logo', 'assets/phaser2.png');
        game$1.load.image('objective_bar', 'assets/objective_bar.png');
        game$1.load.image('items_bar', 'assets/items_bar.png');
        game$1.load.image('button_play', 'assets/sprites/button_play.png');
        game$1.load.image('button_restart', 'assets/sprites/button_restart.png');
        game$1.load.image('button_undo', 'assets/sprites/button_undo.png');
        game$1.load.image('metal_wall', 'assets/tiles/metal_wall.png');
        game$1.load.image('ball_football', 'assets/sprites/ball_football.png');
        game$1.load.image('metal_ramp1', 'assets/sprites/metal_ramp1.png');
        game$1.load.image('metal_ramp2', 'assets/sprites/metal_ramp2.png');
        game$1.load.image('metal_pipe1', 'assets/sprites/metal_pipe1.png');
        game$1.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
    },
    create() {
        game$1.paused = true;
        game$1.world.setBounds(0, 64, 32 * 35, 32 * 28);
        initPhysics();
        const map = game$1.add.tilemap('level1');
        map.addTilesetImage('metal_wall');
        map.setCollisionBetween(0, 7); // les tiles 0 à 7 gèrent les collisions
        window.map = map;
        //  Creates a new blank layer and sets the map dimensions.
        //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
        //const layer = map.create('level', 40, 30, 32, 32);
        const layerWalls = map.createLayer('walls');
        layerWalls.resizeWorld();
        //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
        //  This call returns an array of body objects which you can perform addition actions on if
        //  required. There is also a parameter to control optimising the map build.
        game$1.physics.p2.convertTilemap(map, layerWalls);
        level = new Level1();
        window.level = level;
        level.initialize();
    },
    update() {
        level.update();
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
        friction: 1.5,
        restitution: 0.65,
        stiffness: 1e7,
        relaxation: 3,
    });
}
window.game = game$1;
//# sourceMappingURL=app.js.map

}());
//# sourceMappingURL=app.js.map
