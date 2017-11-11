declare var game: Phaser.Game;

import {Level} from '../Level';

import {getBalls} from '../items/balls';
import {getBouncers} from '../items/bouncers';
import {getPipes} from '../items/pipes';
import {getRamps} from '../items/ramps';

export class Level1 extends Level {

	objective = "Faire tomber les 4 tortues dans le bac radioactif";

	initialize() {
		super.initialize();
	}

	initSprites(){
		super.initSprites();

		const { Football } = getBalls();
		const { MetalRamp1, MetalRamp2 } = getRamps();
		//const { MetalPipe1 } = getPipes();
		const { Bouncy } = getBouncers();

		this.sprites.push(
			Football.spawn(430, 140),
			Football.spawn(130, 120),
			Football.spawn(630, 120),
			Football.spawn(810, 120),
			Football.spawn(1080, 140),


			MetalRamp1.spawn(400, 300),
			MetalRamp2.spawn(700, 300),

			Bouncy.spawn(700, 500)
	)

		/*
		game.input.onTap.add((pointer: Phaser.Pointer) => {
			Football.spawn(pointer.x, pointer.y);
		}, this);
		*/

	}
}
