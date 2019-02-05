import { Component, OnInit } from '@angular/core';
import { GameService } from './service/game.service';
import { GameFieldModel } from './model/game.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'minesweeper';

  gameMap: GameFieldModel[];

  constructor(private gameService: GameService) {}

  ngOnInit() {
    console.log('init');
    this.newGame();
  }

  newGame() {
    this.gameService.generateMap(9, 9, 10);
    this.gameMap = this.gameService.gameMap;
  }





}
