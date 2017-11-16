import {Pizza} from "../items/things";

declare var game: Phaser.Game;

import {Level} from '../Level';

import {DIRECTION, DIRECTION4} from "../helpers";

import {BowlingBall, Football} from '../items/balls';
import {MetalRamp1} from '../items/ramps';
import {Turtle} from '../items/animals';
import {Fan, Laser, PowerSwitch} from "../items/machines";
import {Rocket} from "../items/inflammable";

export class Level1 extends Level {

	objective = "Drop the four turtles into the radioactive tank";

	items = [
		{ item: BowlingBall, available: 1 },
		{ item: Football, available: 5 },
		{ item: Pizza, available: 3 },
		{ item: MetalRamp1, available: 1 }
	]

	initialize() {
		super.initialize();
		game.stage.backgroundColor = "#4c9bbf";
	}

	restart() {
		super.restart();

		const donatello = new Turtle();
		const leonardo = new Turtle();
		const raphael = new Turtle();
		const michelangelo = new Turtle();
		leonardo.lookingDir = DIRECTION.LEFT;

		const powerSwitchLaser = new PowerSwitch();
		powerSwitchLaser.direction = DIRECTION.RIGHT;
		const laser = new Laser();
		laser.direction = DIRECTION4.LEFT;
		laser.powerSource = powerSwitchLaser;

		const rocket = new Rocket();

		const powerSwitchFan = new PowerSwitch();
		powerSwitchFan.direction = DIRECTION.RIGHT;
		const fan = new Fan();
		fan.direction = DIRECTION.RIGHT;
		fan.powerSource = powerSwitchFan;

		this.levelSprites.push(
			donatello.spawn(130,170),
			leonardo.spawn(1040,325),
			raphael.spawn(580,424),
			michelangelo.spawn(130,420),
			powerSwitchLaser.spawn(640,848),
			laser.spawn(600,848),
			rocket.spawn(80,800),
			powerSwitchFan.spawn(335,562),
			fan.spawn(360,430)
		)
	}
}
