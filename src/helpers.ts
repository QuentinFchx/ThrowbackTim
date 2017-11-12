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

export function removeInArray(arr,elm){
	arr.splice(arr.indexOf(elm), 1)
	return arr
}

export function removeAllInArray(arr,elm){
	return arr.filter(e => e!== elm)
}

export function inArray(arr, elm){
	return arr.indexOf(elm) >= 0 // TS, donne moi includes() !!!
}

export function overlap(sprite, rect){
	let bounds = sprite.getBounds();
	return bounds.x + bounds.width > rect.x
		&& bounds.x < rect.x + rect.width
		&& bounds.y + bounds.height > rect.y
		&& bounds.y < rect.y + rect.height
}

export function calcDistance(x1, y1, x2, y2){
	return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}

export function calcAngle(x1, y1, x2, y2){
	return Math.atan2(y2 - y1, x2 - x1);
}