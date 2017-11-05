(function () {
'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var Item = (function () {
    function Item(tileSrc) {
        this.tileSrc = tileSrc;
    }
    Item.prototype.spawn = function (x, y) {
        return game.add.sprite(x, y, this.tileSrc);
    };
    return Item;
}());
var DynamicItem = (function (_super) {
    __extends(DynamicItem, _super);
    function DynamicItem(tileSrc) {
        _super.call(this, tileSrc);
        this.spriteMaterial = game.physics.p2.createMaterial('spriteMaterial');
    }
    DynamicItem.prototype.spawn = function (x, y) {
        var sprite = _super.prototype.spawn.call(this, x, y);
        game.physics.p2.enable(sprite);
        sprite.body.setMaterial(this.spriteMaterial);
        return sprite;
    };
    return DynamicItem;
}(Item));
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball(tileSrc, bboxRadius) {
        _super.call(this, tileSrc);
        this.bboxRadius = bboxRadius;
    }
    Ball.prototype.spawn = function (x, y) {
        var sprite = _super.prototype.spawn.call(this, x, y);
        sprite.body.setCircle(this.bboxRadius);
        return sprite;
    };
    return Ball;
}(DynamicItem));

var game$1 = new Phaser.Game(1280, 960, Phaser.AUTO, 'content', {
    preload: function () {
        game$1.load.image('logo', 'assets/phaser2.png');
        game$1.load.image('ball_football', 'assets/sprites/ball_football.png');
        game$1.load.image('metal_wall', 'assets/tiles/metal_wall.png');
        game$1.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
    },
    create: function () {
        var logo = game$1.add.sprite(game$1.world.centerX, game$1.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        initPhysics();
        var map = game$1.add.tilemap('level1');
        map.addTilesetImage('metal_wall');
        map.setCollisionBetween(0, 7); // les tiles 0 à 7 gèrent les collisions
        window.map = map;
        //  Creates a new blank layer and sets the map dimensions.
        //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
        //const layer = map.create('level', 40, 30, 32, 32);
        var layerWalls = map.createLayer('walls');
        layerWalls.resizeWorld();
        //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
        //  This call returns an array of body objects which you can perform addition actions on if
        //  required. There is also a parameter to control optimising the map build.
        game$1.physics.p2.convertTilemap(map, layerWalls);
        addItems();
    },
    update: function () {
    },
    render: function () {
    }
});
function initPhysics() {
    game$1.physics.startSystem(Phaser.Physics.P2JS);
    game$1.physics.p2.gravity.y = 1000;
    var worldMaterial = game$1.physics.p2.createMaterial('worldMaterial');
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
function addItems() {
    var Football = new Ball('ball_football', 32);
    Football.spawn(430, 100);
    Football.spawn(130, 80);
    Football.spawn(630, 50);
    Football.spawn(810, 50);
    Football.spawn(1080, 40);
    game$1.input.onTap.add(function (pointer) {
        Football.spawn(pointer.x, pointer.y);
    }, this);
}
window.game = game$1;

}());
//# sourceMappingURL=app.js.map
