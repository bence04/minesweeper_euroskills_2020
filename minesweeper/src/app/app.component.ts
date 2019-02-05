import { Component, OnInit } from '@angular/core';
import { GameService } from './service/game.service';
import { GameFieldModel, GameFieldEnum } from './model/game.enum';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'minesweeper';

  gameMap: GameFieldModel[][];
  endOfGame = false;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    console.log('init');
    this.newGame();
  }

  newGame() {
    this.gameMap = this.gameService.generateMap(9, 9, 10);
    this.endOfGame = false;
    console.log(this.gameMap);
  }

  selectField(item: GameFieldModel, rowIndex: number, columnIndex: number) {
    console.log('right click');
    if (!this.endOfGame) {
      this.gameMap[rowIndex][columnIndex].isSelected = !item.isSelected;
    } else {
      alert('kezdj új játékot');
    }
    return false;
  }

  clickField(item: GameFieldModel, rowIndex: number, columnIndex: number) {
    console.log('left click');
    if (!this.endOfGame) {
      if (item.value === GameFieldEnum.BOMB) {
        this.gameMap.map(e =>
          e.map(el => el.isClicked = (el.value === GameFieldEnum.BOMB || el.isClicked))
        );
        this.endOfGame = true;
      } else {
        this.gameService.showEmptyNeighbours(rowIndex, columnIndex, this.gameMap);
      }
    } else {
      alert('kezdj új játékot');
    }
  }



}
