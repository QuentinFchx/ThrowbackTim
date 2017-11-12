import {Pizza} from "../items/things";

declare var game: Phaser.Game;

import {Level} from '../Level';

import {BowlingBall, Football} from '../items/balls';
import {getBouncers} from '../items/bouncers';
import {getRamps} from '../items/ramps';
import {DIRECTION, getAnimals} from '../items/animals';
import {PowerSwitch} from "../items/machines";

export class Level1 extends Level {

	objective = "Faire tomber les 4 tortues dans le bac radioactif";

	items = [
		{ item: BowlingBall, available: 1 },
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

		const powerSwitch = new PowerSwitch();
		powerSwitch.direction = DIRECTION.RIGHT;

		this.levelSprites.push(
			donatello.spawn(130,170),
			leonardo.spawn(1040,325),
			raphael.spawn(600,424),
			michelangelo.spawn(130,520),

			powerSwitch.spawn(640,848)
		)
	}
}
