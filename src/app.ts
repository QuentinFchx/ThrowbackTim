import {getBalls} from "./items/balls";
import {getRamps} from "./items/ramps";
import {getPipes} from "./items/pipes";

const game = new Phaser.Game(1280, 960, Phaser.AUTO, 'content', {
	preload(){
		game.load.image('logo', 'assets/phaser2.png');
		game.load.image('metal_wall', 'assets/tiles/metal_wall.png');

		game.load.image('ball_football', 'assets/sprites/ball_football.png');
		game.load.image('metal_ramp1', 'assets/sprites/metal_ramp1.png');
		game.load.image('metal_ramp2', 'assets/sprites/metal_ramp2.png');
		game.load.image('metal_pipe1', 'assets/sprites/metal_pipe1.png');

		game.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
	},
	create(){
		const logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
		logo.anchor.setTo(0.5, 0.5);

		initPhysics();

		const map = game.add.tilemap('level1');
		map.addTilesetImage('metal_wall');
		map.setCollisionBetween(0, 7); // les tiles 0 à 7 gèrent les collisions
		window.map = map;

		//  Creates a new blank layer and sets the map dimensions.
		//  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
		//const layer = map.create('level', 40, 30, 32, 32);
		const layerWalls = map.createLayer('walls');
		layerWalls.resizeWorld();

		//  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
		//  This call returns an array of body objects which you can perform addition actions on if
		//  required. There is also a parameter to control optimising the map build.
		game.physics.p2.convertTilemap(map, layerWalls);

		addItems();
	},
	update(){

	},
	render(){

	}
});


function initPhysics(){
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.gravity.y = 1000;

	const worldMaterial = game.physics.p2.createMaterial('worldMaterial');

	//  4 trues = the 4 faces of the world in left, right, top, bottom order
	game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
	game.physics.p2.world.defaultMaterial = worldMaterial;

	Object.assign(game.physics.p2.world.defaultContactMaterial, {
		friction: 1.5, // Friction to use in the contact of these two materials.
		restitution: 0.65, // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
		stiffness: 1e7, // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
		relaxation: 3, // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
		// frictionStiffness: 1e7; // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
		// frictionRelaxation: 3; // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
		// surfaceVelocity: 0; // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.
	});
}

function addItems(){

	const { Football } = getBalls();
	const {MetalRamp1, MetalRamp2} = getRamps();
	const {MetalPipe1} = getPipes();

	Football.spawn(430, 100)
	Football.spawn(130, 80)
	Football.spawn(630, 50)
	Football.spawn(810, 50)
	Football.spawn(1080, 40)

	game.input.onTap.add((pointer: Phaser.Pointer) => {
		Football.spawn(pointer.x, pointer.y);
	}, this);


	MetalRamp1.spawn(400, 200)
	MetalRamp2.spawn(700, 200)

	MetalPipe1.spawn(300,250);
}

window.game = game;