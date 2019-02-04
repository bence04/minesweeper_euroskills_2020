import { Injectable } from '@angular/core';
import { GameFieldEnum } from '../model/game.enum';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor() {}

  generateMap(row: number, column: number, bombs: number) {
    console.log('map gen');
    let gameMap = new Array(row * column);
    gameMap.fill(GameFieldEnum.EMPTY);
    gameMap.fill(GameFieldEnum.BOMB, 0, bombs);

    gameMap = this.arrayToMatrix(this.shuffleArray(gameMap), column);
    console.log(gameMap);
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
