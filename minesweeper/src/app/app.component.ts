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

  gameMap: any[];

  constructor(private gameService: GameService) {}

  ngOnInit() {
    console.log('init');
    this.newGame();
  }

  newGame() {
    this.gameMap = this.gameService.generateMap(9, 9, 10);
    console.log(this.gameMap);
  }

  selectField(item, rowIndex, columnIndex) {
    console.log('right click');
    this.gameMap[rowIndex][columnIndex].isSelected = !item.isSelected;
    return false;
  }

  clickField(item, rowIndex, columnIndex) {
    console.log('left click');
    if (item.value === GameFieldEnum.BOMB) {
      this.gameMap.map(e =>
        e.map(el => el.isClicked = (el.value === GameFieldEnum.BOMB || el.isClicked))
      );
    } else {
      this.gameService.showEmptyNeighbours(rowIndex, columnIndex, this.gameMap);
    }
  }



}
