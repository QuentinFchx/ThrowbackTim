declare var game: Phaser.Game;

const DEBUG_HITBOX = false;

export class Item {
	spriteMaterial: Phaser.Physics.P2.Material;

	constructor(public tileSrc: string) {
		this.spriteMaterial = game.physics.p2.createMaterial('spriteMaterial');
	}

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = game.add.sprite(x, y, this.tileSrc);
		game.physics.p2.enable(sprite, DEBUG_HITBOX);
		sprite.body.setMaterial(this.spriteMaterial);
		return sprite;
	}
}

export class Ball extends Item {
	constructor(tileSrc: string, public bboxRadius: number) {
		super(tileSrc);
	}

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = super.spawn(x, y);
		sprite.body.setCircle(this.bboxRadius);
		return sprite;
	}
}

export class StaticItem extends Item {
	constructor(tileSrc: string) {
		super(tileSrc);
	}

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = super.spawn(x, y);
		sprite.body.dynamic = false;
		return sprite;
	}
}
