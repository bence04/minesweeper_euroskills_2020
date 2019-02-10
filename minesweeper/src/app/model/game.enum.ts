export enum GameFieldEnum {
  BOMB = -1,
  EMPTY = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8
}

export interface GameFieldModel {
  value: GameFieldEnum;
  isClicked: boolean;
  isSelected: boolean;
}

export interface HighScoreModel {
  name: string;
  time: number;
}

export interface LoginDataModel {
  isLogged: boolean;
  boardSize: number;
  bombsCount: number;
}

export interface GameConfig {
  boardSize: number;
  bombsCount: number;
}
