declare var game: Phaser.Game;

var timeStarted =0;

export class Level {

	objective: string;
	timeText: Phaser.Text;

	initialize(){
		timeStarted = Date.now();

		const objectiveBar = game.add.sprite(0,0, 'objective_bar');
		const itemsBar = game.add.sprite(1120, 0, 'items_bar');

		const playButton = game.add.sprite(1144,12, 'button_play');
		const undoButton = game.add.sprite(1204,12, 'button_undo');

		playButton.events.onInputDown.add(e => {
			if(game.paused){
				playButton.frameName = "stop";
				game.paused = false;
			} else {
				playButton.frameName = "play";
				game.paused = true;
			}
		});

		undoButton.events.onInputDown.add(e => {
			playButton.frameName = "play";
			game.paused = true;
			this.initItems();
		})

		const objectiveText = game.add.text(0, 0, this.objective, {
			font: "bold 16px Arial",
			fill: "#fff",
			boundsAlignH: "center",
			boundsAlignV: "middle",
		});
		objectiveText.setTextBounds(0, 0, 1120, 64);
		this.timeText = game.add.text( 1158, 100, "", { fill : "#000" })
	}

	initItems(){

	}

	update(){
		const time = new Date(Date.now() - timeStarted);
		let [m, s] = [time.getMinutes(), time.getSeconds()]
		this.timeText.text = `${m<10 ? '0'+m : m} : ${s<10 ? '0'+s : s}`
	}
}
