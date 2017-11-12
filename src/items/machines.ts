import {StaticItem} from "../Item";
import {DIRECTION} from "./animals";
import {getContactPoint} from "../helpers";

declare var game: Phaser.Game;

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
		return this.sprite;
	}

	update(){
		this.isPowered = this.powerSource && this.powerSource.isPowered;
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
		this.sprite.body.onBeginContact.add((...args) => this.onContact(getContactPoint(...args)), this);
		return this.sprite;
	}

	onContact(contactPoint) {
		let { x } = contactPoint;
		let errorMargin = 5;
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