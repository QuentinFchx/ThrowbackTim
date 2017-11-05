import {StaticItem} from "../Item";

export class Pipe extends StaticItem {
	constructor(tileSrc: string, public polygons: Array<Array<Array<number>>>){
		super(tileSrc);
	}

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = super.spawn(x, y);
		const body: Phaser.Physics.P2.Body = sprite.body;

		body.clearShapes();

		this.polygons.forEach(polygon => body.addPolygon(null, polygon))
		//body.data.position = [0,0];
		console.log(body);
		return sprite;
	}
}

export function getPipes(){

	const MetalPipe1 = new Pipe('metal_pipe1', [
		[ [50,0], [50,40], [36,51], [1,50], [2,47], [36,48], [48,38], [49,2] ],
		[ [95,1], [95,44], [76,76], [39,95], [0,95], [0, 92], [39,92], [74,74], [92,44], [92,0] ],
	]);

	return { MetalPipe1 }
}