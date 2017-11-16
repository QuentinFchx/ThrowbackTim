import {StaticItem} from "../Item";

export class Ramp extends StaticItem {
	key: string;
	bbox: Array<number>;

	spawn(x: number, y: number): Phaser.Sprite {
		const sprite = super.spawn(x, y);
		sprite.anchor.set(0.5,0.5);
		const body: Phaser.Physics.P2.Body = sprite.body;
		body.static = true;
		body.clearShapes();
		body.loadPolygon(null, [{ "shape": this.bbox }])
		return sprite;
	}
}

export class MetalRamp1 extends Ramp {
	key = 'metal_ramp1'
	bbox = [ 82,0, 96,14, 14,96, 0,82 ]
}

export class MetalRamp2 extends Ramp {
	key = 'metal_ramp2'
	bbox = [ 14,0, 96,82, 82, 96, 0,14 ]
}