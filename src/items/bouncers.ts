import { StaticItem } from '../Item';

export class Bouncer extends StaticItem {
	bounceFactor = 1.5;

	constructor(tileSrc: string, public polygon: Array<Array<number>>) {
		super(tileSrc);
	}

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = super.spawn(x, y);
		const body: Phaser.Physics.P2.Body = sprite.body;

		body.clearShapes();
		body.addPolygon(null, this.polygon);
		body.onBeginContact.add(onContact, this);

		return sprite;
	}
}

function onContact(body, bodyB, shapeA, shapeB, equations: p2.ContactEquation[]) {
	const contactEquation = equations[0];
	const isTopSurface = contactEquation.contactPointA[0] === 0;
	if (isTopSurface) contactEquation.restitution = this.bounceFactor;
}

export function getBouncers() {
	const Bouncy = new Bouncer('bouncer', [[0, 0], [60, 0], [60, 20], [0, 20]]);

	return {
		Bouncy
	};
}
