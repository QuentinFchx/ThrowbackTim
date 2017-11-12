import {Item, StaticItem} from "../Item";

export class Pizza extends StaticItem {
	key = 'pizza'
	width = 69;
	height = 32;

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = super.spawn(x, y);
		sprite.body.setRectangle(this.width, this.height);
		return sprite;
	}
}