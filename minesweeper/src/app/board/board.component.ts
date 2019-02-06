import { Component } from '@angular/core';
import { GameFieldModel, HighScoreModel, GameFieldEnum } from '../model/game.enum';
import { Subscription, timer } from 'rxjs';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {

  gameMap: GameFieldModel[][];
  endOfGame = false;
  timeInSec = 0;
  allBombs = 0;
  timerSubscription: Subscription;
  highScore: HighScoreModel[] = [];

  constructor(private gameService: GameService) {}

  newGame() {
    this.getHighscore();
    if (this.timerSubscription !== undefined) { this.timerSubscription.unsubscribe(); }
    this.gameMap = this.gameService.generateMap(9, 9, 10);
    this.allBombs = 10;
    this.endOfGame = false;
    this.timerSubscription = timer(0, 1000).subscribe((val) => this.timeInSec = val);
  }

  selectField(item: GameFieldModel, rowIndex: number, columnIndex: number) {
    if (!this.endOfGame) {
      if (item.isSelected) { this.allBombs++; } else { this.allBombs--; }
      this.gameMap[rowIndex][columnIndex].isSelected = !item.isSelected;
    } else {
      alert('kezdj új játékot');
    }
    return false;
  }

  clickField(item: GameFieldModel, rowIndex: number, columnIndex: number) {
    if (!this.endOfGame) {
      if (item.value === GameFieldEnum.BOMB) {
        this.gameFinnish();
        alert('vesztettél');
      } else {
        this.gameService.showEmptyNeighbours(rowIndex, columnIndex, this.gameMap);
      }
      if (this.gameService.isLastClick(this.gameMap)) {
        this.gameFinnish();
        this.highScore.push({name: 'asd', time: this.timeInSec});
        const sortedHighScore = this.highScore.sort(function(e1, e2) {
          return e1.time - e2.time;
        }).slice(0, 5);
        localStorage.setItem('highscores', JSON.stringify(sortedHighScore));
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

  getHighscore() {
    const getScoreStr = localStorage.getItem('highscores');
    if (getScoreStr !== null) {
      this.highScore = JSON.parse(getScoreStr);
    }
  }


}
