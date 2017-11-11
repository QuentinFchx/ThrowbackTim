import {StaticItem} from "../Item";

export class Ramp extends StaticItem {
	constructor(public key: string, public polygon: Array<Array<number>>){
		super();
	}

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = super.spawn(x, y);
		const body: Phaser.Physics.P2.Body = sprite.body;

		body.clearShapes();
		body.addPolygon(null, this.polygon)
		return sprite;
	}
}

export function getRamps(){

	const MetalRamp1 = new Ramp('metal_ramp1', [ [78,0], [96,18], [18,96], [0,76] ]);
	const MetalRamp2 = new Ramp('metal_ramp2', [ [18,0], [96,77], [78, 96], [0,18] ]);

	return { MetalRamp1, MetalRamp2 }
}