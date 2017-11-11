import {Pizza} from "../items/things";

declare var game: Phaser.Game;

import {Level} from '../Level';

import {getBalls} from '../items/balls';
import {getBouncers} from '../items/bouncers';
import {getRamps} from '../items/ramps';
import {DIRECTION, getAnimals} from '../items/animals';

export class Level1 extends Level {

	objective = "Faire tomber les 4 tortues dans le bac radioactif";

	initialize() {
		super.initialize();
	}

	initSprites() {
		super.initSprites();

		const {Football} = getBalls();
		const {MetalRamp1, MetalRamp2} = getRamps();
		const {Bouncy} = getBouncers();
		const {Turtle} = getAnimals();


		const donatello = new Turtle();
		const leonardo = new Turtle();
		const raphael = new Turtle();
		const michelangelo = new Turtle();
		leonardo.lookingDir = DIRECTION.LEFT;

		const pizza = new Pizza();

		this.sprites.push(
			donatello.spawn(130,170),
			leonardo.spawn(1016,325),
			raphael.spawn(600,424),
			michelangelo.spawn(130,520),
			Football.spawn(515, 315)
		)


		game.input.onTap.add((pointer: Phaser.Pointer) => {
			this.sprites.push( pizza.spawn(pointer.x, pointer.y) );
		}, this);


	}
}
