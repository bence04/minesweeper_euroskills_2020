import { Component, Input, OnInit } from '@angular/core';
import {
  GameFieldModel,
  HighScoreModel,
  GameFieldEnum,
  LoginDataModel
} from '../model/game.enum';
import { Subscription, timer } from 'rxjs';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() loginData: LoginDataModel;

  gameMap: GameFieldModel[][];
  endOfGame = false;
  userName: string;
  showNewRecordModal = false;
  timeInSec = 0;
  allBombs = 0;
  timerSubscription: Subscription;
  highScore: HighScoreModel[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.getHighscore();
    this.initMap();
  }

  newGame() {
    this.getHighscore();
    this.initMap();
  }
  initMap() {
    if (this.timerSubscription !== undefined) {
      this.resetTimer();
    }
    this.gameMap = this.gameService.generateMap(
      this.loginData.boardSize,
      this.loginData.boardSize,
      this.loginData.bombsCount
    );
    this.allBombs = 10;
    this.endOfGame = false;
  }

  selectField(item: GameFieldModel, rowIndex: number, columnIndex: number) {
    if (!this.endOfGame) {
      if (item.isSelected) {
        this.allBombs++;
      } else {
        this.allBombs--;
      }
      this.gameMap[rowIndex][columnIndex].isSelected = !item.isSelected;
    } else {
      alert('kezdj új játékot');
    }
    return false;
  }

  clickField(item: GameFieldModel, rowIndex: number, columnIndex: number) {
    if (!this.endOfGame) {
      if (this.timerSubscription === undefined) {
        this.timerSubscription = timer(0, 1000).subscribe(
          val => (this.timeInSec = val)
        );
      }
      if (item.value === GameFieldEnum.BOMB) {
        this.gameFinnish();
        alert('vesztettél');
      } else {
        this.gameService.showEmptyNeighbours(
          rowIndex,
          columnIndex,
          this.gameMap
        );
      }
      if (this.gameService.isLastClick(this.gameMap)) {
        if (this.highScore.length !== 0 && (this.highScore.length < 5 || this.timeInSec < this.highScore[this.highScore.length - 1].time)) {
          this.showNewRecordModal = true;
        } else if (this.highScore.length === 0) {
          this.showNewRecordModal = true;
        } else {
          this.gameFinnish();
        }
      }
    } else {
      alert('kezdj új játékot');
    }
  }

  gameFinnish() {
    this.gameMap.map(e =>
      e.map(
        el => (el.isClicked = el.value === GameFieldEnum.BOMB || el.isClicked)
      )
    );
    this.resetTimer();
    this.endOfGame = true;
  }

  getHighscore() {
    const getScoreStr = localStorage.getItem('highscores');
    if (getScoreStr !== null) {
      this.highScore = JSON.parse(getScoreStr);
    }
  }

  resetTimer() {
    this.timerSubscription.unsubscribe();
    this.timerSubscription = undefined;
    this.timeInSec = 0;
  }

  saveNewRecord() {
    this.highScore.push({ name: this.userName, time: this.timeInSec });
    this.highScore = this.highScore
      .sort(function(e1, e2) {
        return e1.time - e2.time;
      })
      .slice(0, 5);
    localStorage.setItem('highscores', JSON.stringify(this.highScore));
    this.showNewRecordModal = false;
    this.gameFinnish();
  }

  showModal() {
    this.showNewRecordModal = true;
  }
}
