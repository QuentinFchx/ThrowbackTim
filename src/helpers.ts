declare var game: Phaser.Game;

export enum DIRECTION { LEFT, RIGHT };
export enum DIRECTION4 { LEFT, RIGHT, TOP, BOTTOM };
export enum COLOR { RED, GREEN, BLUE, YELLOW };

export const extractContactPoint = handler => function(bodyA,bodyB,shapeA,shapeB,equation: p2.ContactEquation[]){
	let pos = equation[0].bodyA.position;
	let pt = equation[0].contactPointA;

	let cx = game.physics.p2.mpxi(pos[0] + pt[0]);
	let cy = game.physics.p2.mpxi(pos[1] + pt[1]);

	return handler.call(this, { x: cx, y: cy })
}

export function getAbsolutePos(sprite){
	return {
		x:sprite.x - sprite.anchor.x*sprite.width,
		y:sprite.y - sprite.anchor.y*sprite.height
	}
}

export function removeInArray(arr,elm){
	arr.splice(arr.indexOf(elm), 1)
	return arr
}

export function removeAllInArray(arr,elm){
	return arr.filter(e => e!== elm)
}