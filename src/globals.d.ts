import {Level} from "./Level";

interface Window {
	game: Phaser.Game;
	map: Phaser.Tilemap;
}

declare var game: Phaser.Game;
declare var map: Phaser.Tilemap;
declare var level: Level;