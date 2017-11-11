import {Item} from "./Item";
import {ItemsBar} from "./ItemsBar";
import {ObjectiveBar} from "./ObjectiveBar";

declare var game: Phaser.Game;

export class Level {

	objective: string;
	sprites: Array<Phaser.Sprite> = [];
	itemsBar: ItemsBar;
	objectiveBar: ObjectiveBar;
	items: Array<{item: Item, count: number}> = [];

	initialize(){
		this.itemsBar = new ItemsBar(this.items);
		this.objectiveBar = new ObjectiveBar(this.objective);

		this.initSprites();
	}

	initSprites(){
		this.clearSprites()
	}

	clearSprites(){
		for(let sprite of this.sprites){
			sprite.destroy();
		}
		this.sprites = [];
	}

	update(){

	}

	getSpritesInZone(x1,y1,x2,y2){
		if(x2 < x1) [x1,x2] = [x2,x1];
		if(y2 < y1) [y1,y2] = [y2,y1];

		return this.sprites.filter(sprite =>
			sprite.position.x + sprite.width >= x1
			&& sprite.position.x <= x2
			&& sprite.position.y + sprite.height >= y1
			&& sprite.position.y <= y2
		)
	}
}
