import { Component, Input, OnInit } from '@angular/core';
import { GameFieldEnum } from '../model/game.enum';
import { Subscription, timer } from 'rxjs';
import { GameService } from '../service/game.service';
import {
  LoginDataModel,
  GameFieldModel,
  HighScoreModel
} from '../model/game.model';
import { HostListener } from '@angular/core';

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
  starsNumber = 0;
  screenHeight: number;
  screenWidth: number;

  constructor(private gameService: GameService) {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.starsNumber = (this.screenWidth < 800) ? 200 : 600;
  }

  ngOnInit() {
    this.highScore = this.gameService.getHighscore();
    this.initMap();
  }

  /**
   * Start new game
   */
  newGame() {
    this.highScore = this.gameService.getHighscore();
    this.initMap();
  }

  /**
   * Inits map
   */
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
    if (this.screenWidth < 800) {
      this.boardWidth = this.loginData.boardSize === 9 ? this.loginData.boardSize * 34 : this.loginData.boardSize * 29;
    } else {
      this.boardWidth = this.loginData.boardSize === 9 ? this.loginData.boardSize * 44 : this.loginData.boardSize * 29;
    }
  }

  /**
   * Run when user right-click to element
   * @param item - Clicked element
   * @param rowIndex - Clciked element row index
   * @param columnIndex - Clciked element column index
   * @returns Disable default context menu
   */
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

  /**
   * Run when user click to element
   * @param item - Clicked element
   * @param rowIndex - Clciked element row index
   * @param columnIndex - Clciked element column index
   */
  clickField(item: GameFieldModel, rowIndex: number, columnIndex: number) {
    if (!this.endOfGame) {
      if (this.timerSubscription === undefined) {
        this.timerStart();
      }
      if (item.value === GameFieldEnum.BOMB) {
        this.showLostModal = true;
        this.showOverlay = true;
        this.gameFinnish();
      } else {
        this.gameService.showEmptyNeighbours(
          rowIndex,
          columnIndex,
          this.gameMap
        );
      }

      if (this.gameService.isLastClick(this.gameMap)) {
        this.timerSubscription.unsubscribe();
        if (
          this.highScore.length !== 0 &&
          (this.highScore.length < 5 ||
            this.timeInSec < this.highScore[this.highScore.length - 1].time)
        ) {
          this.showNewRecordModal = true;
        } else if (this.highScore.length === 0) {
          this.showNewRecordModal = true;
        } else {
          this.showWinnerdModal = true;
          this.gameFinnish();
        }
        this.showOverlay = true;
      }

      this.countFlags();
    } else {
      this.showEndOfGameModal = true;
      this.showOverlay = true;
    }
  }

  /**
   * Run when games ended
   */
  gameFinnish() {
    this.gameMap.map(e =>
      e.map(
        el => (el.isClicked = el.value === GameFieldEnum.BOMB || el.isClicked)
      )
    );
    this.allBombs = this.loginData.bombsCount;
    this.endOfGame = true;
    this.resetTimer();
  }

  /**
   * Timers start
   */
  timerStart() {
    this.timerSubscription = timer(0, 1000).subscribe(val => {
      this.timeInSec = val;
      const minutes: number = Math.floor(this.timeInSec / 60);
      this.timeDate =
        minutes.toString().padStart(2, '0') +
        ':' +
        (this.timeInSec - minutes * 60).toString().padStart(2, '0');
    });
  }

  /**
   * Reset timer and unsubscribe
   */
  resetTimer() {
    this.timerSubscription.unsubscribe();
    this.timerSubscription = undefined;
    this.timeInSec = 0;
    this.timeDate = '00:00';
  }

  /**
   * Saves new record
   */
  saveNewRecord() {
    this.userName =
      this.userName !== undefined ? this.userName : 'Unknown player';
    this.highScore.push({ name: this.userName, time: this.timeInSec });
    this.highScore = this.highScore
      .sort(function(e1, e2) {
        return e1.time - e2.time;
      })
      .slice(0, 5);
    localStorage.setItem('highscores', JSON.stringify(this.highScore));
    this.resetModals();
    this.gameFinnish();
  }

  /**
   * Hide all modals
   */
  resetModals() {
    this.showEndOfGameModal = false;
    this.showLostModal = false;
    this.showNewRecordModal = false;
    this.showOverlay = false;
    this.showWinnerdModal = false;
  }

  /**
   * Load login screen
   */
  changeBoard() {
    this.loginData.isLogged = false;
  }

  /**
   * Counts flags
   */
  countFlags() {
    let flaggedCount = 0;
    this.gameMap.forEach(val => {
      flaggedCount += val.filter(x => x.isSelected === true).length;
    });
    this.allBombs = this.loginData.bombsCount - flaggedCount;
  }
}
