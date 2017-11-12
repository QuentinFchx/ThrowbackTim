import {Pizza} from "../items/things";

declare var game: Phaser.Game;

import {Level} from '../Level';

import {Football} from '../items/balls';
import {getBouncers} from '../items/bouncers';
import {getRamps} from '../items/ramps';
import {DIRECTION, getAnimals} from '../items/animals';

export class Level1 extends Level {

	objective = "Faire tomber les 4 tortues dans le bac radioactif";

	items = [
		{ item: Football, available: 1 },
		{ item: Pizza, available: 3 }
	]

	initialize() {
		super.initialize();
	}

	restart() {
		super.restart();

		const {MetalRamp1, MetalRamp2} = getRamps();
		const {Bouncy} = getBouncers();
		const {Turtle} = getAnimals();


		const donatello = new Turtle();
		const leonardo = new Turtle();
		const raphael = new Turtle();
		const michelangelo = new Turtle();
		leonardo.lookingDir = DIRECTION.LEFT;

		const pizza = new Pizza();

		this.levelSprites.push(
			donatello.spawn(130,170),
			leonardo.spawn(1040,325),
			raphael.spawn(600,424),
			michelangelo.spawn(130,520)
		)
	}
}
