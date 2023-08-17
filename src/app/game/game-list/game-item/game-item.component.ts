import { Component, Input } from '@angular/core';
import { Game } from '../../model/Game';

@Component({
    selector: 'app-game-item',
    templateUrl: './game-item.component.html',
    styleUrls: ['./game-item.component.scss']
})
export class GameItemComponent  {

    @Input() game: Game;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() { }

    

}
