import { Injectable } from '@angular/core';
import { GameFieldEnum } from '../model/game.enum';
import { HttpClient } from '@angular/common/http';
import { GameFieldModel, GameConfigModel, HighScoreModel } from '../model/game.model';
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

  /**
   * Generates map
   * @param rows - number of rows
   * @param columns - number of columns
   * @param bombs - number of bombs
   * @returns Generated map {GameFieldModel[][]}
   */
  generateMap(rows: number, columns: number, bombs: number): GameFieldModel[][] {
    let initGameMap = new Array(rows * columns);
    initGameMap.fill(this.emptyModel);
    initGameMap.fill(this.bombModel, 0, bombs);
    initGameMap = this.arrayToMatrix(this.shuffleArray(initGameMap), columns);
    return this.calculateFieldValue(initGameMap);
  }

  /**
   * Calculates field value
   * @param array Game board array
   * @returns calculated GameFieldModel[][]
   */
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

  /**
   * Shows empty neighbours
   * @param row - Clicked element row index
   * @param col - Clicked element column index
   * @param board - Board matrix GameFieldModel[][]
   */
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

  /**
   * Determines whether last click is
   * @param board - Board matrix GameFieldModel[][]
   * @returns true if last click
   */
  isLastClick(board: GameFieldModel[][]): boolean {
    return board.map(row =>
      row.filter(x => x.isClicked === false && x.value !== GameFieldEnum.BOMB)
    ).filter(x => x.length !== 0).length === 0;
  }

  /**
   * Counts bombs
   * @param row - Actual element row index
   * @param col - Actual element column index
   * @param board - Board matrix GameFieldModel[][]
   * @returns Number of bombs
   */
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

  /**
   * Shuffle array elements
   * @param array - Game map array GameFieldEnum[]
   * @returns Shuffled GameFieldEnum[]
   */
  shuffleArray(array: GameFieldEnum[]): number[] {
    return array
      .map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

  /**
   * Convert GameFieldEnum array to matrix
   * @param array - Game map array GameFieldEnum[]
   * @param columnLength - number
   * @returns  GameFieldEnum[][]
   */
  arrayToMatrix(array: GameFieldEnum[], columnLength: number) {
    return Array.from(
      { length: Math.ceil(array.length / columnLength) },
      (_, i) => array.slice(i * columnLength, i * columnLength + columnLength)
    );
  }

  /**
   * Read highscore array from localstorage
   * @returns HighScoreModel[]
   */
  getHighscore(): HighScoreModel[] {
    const getScoreStr = localStorage.getItem('highscores');
    if (getScoreStr !== null) {
      return JSON.parse(getScoreStr);
    }
    return [];
  }

  /**
   * Read config json
   * @returns Observable<GameConfigModel[]>
   */
  readConfigJson(): Observable<GameConfigModel[]> {
    return this.http.get<GameConfigModel[]>('./assets/config.json');
  }
}
