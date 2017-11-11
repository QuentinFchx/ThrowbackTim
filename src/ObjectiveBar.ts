declare var game: Phaser.Game;

export class ObjectiveBar {

	sprite: Phaser.Sprite;
	text: Phaser.Text;

	constructor(public objective: string){
		this.sprite = game.add.sprite(0,0, 'objective_bar');

		this.text = game.add.text(0, 0, this.objective, {
			font: "bold 16px Arial",
			fill: "#fff",
			boundsAlignH: "center",
			boundsAlignV: "middle",
		});
		this.text.setTextBounds(0, 0, 1120, 64);
	}
}