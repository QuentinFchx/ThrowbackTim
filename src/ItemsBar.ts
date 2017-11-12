import {Item} from "./Item";
import {Level} from "./Level";

declare var game: Phaser.Game;
declare var level: Level;

var timeStarted =0;

export interface ItemToPlace {
	item: typeof Item,
	available: number,
	count?: number,
	button?: Phaser.Button,
	textCount?: Phaser.Text
	key?: string;
}

export class ItemsBar {
	timeText: Phaser.Text;
	selectedItem: ItemToPlace = null;
	itemSpriteToPlace: Phaser.Sprite;

	constructor(public items: Array<ItemToPlace> = []){
		timeStarted = Date.now();

		game.add.sprite(1120, 0, 'items_bar');

		const playButton = game.add.sprite(1144,12, 'button_play');
		const undoButton = game.add.sprite(1204,12, 'button_undo');

		playButton.inputEnabled = true;
		playButton.events.onInputDown.add(e => {
			if(game.paused){
				playButton.loadTexture('button_restart');
				game.paused = false;
			} else {
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
		})

		this.timeText = game.add.text(0, 0, "", {
			font: "24px Arial",
			fill : "#fff",
			boundsAlignH: "center",
			boundsAlignV: "middle"
		})
		this.timeText.setTextBounds(1151,104,96,32)

		this.updateTime();
		setInterval(() => this.updateTime(), 1000);

		this.items.forEach((itemToPlace, i) => {
			itemToPlace.key = (new itemToPlace.item()).key;
			itemToPlace.button = game.add.button(1170,265 + i * 80, itemToPlace.key);
			itemToPlace.button.anchor.set(0.5,0.5);
			itemToPlace.button.tint = 0xCCCCCC;
			itemToPlace.button.onInputDown.add(() => this.selectItem(itemToPlace))
			itemToPlace.textCount = game.add.text(1220, 250 + i * 80, `x ${itemToPlace.available}`,  {
				font: "24px Arial",
				fill : "#fff",
				boundsAlignH: "center",
				boundsAlignV: "middle"
			})
		});

		this.resetItems();
		this.initInput();
	}

	resetItems(){
		this.unselectItem();
		for(let itemToPlace of this.items){
			itemToPlace.count = itemToPlace.available;
			itemToPlace.textCount.text = `x ${itemToPlace.count}`
		}
	}

	selectItem(itemToPlace: ItemToPlace){
		if(!game.paused || itemToPlace.count <= 0) return;
		this.unselectItem();
		this.selectedItem = itemToPlace;
		this.selectedItem.button.tint = 0xFFFFFF;

		if(this.itemSpriteToPlace) this.itemSpriteToPlace.destroy();
		this.itemSpriteToPlace = game.add.sprite(0,0, itemToPlace.key);
		this.itemSpriteToPlace.anchor.set(0.5, 0.5);
		this.itemSpriteToPlace.visible = false;
	}

	unselectItem(){
		if(this.selectedItem) this.selectedItem.button.tint = 0xCCCCCC;
		if(this.itemSpriteToPlace) this.itemSpriteToPlace.destroy();
		this.selectedItem = null;
	}

	updateTime(){
		const time = new Date(Date.now() - timeStarted);
		let [m, s] = [time.getMinutes(), time.getSeconds()]
		this.timeText.text = `${m<10 ? '0'+m : m} : ${s<10 ? '0'+s : s}`
	}

	initInput(){
		game.input.addMoveCallback((pointer, x, y) => {
			if(this.itemSpriteToPlace && game.paused){
				const {width, height} = this.itemSpriteToPlace;
				if(x > width/2
				&& x < (game.width - 160 - width/2)
				&& y > (64 + height/2)
				&& y < game.height - height/2
				){
					this.itemSpriteToPlace.visible = true;
					this.itemSpriteToPlace.x = x;
					this.itemSpriteToPlace.y = y;
				} else {
					this.itemSpriteToPlace.visible = false;
				}
			}
		}, this);

		game.input.onTap.add(event => {
			if(this.itemSpriteToPlace && game.paused){
				let {x,y} = event;
				const {width, height} = this.itemSpriteToPlace;

				if(x > width/2
				&& x < (game.width - 160 - width/2)
				&& y > (64 + height/2)
				&& y < game.height - height/2
				){
					const newItem = new this.selectedItem.item();
					const playerSprite = newItem.spawn(x,y);
					level.playerItems.push({
						item: newItem,
						position: {x,y},
						sprite: playerSprite
					});

					this.selectedItem.count--;
					this.selectedItem.textCount.text = `x ${this.selectedItem.count}`
					this.unselectItem();
				}
			}
		}, this);
	}
}

