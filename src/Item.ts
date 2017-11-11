declare var game: Phaser.Game;

export const DEBUG_HITBOX = false;

export class Item {
	spriteMaterial: Phaser.Physics.P2.Material;
	key: String;

	constructor() {
		this.spriteMaterial = game.physics.p2.createMaterial('spriteMaterial');
	}

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = game.add.sprite(x, y, this.key);
		game.physics.p2.enable(sprite, DEBUG_HITBOX);
		sprite.body.setMaterial(this.spriteMaterial);
		return sprite;
	}
}

export class Ball extends Item {
	constructor(public key: string, public bboxRadius: number) {
		super();
	}

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = super.spawn(x, y);
		sprite.body.setCircle(this.bboxRadius);
		return sprite;
	}
}

export class Box extends Item {
	constructor(public key: string, public width: number, public height: number) {
		super();
	}

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = super.spawn(x, y);
		sprite.body.setRectangle(this.width, this.height);
		return sprite;
	}
}

export class StaticItem extends Item {
	constructor() {
		super();
	}

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = super.spawn(x, y);
		sprite.body.dynamic = false;
		return sprite;
	}
}
