declare var game: Phaser.Game;

export const DEBUG_HITBOX = false;

export class Item {
	spriteMaterial: Phaser.Physics.P2.Material;
	key: string;

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
	radius: number = 16;
	mass: number = 1;

	constructor() {
		super();
	}

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = super.spawn(x, y);
		sprite.body.setCircle(this.radius);
		sprite.body.mass = this.mass;
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
