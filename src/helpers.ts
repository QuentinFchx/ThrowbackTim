declare var game: Phaser.Game;

export function getContactPoint(
	bodyA: Phaser.Physics.P2.Body,
	bodyB: p2.Body,
	shapeA: p2.Shape,
	shapeB: p2.Shape,
	equation: p2.ContactEquation[]
): {x: number, y: number} {

	let pos = equation[0].bodyA.position;
	let pt = equation[0].contactPointA;

	let cx = game.physics.p2.mpxi(pos[0] + pt[0]);
	let cy = game.physics.p2.mpxi(pos[1] + pt[1]);

	return { x: cx, y: cy }
}

