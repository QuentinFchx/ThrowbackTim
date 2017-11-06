import { Item } from '../Item';

export class Prey {
	name = 'ball_football';
}

export class Hunter extends Item {
	prey = 'ball_football';
	constructor(tileSrc: string, public polygon: Array<Array<number>>) {
		super(tileSrc);
	}

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = super.spawn(x, y);
		const body: Phaser.Physics.P2.Body = sprite.body;

		body.clearShapes();
		body.addPolygon(null, this.polygon);

		setInterval(this.hunt, 1000);

		return sprite;
	}

	hunt() {
		const preys = game.world.getAll('key', this.prey);
		console.log(preys);
	}
}

export function getHunters() {
	const Turtle = new Hunter('hunter', [[0, 0], [20, 0], [20, 20], [0, 20]]);

	return {
		Turtle
	};
}
