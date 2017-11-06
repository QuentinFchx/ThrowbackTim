(function () {
'use strict';

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

class Pipe extends StaticItem {
    constructor(tileSrc, polygons) {
        super(tileSrc);
        this.polygons = polygons;
    }
    spawn(x, y) {
        const sprite = super.spawn(x, y);
        const body = sprite.body;
        body.clearShapes();
        this.polygons.forEach(polygon => body.addPolygon(null, polygon));
        //body.data.position = [0,0];
        console.log(body);
        return sprite;
    }
}
function getPipes() {
    const MetalPipe1 = new Pipe('metal_pipe1', [
        [[50, 0], [50, 40], [36, 51], [1, 50], [2, 47], [36, 48], [48, 38], [49, 2]],
        [[95, 1], [95, 44], [76, 76], [39, 95], [0, 95], [0, 92], [39, 92], [74, 74], [92, 44], [92, 0]],
    ]);
    return { MetalPipe1 };
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

class Level1 {
    initialize() {
        const { Football } = getBalls();
        const { MetalRamp1, MetalRamp2 } = getRamps();
        const { MetalPipe1 } = getPipes();
        const { Bouncy } = getBouncers();
        Football.spawn(430, 100);
        Football.spawn(130, 80);
        Football.spawn(630, 50);
        Football.spawn(810, 50);
        Football.spawn(1080, 40);
        game.input.onTap.add((pointer) => {
            Football.spawn(pointer.x, pointer.y);
        }, this);
        MetalRamp1.spawn(400, 200);
        MetalRamp2.spawn(700, 200);
        MetalPipe1.spawn(300, 250);
        Bouncy.spawn(500, 500);
    }
}

const game$1 = new Phaser.Game(1280, 960, Phaser.AUTO, 'content', {
    preload() {
        game$1.load.image('logo', 'assets/phaser2.png');
        game$1.load.image('metal_wall', 'assets/tiles/metal_wall.png');
        game$1.load.image('ball_football', 'assets/sprites/ball_football.png');
        game$1.load.image('metal_ramp1', 'assets/sprites/metal_ramp1.png');
        game$1.load.image('metal_ramp2', 'assets/sprites/metal_ramp2.png');
        game$1.load.image('metal_pipe1', 'assets/sprites/metal_pipe1.png');
        game$1.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
    },
    create() {
        const logo = game$1.add.sprite(game$1.world.centerX, game$1.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
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
        (new Level1()).initialize();
    },
    update() {
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

}());
//# sourceMappingURL=app.js.map
