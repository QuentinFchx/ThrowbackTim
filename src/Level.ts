import { ItemsBar, ItemToPlace } from './ItemsBar';
import { ObjectiveBar } from './ObjectiveBar';
import { Item } from './Item';

declare var game: Phaser.Game;

interface ItemPlaced {
	item: Item;
	position: { x: number, y: number };
	sprite?: Phaser.Sprite;
}

export class Level {

	objective: string;
	levelSprites: Array<Phaser.Sprite> = [];
	playerItems: Array<ItemPlaced> = [];
	itemsBar: ItemsBar;
	objectiveBar: ObjectiveBar;
	items: Array<ItemToPlace> = [];

	initialize() {
		this.itemsBar = new ItemsBar(this.items);
		this.objectiveBar = new ObjectiveBar(this.objective);
		this.restart();
	}

	get sprites(): Array<Phaser.Sprite> {
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
			if (itemPlaced.sprite) itemPlaced.sprite.destroy();
			itemPlaced.sprite = itemPlaced.item.spawn(itemPlaced.position.x, itemPlaced.position.y);

			itemPlaced.sprite.inputEnabled = true;
			itemPlaced.sprite.input.enableDrag();
			itemPlaced.sprite.events.onDragStop.add((sprite, { x, y }: { x: number, y: number }) => {
				itemPlaced.position = { x, y };
			}, this);
		}
	}

	start() {
		for (let itemPlaced of this.playerItems) {
			itemPlaced.sprite.inputEnabled = false;
		}
	}

	update() {

	}

	getSpritesInZone(x1, y1, x2, y2) {
		if (x2 < x1)[x1, x2] = [x2, x1];
		if (y2 < y1)[y1, y2] = [y2, y1];

		return this.sprites.filter(sprite =>
			sprite.position.x + sprite.width >= x1
			&& sprite.position.x <= x2
			&& sprite.position.y + sprite.height >= y1
			&& sprite.position.y <= y2
		);
	}
}
