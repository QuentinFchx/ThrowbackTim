import {Item} from "../Item";
import {Level} from "../Level";
import {calcAngle, calcDistance, inArray, overlap, removeInArray} from "../helpers";

declare var level: Level;
declare var game: Phaser.Game;

const FLAMMABLES = [ 'laser_ray' ]

export function explode(cx, cy, radius, strength){
	/*Grab all of the objects in a predetermined radius of the explosion by looping over your game objects and using Circle.contains to see if their position lies within the circle. You could maybe make use of an overlap test with a square body of the same size as the circle to make use of the QuadTree optimisation if you have lots of objects in your world.
		For each object, check the distance and the angle (in radians) from the explosion's centre point.
	Using the angle and the inverse of the distance, perform some simple trigonometry to determine which direction and with what force you need to add to an object (optionally taking into account mass):
	*/
	let explosion = game.add.sprite(cx, cy, 'explosion');
	explosion.anchor.set(0.5,0.5);
	explosion.animations.add('explosion');
	explosion.scale.set(radius/64, radius/64);

	explosion.play('explosion', 30, false, true);

	let explosionCircle = new Phaser.Circle(cx, cy, radius*2);

	for(let sprite of level.sprites){
		if(Phaser.Circle.contains(explosionCircle, sprite.centerX, sprite.centerY)){
			let distance = calcDistance(cx, cy, sprite.centerX, sprite.centerY);
			let angle = calcAngle(cx, cy, sprite.centerX, sprite.centerY);
			let force = strength * (radius - distance) / sprite.body.mass;
			sprite.body.velocity.x += Math.cos(angle) * force;
			sprite.body.velocity.y += Math.sin(angle) * force;
		}
	}
}

export class InflammableItem extends Item {
	sprite: Phaser.Sprite;
	wick: Phaser.Rectangle;
	isLight: boolean;

	spawn(x: number, y: number): Phaser.Sprite {
		this.sprite = super.spawn(x, y);
		this.sprite.update = () => this.update();
		this.isLight = false;
		this.wick = new Phaser.Rectangle(0,0,this.sprite.height, this.sprite.width)
		return this.sprite;
	}

	update(){
		const wick = new Phaser.Rectangle(
			this.sprite.x + this.wick.x,
			this.sprite.y + this.wick.y,
			this.wick.width,
			this.wick.height
		)

		if(!this.isLight && level.sprites.some(s => {
			return inArray(FLAMMABLES, s.key) && overlap(s, wick)
		})){
			this.fire()
		}
	}

	fire(){
		this.isLight = true;
	}
}

export class Rocket extends InflammableItem {
	key = 'rocket';
	speed = 0;

	constructor(){
		super();
		this.wick = new Phaser.Rectangle(0,100,48,28);
	}

	spawn(x: number, y: number){
		super.spawn(x, y);
		this.sprite.body.onBeginContact.add(() => this.isLight && this.explode())
		this.sprite.animations.add("explosion");
		return this.sprite;
	}

	update(){
		super.update();
		if(this.isLight){
			this.speed += 25;
			this.sprite.body.moveUp(this.speed)
		}
	}

	fire(){
		super.fire();
		this.sprite.frame = 1;
	}

	explode(){
		explode(this.sprite.x, this.sprite.y, 125, 85);
		removeInArray(level.sprites, this.sprite)
		this.sprite.kill();
	}
}