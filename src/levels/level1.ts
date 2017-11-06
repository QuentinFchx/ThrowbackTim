import { Level } from '../Level';

import { getBalls } from '../items/balls';
import { getBouncers } from '../items/bouncers';
import { getHunters } from '../items/hunters_preys';
import { getPipes } from '../items/pipes';
import { getRamps } from '../items/ramps';

export class Level1 implements Level {
	initialize() {
		const { Football } = getBalls();
		const { MetalRamp1, MetalRamp2 } = getRamps();
		const { MetalPipe1 } = getPipes();
		const { Bouncy } = getBouncers();
		const { Turtle } = getHunters();

		Football.spawn(430, 100);
		Football.spawn(130, 80);
		Football.spawn(630, 50);
		Football.spawn(810, 50);
		Football.spawn(1080, 40);

		game.input.onTap.add((pointer: Phaser.Pointer) => {
			Football.spawn(pointer.x, pointer.y);
		}, this);

		MetalRamp1.spawn(400, 200);
		MetalRamp2.spawn(700, 200);

		MetalPipe1.spawn(300, 250);

		Bouncy.spawn(500, 500);

		Turtle.spawn(130, 400);
	}
}
