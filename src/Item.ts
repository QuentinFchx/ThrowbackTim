export class Item {
	public Sprite: Phaser.Sprite;

	constructor(public tileSrc: string){

	}

	spawn(x: number, y: number): Phaser.Sprite {
		return game.add.sprite(x, y, this.tileSrc)
	}
}

export class DynamicItem extends Item {

	public spriteMaterial: Phaser.Physics.P2.Material;

	constructor(tileSrc: string) {
		super(tileSrc);
		this.spriteMaterial = game.physics.p2.createMaterial('spriteMaterial');
	}

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = super.spawn(x, y);
		game.physics.p2.enable(sprite);
		sprite.body.setMaterial(this.spriteMaterial);
		return sprite;
	}
}

export class Ball extends DynamicItem {
	constructor(tileSrc: string, public bboxRadius: number){
		super(tileSrc);
	}

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = super.spawn(x, y);
		sprite.body.setCircle(this.bboxRadius);
		return sprite;
	}
}