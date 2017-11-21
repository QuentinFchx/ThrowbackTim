declare var game: Phaser.Game;

export const DEBUG_HITBOX = false;

export class Item {
	key: string;

	constructor() {
	}

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = game.add.sprite(x, y, this.key);
		game.physics.p2.enable(sprite, DEBUG_HITBOX);
		return sprite;
	}
}

export class Ball extends Item {
	radius: number = 16;
	mass: number = 1;
	gravityScale: number = 1;

	constructor() {
		super();
	}

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = super.spawn(x, y);
		sprite.width = 2 * this.radius;
		sprite.height = 2 * this.radius;
		sprite.body.setCircle(this.radius);
		sprite.body.mass = this.mass;
		sprite.body.data.gravityScale = this.gravityScale;
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
