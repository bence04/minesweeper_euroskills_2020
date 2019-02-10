import { Component, Input, OnInit } from '@angular/core';
import {
  GameFieldModel,
  HighScoreModel,
  GameFieldEnum,
  LoginDataModel
} from '../model/game.enum';
import { Subscription, timer } from 'rxjs';
import { GameService } from '../service/game.service';
import { componentFactoryName } from '@angular/compiler';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() loginData: LoginDataModel;

  /* TODO:
     config json (map méret, bombaszám) login onnan generáljon -> bármekkora pálya
     modal component (?)
     info component (am modal)
     dokumentáció
     kommentek */

  gameMap: GameFieldModel[][];
  endOfGame = false;
  userName: string;
  showWinnerdModal = false;
  showNewRecordModal = false;
  showEndOfGameModal = false;
  showLostModal = false;
  showOverlay = false;
  timeDate = '00:00';
  timeInSec = 0;
  allBombs = 0;
  timerSubscription: Subscription;
  highScore: HighScoreModel[] = [];
  boardWidth = 0;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.highScore = this.gameService.getHighscore();
    this.initMap();
  }

  newGame() {
    this.highScore = this.gameService.getHighscore();
    this.initMap();
  }
  initMap() {
    this.resetModals();
    if (this.timerSubscription !== undefined) {
      this.resetTimer();
    }
    this.gameMap = this.gameService.generateMap(
      this.loginData.boardSize,
      this.loginData.boardSize,
      this.loginData.bombsCount
    );
    this.allBombs = this.loginData.bombsCount;
    this.endOfGame = false;
    this.boardWidth = (this.loginData.boardSize === 9) ? this.loginData.boardSize * 44 : this.loginData.boardSize * 29;
  }

  countFlags() {
    let flaggedCount = 0;
    this.gameMap.forEach(val => {
      flaggedCount += val.filter(x => x.isSelected === true).length;
    });
    this.allBombs = this.loginData.bombsCount - flaggedCount;
  }

  selectField(item: GameFieldModel, rowIndex: number, columnIndex: number) {
    if (!this.endOfGame) {
      this.gameMap[rowIndex][columnIndex].isSelected = !item.isSelected;
      this.countFlags();
    } else {
      this.showEndOfGameModal = true;
      this.showOverlay = true;
    }
    return false;
  }

  clickField(item: GameFieldModel, rowIndex: number, columnIndex: number) {
    if (!this.endOfGame) {
      if (this.timerSubscription === undefined) {
        this.timerStart();
      }
      if (item.value === GameFieldEnum.BOMB) {
        this.gameFinnish();
        this.showLostModal = true;
        this.showOverlay = true;
      } else {
        this.gameService.showEmptyNeighbours(rowIndex, columnIndex, this.gameMap);
      }
      this.countFlags();
      if (this.gameService.isLastClick(this.gameMap)) {
        this.showOverlay = true;
        this.timerSubscription.unsubscribe();
        if (this.highScore.length !== 0 && (this.highScore.length < 5 || this.timeInSec < this.highScore[this.highScore.length - 1].time)) {
          this.showNewRecordModal = true;
        } else if (this.highScore.length === 0) {
          this.showNewRecordModal = true;
        } else {
          this.showWinnerdModal = true;
          this.gameFinnish();
        }
      }
    } else {
      this.showEndOfGameModal = true;
      this.showOverlay = true;
    }
  }

  gameFinnish() {
    this.gameMap.map(e =>
      e.map(
        el => (el.isClicked = el.value === GameFieldEnum.BOMB || el.isClicked)
      )
    );
    this.allBombs = this.loginData.bombsCount;
    this.resetTimer();
    this.endOfGame = true;
  }

  timerStart() {
    this.timerSubscription = timer(0, 1000).subscribe(
      val => {
        this.timeInSec = val;
        const minutes: number = Math.floor(this.timeInSec / 60);
        this.timeDate = minutes.toString().padStart(2, '0') + ':' + (this.timeInSec - minutes * 60).toString().padStart(2, '0');
      }
    );
  }

  resetTimer() {
    this.timerSubscription.unsubscribe();
    this.timerSubscription = undefined;
    this.timeInSec = 0;
    this.timeDate = '00:00';
  }

  saveNewRecord() {
    this.highScore.push({ name: this.userName, time: this.timeInSec });
    this.highScore = this.highScore.sort(function(e1, e2) {
      return e1.time - e2.time;
    }).slice(0, 5);
    localStorage.setItem('highscores', JSON.stringify(this.highScore));
    this.resetModals();
    this.gameFinnish();
  }

  resetModals() {
    this.showEndOfGameModal = false;
    this.showLostModal = false;
    this.showNewRecordModal = false;
    this.showOverlay = false;
    this.showWinnerdModal = false;
  }

  changeBoard() {
    this.loginData.isLogged = false;
  }

}
