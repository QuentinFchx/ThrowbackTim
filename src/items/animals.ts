import {Item} from "../Item";
import {Level} from "../Level";

declare var level: Level;
declare var game: Phaser.Game;

export enum DIRECTION { LEFT, RIGHT };

export class Animal extends Item {
	lookingDir: DIRECTION = DIRECTION.RIGHT;
	isWalking: Boolean = false;
	width: Number;
	height: Number;

	sprite: Phaser.Sprite;
	speed = 100;

	constructor() {
		super();

	}

	spawn(x: number, y: number): Phaser.Sprite {
		this.sprite = super.spawn(x,y);
		this.sprite.body.setRectangle(this.width, this.height);
		this.sprite.update = () => this.update();

		this.sprite.animations.add('walkLeft', [0,1,2], 4, true);
		this.sprite.animations.add('walkRight', [3,4,5], 4, true);
		this.sprite.animations.add('idleLeft', [1]);
		this.sprite.animations.add('idleRight', [4]);

		this.idle();

		return this.sprite
	}

	walk(){
		this.sprite.animations.play(this.lookingDir === DIRECTION.RIGHT ? 'walkRight' : 'walkLeft');
		this.isWalking = true;
	}

	idle(){
		this.sprite.animations.play(this.lookingDir === DIRECTION.RIGHT ? 'idleRight' : 'idleLeft')
		this.isWalking = false;
	}

	update(){
		//game.debug.spriteInfo(this.sprite);

		if(this.isWalking && this.sprite.body.angle > -30 && this.sprite.body.angle < 30){
			if(this.lookingDir === DIRECTION.RIGHT){
				this.sprite.body.moveRight(this.speed)
			} else {
				this.sprite.body.moveLeft(this.speed)
			}
		}

		let eye = {
			x: this.lookingDir === DIRECTION.RIGHT ? this.sprite.position.x + 50 : this.sprite.position.x - 5,
			y: this.sprite.position.y+ 10
		}
		const pizza = level.getSpritesInZone(
			eye.x,
			eye.y - 15,
			eye.x + 500 * (this.lookingDir === DIRECTION.RIGHT ? 1 : -1),
			eye.y + 15
		).find((sprite: Phaser.Sprite) => {
			return sprite.key === "pizza"
		});

		if(pizza && !this.isWalking) this.walk()
		else if(!pizza && this.isWalking) this.idle();
	}
}


export function getAnimals() {
	class Turtle extends Animal {
		key = "turtle";
		width = 45;
		height = 30;
		speed = 50;
	}

	return {
		Turtle
	};
}