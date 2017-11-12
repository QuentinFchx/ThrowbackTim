import {Ball} from "../Item";

export class Football extends Ball {
	key = 'ball_football';
	radius = 24;
	mass = 2;
}

export class BasketBall extends Ball {
	key = 'ball_basket'
	radius = 32
}

export class BowlingBall extends Ball {
	key = 'ball_bowling'
	radius = 32;
	mass = 5;
}

export class TennisBall extends Ball {
	key = 'ball_tennis'
	radius = 16;
	mass = 0.5;
}