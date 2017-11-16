import {StaticItem} from "../Item";
import {DIRECTION, DIRECTION4, extractContactPoint, COLOR, removeInArray, boxContains} from "../helpers";
import {Level} from "../Level";

declare var game: Phaser.Game;
declare var level: Level;

export class Machine extends StaticItem {
	isPowered: boolean = false;
	powerSource?: PowerSource;
	sprite: Phaser.Sprite;
	width: Number;
	height: Number;

	spawn(x: number, y: number): Phaser.Sprite {
		this.sprite = super.spawn(x, y);
		this.sprite.body.setRectangle(this.width, this.height);
		this.sprite.update = () => this.update();
		this.switchPower(this.isPowered);
		return this.sprite;
	}

	update(){
		if(!this.isPowered && this.powerSource && this.powerSource.isPowered){
			this.switchPower(true)
		} else if(this.isPowered && (!this.powerSource || !this.powerSource.isPowered)){
			this.switchPower(false);
		}
	}

	switchPower(on: boolean){
		this.isPowered = on;
	}

}

export class PowerSource extends StaticItem {
	isPowered: boolean = false;
}

export class PowerSwitch extends PowerSource {
	key = "powerswitch"
	direction:DIRECTION = DIRECTION.RIGHT;
	sprite: Phaser.Sprite;

	spawn(x: number, y: number): Phaser.Sprite {
		this.sprite = super.spawn(x, y);
		this.sprite.body.setRectangle(32,18,0,8);
		this.sprite.body.onBeginContact.add(extractContactPoint(this.onContact), this);
		return this.sprite;
	}

	onContact({ x }) {
		const errorMargin = 5;
		const isFromLeftSide = x < this.sprite.position.x - this.sprite.width / 2 + errorMargin;
		const isFromRightSide = x > this.sprite.position.x + this.sprite.width / 2 - errorMargin;
		if((isFromLeftSide && this.direction === DIRECTION.LEFT)
		|| (isFromRightSide && this.direction === DIRECTION.RIGHT)){
			this.switchDirection();
		}
	}

	switchDirection(){
		this.isPowered = !this.isPowered;
		this.direction = (this.direction === DIRECTION.LEFT ? DIRECTION.RIGHT : DIRECTION.LEFT);
		this.sprite.frame = (this.direction === DIRECTION.LEFT ? 1 : 0);
	}

}

export class Fan extends Machine {
	key="fan";
	width=46;
	height=64;
	direction: DIRECTION = DIRECTION.RIGHT;
	range = 300;
	strength = 65;

	static FRAMES = {
		[DIRECTION.RIGHT]: [0,1],
		[DIRECTION.LEFT]: [1,2]
	}

	spawn(x: number, y: number): Phaser.Sprite {
		super.spawn(x,y);
		this.sprite.animations.add('blowRight', Fan.FRAMES[DIRECTION.RIGHT], this.strength, true);
		this.sprite.animations.add('blowLeft', Fan.FRAMES[DIRECTION.LEFT], this.strength, true);
		return this.sprite
	}

	switchPower(on: boolean){
		super.switchPower(on);
		if(this.isPowered){
			this.sprite.play(this.direction === DIRECTION.RIGHT ? 'blowRight' : 'blowLeft')
		} else {
			this.sprite.frame = Fan.FRAMES[this.direction][0];
		}
	}

	update(){
		super.update();
		if(this.isPowered){
			let blowzone = new Phaser.Rectangle(this.sprite.x, this.sprite.y-50, this.range, 100);
			if(this.direction === DIRECTION.LEFT) blowzone.x -= this.range;
			for(let sprite of level.sprites){
				if(sprite !== this.sprite && blowzone.contains(sprite.centerX, sprite.centerY)){
					let distance = Math.abs(sprite.x - this.sprite.x);
					let acceleration = this.strength / sprite.body.mass * (this.range - distance) / this.range
					sprite.body.velocity.x += acceleration * (this.direction === DIRECTION.LEFT ? -1 : 1);
				}
			}
		}
	}
}

export class Laser extends Machine {
	key="laser_machine";
	width=32;
	height=32;
	direction: DIRECTION4 = DIRECTION4.RIGHT;
	laserColor: COLOR = COLOR.RED;
	ray: Phaser.Sprite

	static FRAMES = {
		[DIRECTION4.LEFT]: [0, 2],
		[DIRECTION4.RIGHT]: [4,6],
		[DIRECTION4.TOP]: [5,7],
		[DIRECTION4.BOTTOM]: [1,3],
	}
	static RAY_FRAMES = {
		[COLOR.YELLOW]: [0,4],
		[COLOR.GREEN]: [1,5],
		[COLOR.RED]: [2,6],
		[COLOR.BLUE]: [3,7]
	}

	switchPower(on: boolean){
		super.switchPower(on);
		this.sprite.frame = Laser.FRAMES[this.direction][on ? 0 : 1]
		let isHorizontal = this.direction === DIRECTION4.LEFT || this.direction === DIRECTION4.RIGHT;
		if(on){
			this.ray = game.add.sprite(0,0, 'laser_ray');
			level.levelSprites.push(this.ray);
			this.ray.frame = Laser.RAY_FRAMES[this.laserColor][isHorizontal ? 1 : 0]

			if(isHorizontal){
				this.ray.crop(new Phaser.Rectangle(0,12,32,8),false)
				this.ray.y = this.sprite.y - 4;
			}

			if(this.direction === DIRECTION4.LEFT){
				this.ray.x = 0;
				this.ray.width = this.sprite.x - this.sprite.offsetX;
			}
			if(this.direction === DIRECTION4.RIGHT){
				this.ray.x = this.sprite.x - this.sprite.offsetX + this.sprite.width;
				this.ray.width = game.world.width - this.ray.x;
			}
			this.updateRay()
		} else if(this.ray){
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
				let overlappingSprites = level.sprites.filter(
					s => s.x > this.ray.x
						&& s !== this.ray
						&& s !== this.sprite
						&& s.overlap(this.ray)
				)
				let closestObstacle = overlappingSprites.sort((a,b) => a.x - b.x)[0]
				let obstacleX = closestObstacle ? closestObstacle.x + closestObstacle.offsetX : game.world.width
				this.ray.width = obstacleX - this.ray.x + errorMargin;
			}
			if (this.direction === DIRECTION4.LEFT) {
				this.ray.width = this.sprite.x - this.sprite.position.x;
				this.ray.x = 0;
				let overlappingSprites = level.sprites.filter(
					s => s.x < this.sprite.x
						&& s !== this.ray
						&& s !== this.sprite
						&& s.overlap(this.ray)
				)
				let closestObstacle = overlappingSprites.sort((a,b) => b.x - a.x)[0]
				let obstacleX = closestObstacle ? closestObstacle.x + closestObstacle.width - closestObstacle.offsetX : 0
				this.ray.x = obstacleX  - errorMargin;
				this.ray.width = this.sprite.x - this.sprite.offsetX - this.ray.x + errorMargin;
			}
		}
	}

	getRayCollisionPoint() {

		for(let sprite of level.sprites){
			sprite.overlap(this.ray)
		}
	}
}