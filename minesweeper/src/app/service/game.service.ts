import { Injectable } from '@angular/core';
import { GameFieldEnum } from '../model/game.enum';
import { HttpClient } from '@angular/common/http';
import { GameFieldModel, GameConfig, HighScoreModel } from '../model/game.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  emptyModel: GameFieldModel = {
    value: GameFieldEnum.EMPTY,
    isClicked: false,
    isSelected: false
  };
  bombModel: GameFieldModel = {
    value: GameFieldEnum.BOMB,
    isClicked: false,
    isSelected: false
  };

  constructor(private http: HttpClient) {}

  generateMap(row: number, column: number, bombs: number): GameFieldModel[][] {
    let initGameMap = new Array(row * column);
    initGameMap.fill(this.emptyModel);
    initGameMap.fill(this.bombModel, 0, bombs);
    initGameMap = this.arrayToMatrix(this.shuffleArray(initGameMap), column);
    return this.calculateFieldValue(initGameMap);
  }

  calculateFieldValue(array: GameFieldModel[][]): GameFieldModel[][] {
    return array.map((_, rowIndex: number) =>
      _.map((column: GameFieldModel, columnINdex: number) => {
        if (column.value !== GameFieldEnum.BOMB) {
          return {
            value: this.countBombs(rowIndex, columnINdex, array),
            isClicked: false,
            isSelected: false
          };
        } else {
          return {
            value: GameFieldEnum.BOMB,
            isClicked: false,
            isSelected: false
          };
        }
      })
    );
  }

  showEmptyNeighbours(row: number, col: number, board: GameFieldModel[][]): void {
    const element = board[row][col];
    if (element == null || element.isClicked) { return; }
    element.isClicked = true;
    element.isSelected = false;

    if (element.value === GameFieldEnum.EMPTY) {
      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          if (i >= 0 && i < board.length && j >= 0 && j < board.length) {
            this.showEmptyNeighbours(i, j, board);
          }
        }
      }
    }
  }

  isLastClick(board: GameFieldModel[][]): boolean {
    return board.map(row =>
      row.filter(x => x.isClicked === false && x.value !== GameFieldEnum.BOMB)
    ).filter(x => x.length !== 0).length === 0;
  }

  countBombs(row: number, col: number, board: GameFieldModel[][]): number {
    let cnt = 0;
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && i < board.length && j >= 0 && j < board.length && board[i][j].value === GameFieldEnum.BOMB) {
          cnt++;
        }
      }
    }
    return cnt;
  }

  shuffleArray(array: GameFieldEnum[]): number[] {
    return array
      .map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

  arrayToMatrix(array: GameFieldEnum[], columnLength: number) {
    return Array.from(
      { length: Math.ceil(array.length / columnLength) },
      (_, i) => array.slice(i * columnLength, i * columnLength + columnLength)
    );
  }

  /**
  * This is the foo function
  *
  * @param bar This is the bar parameter
  * @returns returns a string version of bar
  */
  getHighscore(): HighScoreModel[] {
    const getScoreStr = localStorage.getItem('highscores');
    if (getScoreStr !== null) {
      return JSON.parse(getScoreStr);
    }
    return [];
  }

  readConfigJson(): Observable<GameConfig[]> {
    return this.http.get<GameConfig[]>('./assets/config.json');
  }
}
