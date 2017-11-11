declare var game: Phaser.Game;

import {Level} from '../Level';

import {getBalls} from '../items/balls';
import {getBouncers} from '../items/bouncers';
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
		const { Bouncy } = getBouncers();

		this.sprites.push(
			Football.spawn(430, 140)

	)

		/*
		game.input.onTap.add((pointer: Phaser.Pointer) => {
			Football.spawn(pointer.x, pointer.y);
		}, this);
		*/

	}
}
