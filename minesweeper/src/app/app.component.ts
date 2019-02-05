import { Component, OnInit } from '@angular/core';
import { GameService } from './service/game.service';
import { GameFieldModel, GameFieldEnum } from './model/game.enum';
import { TouchSequence } from 'selenium-webdriver';
import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'minesweeper';

  gameMap: GameFieldModel[][];
  endOfGame = false;
  timeInSec = 0;
  allBombs = 0;
  timerSubscription: Subscription;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    console.log('init');
    this.newGame();
  }

  newGame() {
    if (this.timerSubscription !== undefined) { this.timerSubscription.unsubscribe(); }
    this.gameMap = this.gameService.generateMap(9, 9, 10);
    this.allBombs = 10;
    this.endOfGame = false;
    console.log(this.gameMap);
    this.timerSubscription = timer(0, 1000).subscribe((val) => this.timeInSec = val);
  }

  selectField(item: GameFieldModel, rowIndex: number, columnIndex: number) {
    console.log('right click');
    if (!this.endOfGame) {
      if (item.isSelected) { this.allBombs++; } else { this.allBombs--; }
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
        this.gameFinnish();
        alert('vesztettél');
      } else {
        this.gameService.showEmptyNeighbours(rowIndex, columnIndex, this.gameMap);
      }

      if (this.gameService.isLastClick(this.gameMap)) {
        this.gameFinnish();
        alert('Nyertél');
      }
    } else {
      alert('kezdj új játékot');
    }
  }

  gameFinnish() {
    this.gameMap.map(e =>
      e.map(el => el.isClicked = (el.value === GameFieldEnum.BOMB || el.isClicked))
    );
    this.timerSubscription.unsubscribe();
    this.endOfGame = true;
  }



}
