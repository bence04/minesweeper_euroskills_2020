import { Injectable } from '@angular/core';
import { GameFieldEnum, GameFieldModel } from '../model/game.enum';

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

  gameMap: GameFieldModel[];

  constructor() {}

  generateMap(row: number, column: number, bombs: number) {
    let initGameMap = new Array(row * column);
    initGameMap.fill(this.emptyModel);
    initGameMap.fill(this.bombModel, 0, bombs);
    initGameMap = this.arrayToMatrix(this.shuffleArray(initGameMap), column);

    this.gameMap = this.calculateFieldValue(initGameMap);
  }

  calculateFieldValue(array: any[]) {
    return array.map((_, rowIndex: number) =>
      _.map((column: GameFieldModel, columnINdex: number) => {
        if (column.value !== GameFieldEnum.BOMB) {
           return {
            value: this.countBombs(rowIndex, columnINdex, array),
            isClicked: false,
            isSelected: false
          };
        } else { return column; }
      })
    );
  }

  countBombs(row: number, col: number, board: GameFieldModel[]) {
    let cnt = 0;
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && i < 9 && j >= 0 && j < 9) {
          if (board[i][j].value === GameFieldEnum.BOMB) {
            cnt++;
          }
        }
      }
    }
    return cnt;
  }

  shuffleArray(array: GameFieldEnum[]) {
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
}
