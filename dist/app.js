(function () {
'use strict';

const DEBUG_HITBOX = false;
class Item {
    constructor() {
    }
    spawn(x, y) {
        const sprite = game.add.sprite(x, y, this.key);
        game.physics.p2.enable(sprite, DEBUG_HITBOX);
        return sprite;
    }
}
class Ball extends Item {
    constructor() {
        super();
        this.radius = 16;
        this.mass = 1;
    }
    spawn(x, y) {
        const sprite = super.spawn(x, y);
        sprite.width = 2 * this.radius;
        sprite.height = 2 * this.radius;
        sprite.body.setCircle(this.radius);
        sprite.body.mass = this.mass;
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

var DIRECTION;
(function (DIRECTION) {
    DIRECTION[DIRECTION["LEFT"] = 0] = "LEFT";
    DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
})(DIRECTION || (DIRECTION = {}));
var DIRECTION4;
(function (DIRECTION4) {
    DIRECTION4[DIRECTION4["LEFT"] = 0] = "LEFT";
    DIRECTION4[DIRECTION4["RIGHT"] = 1] = "RIGHT";
    DIRECTION4[DIRECTION4["TOP"] = 2] = "TOP";
    DIRECTION4[DIRECTION4["BOTTOM"] = 3] = "BOTTOM";
})(DIRECTION4 || (DIRECTION4 = {}));
var COLOR;
(function (COLOR) {
    COLOR[COLOR["RED"] = 0] = "RED";
    COLOR[COLOR["GREEN"] = 1] = "GREEN";
    COLOR[COLOR["BLUE"] = 2] = "BLUE";
    COLOR[COLOR["YELLOW"] = 3] = "YELLOW";
})(COLOR || (COLOR = {}));
const extractContactPoint = handler => function (bodyA, bodyB, shapeA, shapeB, equation) {
    const pos = equation[0].bodyA.position;
    const pt = equation[0].contactPointA;
    const cx = game.physics.p2.mpxi(pos[0] + pt[0]);
    const cy = game.physics.p2.mpxi(pos[1] + pt[1]);
    return handler.call(this, { x: cx, y: cy });
};
function removeInArray(arr, elm) {
    arr.splice(arr.indexOf(elm), 1);
    return arr;
}

function inArray(arr, elm) {
    return arr.indexOf(elm) >= 0; // TS, donne moi includes() !!!
}
function overlap(sprite, rect) {
    const bounds = sprite.getBounds();
    return bounds.x + bounds.width > rect.x
        && bounds.x < rect.x + rect.width
        && bounds.y + bounds.height > rect.y
        && bounds.y < rect.y + rect.height;
}
function calcDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}
function calcAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}
function boxContains([NW, SE], [x, y], strict = true) {
    return x > NW[0]
        && x < SE[0]
        && y > NW[1]
        && y < SE[1];
}
//# sourceMappingURL=helpers.js.map

let timeStarted = 0;
class ItemsBar {
    constructor(items = []) {
        this.items = items;
        this.selectedItem = null;
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
                level.restart();
            }
        });
        undoButton.inputEnabled = true;
        undoButton.events.onInputDown.add(() => {
            playButton.loadTexture('button_play');
            game.paused = true;
            level.reset();
            this.resetItems();
        });
        this.timeText = game.add.text(0, 0, '', {
            font: '24px Arial',
            fill: '#fff',
            boundsAlignH: 'center',
            boundsAlignV: 'middle'
        });
        this.timeText.setTextBounds(1151, 104, 96, 32);
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        this.items.forEach((itemToPlace, i) => {
            itemToPlace.key = (new itemToPlace.item()).key;
            itemToPlace.button = game.add.button(1170, 265 + i * 100, itemToPlace.key);
            itemToPlace.button.anchor.set(0.5, 0.5);
            itemToPlace.button.tint = 0xCCCCCC;
            itemToPlace.button.onInputDown.add(() => this.selectItem(itemToPlace));
            itemToPlace.textCount = game.add.text(1220, 250 + i * 100, `x ${itemToPlace.available}`, {
                font: '24px Arial',
                fill: '#fff',
                boundsAlignH: 'center',
                boundsAlignV: 'middle'
            });
        });
        this.resetItems();
        this.initInput();
    }
    resetItems() {
        this.unselectItem();
        for (const itemToPlace of this.items) {
            itemToPlace.count = itemToPlace.available;
            itemToPlace.textCount.text = `x ${itemToPlace.count}`;
        }
    }
    selectItem(itemToPlace) {
        if (!game.paused || itemToPlace.count <= 0)
            return;
        this.unselectItem();
        this.selectedItem = itemToPlace;
        this.selectedItem.button.tint = 0xFFFFFF;
        if (this.itemSpriteToPlace)
            this.itemSpriteToPlace.destroy();
        this.itemSpriteToPlace = game.add.sprite(0, 0, itemToPlace.key);
        this.itemSpriteToPlace.anchor.set(0.5, 0.5);
        this.itemSpriteToPlace.visible = false;
    }
    removeItem(itemPlaced) {
        itemPlaced.sprite.destroy();
        removeInArray(level.playerItems, itemPlaced);
        const itemToPlace = this.items.find(itemToPlace => itemPlaced.item instanceof itemToPlace.item);
        itemToPlace.count++;
        itemToPlace.textCount.text = `x ${itemToPlace.count}`;
    }
    moveItem(itemPlaced) {
        const itemToPlace = this.items.find(itemToPlace => itemPlaced.item instanceof itemToPlace.item);
        this.removeItem(itemPlaced);
        this.selectItem(itemToPlace);
    }
    unselectItem() {
        if (this.selectedItem)
            this.selectedItem.button.tint = 0xCCCCCC;
        if (this.itemSpriteToPlace)
            this.itemSpriteToPlace.destroy();
        this.selectedItem = null;
        this.itemSpriteToPlace = null;
    }
    placeItem(itemToPlace, x, y) {
        const newItem = new itemToPlace.item();
        const itemPlaced = {
            item: newItem,
            position: { x, y }
        };
        level.playerItems.push(itemPlaced);
        itemToPlace.count--;
        itemToPlace.textCount.text = `x ${itemToPlace.count}`;
        this.spawnItem(itemPlaced);
    }
    spawnItem(itemPlaced) {
        if (itemPlaced.sprite)
            itemPlaced.sprite.destroy();
        itemPlaced.sprite = itemPlaced.item.spawn(itemPlaced.position.x, itemPlaced.position.y);
        itemPlaced.sprite.inputEnabled = true;
        itemPlaced.sprite.events.onInputUp.add((sprite, pointer) => {
            if (!game.paused || this.itemSpriteToPlace)
                return;
            this.moveItem(itemPlaced);
            this.onMouseMove(pointer.x, pointer.y);
        });
    }
    updateTime() {
        const time = new Date(Date.now() - timeStarted);
        const [m, s] = [time.getMinutes(), time.getSeconds()];
        this.timeText.text = `${m < 10 ? '0' + m : m} : ${s < 10 ? '0' + s : s}`;
    }
    onMouseMove(x, y) {
        if (this.itemSpriteToPlace && game.paused) {
            const { width, height } = this.itemSpriteToPlace;
            if (boxContains([
                [width / 2, 64 + height / 2],
                [game.width - 160 - width / 2, game.height - height / 2]
            ], [x, y])) {
                this.itemSpriteToPlace.visible = true;
                this.itemSpriteToPlace.x = x;
                this.itemSpriteToPlace.y = y;
            }
            else {
                this.itemSpriteToPlace.visible = false;
            }
        }
    }
    initInput() {
        game.input.addMoveCallback((pointer, x, y) => this.onMouseMove(x, y), this);
        game.input.onTap.add(event => {
            if (this.itemSpriteToPlace && game.paused) {
                const { x, y } = event;
                const { width, height } = this.itemSpriteToPlace;
                if (boxContains([
                    [width / 2, 64 + height / 2],
                    [game.width - 160 - width / 2, game.height - height / 2]
                ], [x, y])) {
                    this.placeItem(this.selectedItem, x, y);
                    this.unselectItem();
                }
            }
        }, this);
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
        this.text.setTextBounds(0, 4, 1120, 64);
    }
}

class Level {
    constructor() {
        this.levelSprites = [];
        this.playerItems = [];
        this.items = [];
    }
    initialize() {
        this.itemsBar = new ItemsBar(this.items);
        this.objectiveBar = new ObjectiveBar(this.objective);
        this.restart();
    }
    get sprites() {
        return this.levelSprites.concat(this.playerItems.map(item => item.sprite));
    }
    reset() {
        for (let itemPlaced of this.playerItems) {
            itemPlaced.sprite.destroy();
            itemPlaced.position = null;
        }
        this.playerItems = [];
        this.restart();
    }
    restart() {
        for (let sprite of this.levelSprites) {
            sprite.destroy();
        }
        this.levelSprites = [];
        for (let itemPlaced of this.playerItems) {
            this.itemsBar.spawnItem(itemPlaced);
        }
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

class Football extends Ball {
    constructor(...args) {
        super(...args);
        this.key = 'ball_football';
        this.radius = 24;
        this.mass = 2;
    }
}
class BowlingBall extends Ball {
    constructor(...args) {
        super(...args);
        this.key = 'ball_bowling';
        this.radius = 32;
        this.mass = 5;
    }
}

class Ramp extends StaticItem {
    spawn(x, y) {
        const sprite = super.spawn(x, y);
        sprite.anchor.set(0.5, 0.5);
        const body = sprite.body;
        body.static = true;
        body.clearShapes();
        body.loadPolygon(null, [{ "shape": this.bbox }]);
        return sprite;
    }
}
class MetalRamp1 extends Ramp {
    constructor(...args) {
        super(...args);
        this.key = 'metal_ramp1';
        this.bbox = [82, 0, 96, 14, 14, 96, 0, 82];
    }
}
class MetalRamp2 extends Ramp {
    constructor(...args) {
        super(...args);
        this.key = 'metal_ramp2';
        this.bbox = [14, 0, 96, 82, 82, 96, 0, 14];
    }
}

class Animal extends Item {
    constructor(...args) {
        super(...args);
        this.lookingDir = DIRECTION.RIGHT;
        this.isWalking = false;
        this.speed = 100;
    }
    spawn(x, y) {
        this.sprite = super.spawn(x, y);
        this.sprite.body.setRectangle(this.width, this.height);
        this.sprite.update = () => this.update();
        this.sprite.animations.add('walkLeft', [0, 1, 2], 4, true);
        this.sprite.animations.add('walkRight', [3, 4, 5], 4, true);
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
class Turtle extends Animal {
    constructor(...args) {
        super(...args);
        this.key = "turtle";
        this.width = 45;
        this.height = 30;
        this.speed = 50;
    }
}

class Machine extends StaticItem {
    constructor(...args) {
        super(...args);
        this.isPowered = false;
    }
    spawn(x, y) {
        this.sprite = super.spawn(x, y);
        this.sprite.body.setRectangle(this.width, this.height);
        this.sprite.update = () => this.update();
        this.switchPower(this.isPowered);
        return this.sprite;
    }
    update() {
        if (!this.isPowered && this.powerSource && this.powerSource.isPowered) {
            this.switchPower(true);
        }
        else if (this.isPowered && (!this.powerSource || !this.powerSource.isPowered)) {
            this.switchPower(false);
        }
    }
    switchPower(on) {
        this.isPowered = on;
    }
}
class PowerSource extends StaticItem {
    constructor(...args) {
        super(...args);
        this.isPowered = false;
    }
}
class PowerSwitch extends PowerSource {
    constructor(...args) {
        super(...args);
        this.key = "powerswitch";
        this.direction = DIRECTION.RIGHT;
    }
    spawn(x, y) {
        this.sprite = super.spawn(x, y);
        this.sprite.body.setRectangle(32, 18, 0, 8);
        this.sprite.body.onBeginContact.add(extractContactPoint(this.onContact), this);
        return this.sprite;
    }
    onContact({ x }) {
        const errorMargin = 5;
        const isFromLeftSide = x < this.sprite.position.x - this.sprite.width / 2 + errorMargin;
        const isFromRightSide = x > this.sprite.position.x + this.sprite.width / 2 - errorMargin;
        if ((isFromLeftSide && this.direction === DIRECTION.LEFT)
            || (isFromRightSide && this.direction === DIRECTION.RIGHT)) {
            this.switchDirection();
        }
    }
    switchDirection() {
        this.isPowered = !this.isPowered;
        this.direction = (this.direction === DIRECTION.LEFT ? DIRECTION.RIGHT : DIRECTION.LEFT);
        this.sprite.frame = (this.direction === DIRECTION.LEFT ? 1 : 0);
    }
}
class Fan extends Machine {
    constructor(...args) {
        super(...args);
        this.key = "fan";
        this.width = 46;
        this.height = 64;
        this.direction = DIRECTION.RIGHT;
        this.range = 300;
        this.strength = 65;
    }
    spawn(x, y) {
        super.spawn(x, y);
        this.sprite.animations.add('blowRight', Fan.FRAMES[DIRECTION.RIGHT], this.strength, true);
        this.sprite.animations.add('blowLeft', Fan.FRAMES[DIRECTION.LEFT], this.strength, true);
        return this.sprite;
    }
    switchPower(on) {
        super.switchPower(on);
        if (this.isPowered) {
            this.sprite.play(this.direction === DIRECTION.RIGHT ? 'blowRight' : 'blowLeft');
        }
        else {
            this.sprite.frame = Fan.FRAMES[this.direction][0];
        }
    }
    update() {
        super.update();
        if (this.isPowered) {
            let blowzone = new Phaser.Rectangle(this.sprite.x, this.sprite.y - 50, this.range, 100);
            if (this.direction === DIRECTION.LEFT)
                blowzone.x -= this.range;
            for (let sprite of level.sprites) {
                if (sprite !== this.sprite && blowzone.contains(sprite.centerX, sprite.centerY)) {
                    let distance = Math.abs(sprite.x - this.sprite.x);
                    let acceleration = this.strength / sprite.body.mass * (this.range - distance) / this.range;
                    sprite.body.velocity.x += acceleration * (this.direction === DIRECTION.LEFT ? -1 : 1);
                }
            }
        }
    }
}
Fan.FRAMES = {
    [DIRECTION.RIGHT]: [0, 1],
    [DIRECTION.LEFT]: [1, 2]
};
class Laser extends Machine {
    constructor(...args) {
        super(...args);
        this.key = "laser_machine";
        this.width = 32;
        this.height = 32;
        this.direction = DIRECTION4.RIGHT;
        this.laserColor = COLOR.RED;
    }
    switchPower(on) {
        super.switchPower(on);
        this.sprite.frame = Laser.FRAMES[this.direction][on ? 0 : 1];
        let isHorizontal = this.direction === DIRECTION4.LEFT || this.direction === DIRECTION4.RIGHT;
        if (on) {
            this.ray = game.add.sprite(0, 0, 'laser_ray');
            level.levelSprites.push(this.ray);
            this.ray.frame = Laser.RAY_FRAMES[this.laserColor][isHorizontal ? 1 : 0];
            if (isHorizontal) {
                this.ray.crop(new Phaser.Rectangle(0, 12, 32, 8), false);
                this.ray.y = this.sprite.y - 4;
            }
            if (this.direction === DIRECTION4.LEFT) {
                this.ray.x = 0;
                this.ray.width = this.sprite.x - this.sprite.offsetX;
            }
            if (this.direction === DIRECTION4.RIGHT) {
                this.ray.x = this.sprite.x - this.sprite.offsetX + this.sprite.width;
                this.ray.width = game.world.width - this.ray.x;
            }
            this.updateRay();
        }
        else if (this.ray) {
            removeInArray(level.sprites, this.ray);
            this.ray.destroy();
        }
    }
    update() {
        super.update();
        this.updateRay();
    }
    updateRay() {
        if (this.isPowered && this.ray) {
            let errorMargin = 4;
            if (this.direction === DIRECTION4.RIGHT) {
                this.ray.width = game.world.width - this.ray.x;
                let overlappingSprites = level.sprites.filter(s => s.x > this.ray.x
                    && s !== this.ray
                    && s !== this.sprite
                    && s.overlap(this.ray));
                let closestObstacle = overlappingSprites.sort((a, b) => a.x - b.x)[0];
                let obstacleX = closestObstacle ? closestObstacle.x + closestObstacle.offsetX : game.world.width;
                this.ray.width = obstacleX - this.ray.x + errorMargin;
            }
            if (this.direction === DIRECTION4.LEFT) {
                this.ray.width = this.sprite.x - this.sprite.position.x;
                this.ray.x = 0;
                let overlappingSprites = level.sprites.filter(s => s.x < this.sprite.x
                    && s !== this.ray
                    && s !== this.sprite
                    && s.overlap(this.ray));
                let closestObstacle = overlappingSprites.sort((a, b) => b.x - a.x)[0];
                let obstacleX = closestObstacle ? closestObstacle.x + closestObstacle.width - closestObstacle.offsetX : 0;
                this.ray.x = obstacleX - errorMargin;
                this.ray.width = this.sprite.x - this.sprite.offsetX - this.ray.x + errorMargin;
            }
        }
    }
    getRayCollisionPoint() {
        for (let sprite of level.sprites) {
            sprite.overlap(this.ray);
        }
    }
}
Laser.FRAMES = {
    [DIRECTION4.LEFT]: [0, 2],
    [DIRECTION4.RIGHT]: [4, 6],
    [DIRECTION4.TOP]: [5, 7],
    [DIRECTION4.BOTTOM]: [1, 3],
};
Laser.RAY_FRAMES = {
    [COLOR.YELLOW]: [0, 4],
    [COLOR.GREEN]: [1, 5],
    [COLOR.RED]: [2, 6],
    [COLOR.BLUE]: [3, 7]
};

const FLAMMABLES = ['laser_ray'];
function explode(cx, cy, radius, strength) {
    /*Grab all of the objects in a predetermined radius of the explosion by looping over your game objects and using Circle.contains to see if their position lies within the circle. You could maybe make use of an overlap test with a square body of the same size as the circle to make use of the QuadTree optimisation if you have lots of objects in your world.
        For each object, check the distance and the angle (in radians) from the explosion's centre point.
    Using the angle and the inverse of the distance, perform some simple trigonometry to determine which direction and with what force you need to add to an object (optionally taking into account mass):
    */
    let explosion = game.add.sprite(cx, cy, 'explosion');
    explosion.anchor.set(0.5, 0.5);
    explosion.animations.add('explosion');
    explosion.scale.set(radius / 64, radius / 64);
    explosion.play('explosion', 30, false, true);
    let explosionCircle = new Phaser.Circle(cx, cy, radius * 2);
    for (let sprite of level.sprites) {
        if (Phaser.Circle.contains(explosionCircle, sprite.centerX, sprite.centerY)) {
            let distance = calcDistance(cx, cy, sprite.centerX, sprite.centerY);
            let angle = calcAngle(cx, cy, sprite.centerX, sprite.centerY);
            let force = strength * (radius - distance) / sprite.body.mass;
            sprite.body.velocity.x += Math.cos(angle) * force;
            sprite.body.velocity.y += Math.sin(angle) * force;
        }
    }
}
class InflammableItem extends Item {
    spawn(x, y) {
        this.sprite = super.spawn(x, y);
        this.sprite.update = () => this.update();
        this.isLight = false;
        this.wick = new Phaser.Rectangle(0, 0, this.sprite.height, this.sprite.width);
        return this.sprite;
    }
    update() {
        const wick = new Phaser.Rectangle(this.sprite.x + this.wick.x, this.sprite.y + this.wick.y, this.wick.width, this.wick.height);
        if (!this.isLight && level.sprites.some(s => {
            return inArray(FLAMMABLES, s.key) && overlap(s, wick);
        })) {
            this.fire();
        }
    }
    fire() {
        this.isLight = true;
    }
}
class Rocket extends InflammableItem {
    constructor() {
        super();
        this.key = 'rocket';
        this.speed = 0;
        this.wick = new Phaser.Rectangle(0, 100, 48, 28);
    }
    spawn(x, y) {
        super.spawn(x, y);
        this.sprite.body.onBeginContact.add(() => this.isLight && this.explode());
        this.sprite.animations.add("explosion");
        return this.sprite;
    }
    update() {
        super.update();
        if (this.isLight) {
            this.speed += 25;
            this.sprite.body.moveUp(this.speed);
        }
    }
    fire() {
        super.fire();
        this.sprite.frame = 1;
    }
    explode() {
        explode(this.sprite.x, this.sprite.y, 125, 85);
        removeInArray(level.sprites, this.sprite);
        this.sprite.kill();
    }
}

class Level1 extends Level {
    constructor(...args) {
        super(...args);
        this.objective = "Drop the four turtles into the radioactive tank";
        this.items = [
            { item: BowlingBall, available: 1 },
            { item: Football, available: 1 },
            { item: Pizza, available: 2 },
            { item: MetalRamp1, available: 1 },
            { item: MetalRamp2, available: 1 }
        ];
    }
    initialize() {
        super.initialize();
        game.stage.backgroundColor = "#4c9bbf";
    }
    restart() {
        super.restart();
        const donatello = new Turtle();
        const leonardo = new Turtle();
        const raphael = new Turtle();
        const michelangelo = new Turtle();
        leonardo.lookingDir = DIRECTION.LEFT;
        const powerSwitchLaser = new PowerSwitch();
        powerSwitchLaser.direction = DIRECTION.RIGHT;
        const laser = new Laser();
        laser.direction = DIRECTION4.LEFT;
        laser.powerSource = powerSwitchLaser;
        const rocket = new Rocket();
        const powerSwitchFan = new PowerSwitch();
        powerSwitchFan.direction = DIRECTION.RIGHT;
        const fan = new Fan();
        fan.direction = DIRECTION.RIGHT;
        fan.powerSource = powerSwitchFan;
        this.levelSprites.push(donatello.spawn(310, 170), leonardo.spawn(1060, 328), raphael.spawn(490, 425), michelangelo.spawn(138, 425), powerSwitchLaser.spawn(640, 848), laser.spawn(600, 848), rocket.spawn(80, 800), powerSwitchFan.spawn(335, 562), fan.spawn(360, 430));
    }
}

var level$1;
const game$1 = new Phaser.Game(1280, 960, Phaser.AUTO, 'content', {
    preload() {
        game$1.load.image('logo', 'assets/phaser2.png');
        game$1.load.image('objective_bar', 'assets/objective_bar.png');
        game$1.load.image('items_bar', 'assets/items_bar.png');
        game$1.load.image('star', 'assets/star_particle.png');
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
        game$1.load.image('ball_tennis', 'assets/sprites/ball_tennis.png');
        game$1.load.image('ball_bowling', 'assets/sprites/ball_bowling.png');
        game$1.load.image('ball_basket', 'assets/sprites/ball_basket.png');
        game$1.load.image('metal_ramp1', 'assets/sprites/metal_ramp1.png');
        game$1.load.image('metal_ramp2', 'assets/sprites/metal_ramp2.png');
        game$1.load.image('metal_pipe1', 'assets/sprites/metal_pipe1.png');
        game$1.load.image('pizza', 'assets/sprites/pizza.png');
        game$1.load.spritesheet('turtle', 'assets/sprites/turtle_sheet.png', 45, 32);
        game$1.load.spritesheet('powerswitch', 'assets/sprites/powerswitch.png', 32, 32);
        game$1.load.spritesheet('laser_machine', 'assets/sprites/laser_machine.png', 32, 32);
        game$1.load.spritesheet('laser_ray', 'assets/sprites/laser.png', 32, 32);
        game$1.load.spritesheet('rocket', 'assets/sprites/rocket.png', 64, 128);
        game$1.load.spritesheet('explosion', 'assets/sprites/explode.png', 128, 128);
        game$1.load.spritesheet('fan', 'assets/sprites/fan.png', 46, 64);
        game$1.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
    },
    create() {
        game$1.paused = true;
        game$1.world.setBounds(0, 64, 32 * 35, 32 * 28);
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
        restitution: 0.35,
        stiffness: 1e7,
        relaxation: 3,
    });
}
window.game = game$1;
//# sourceMappingURL=app.js.map

}());
//# sourceMappingURL=app.js.map
