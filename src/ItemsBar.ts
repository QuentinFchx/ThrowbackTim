import {Item} from "./Item";

declare var game: Phaser.Game;

var timeStarted =0;

export class ItemsBar {
	timeText: Phaser.Text;
	selectedItem: Item = null;
	itemSprites: Array<Phaser.Sprite> = [];

	constructor(public items: Array<{item: Item, count: number}> = []){
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
				this.initSprites()
			}
		});

		undoButton.inputEnabled = true;
		undoButton.events.onInputDown.add(() => {
			playButton.loadTexture('button_play');
			game.paused = true;
			this.initSprites();
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

		this.initSprites();
	}

	initSprites(){
		this.clearSprites()
	}

	clearSprites(){
		for(let sprite of this.itemSprites){
			sprite.destroy();
		}
		this.itemSprites = [];
	}

	updateTime(){
		const time = new Date(Date.now() - timeStarted);
		let [m, s] = [time.getMinutes(), time.getSeconds()]
		this.timeText.text = `${m<10 ? '0'+m : m} : ${s<10 ? '0'+s : s}`
	}
}
