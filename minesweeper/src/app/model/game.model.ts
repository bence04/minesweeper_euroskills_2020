import { GameFieldEnum } from './game.enum';

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

export interface GameConfigModel {
  boardSize: number;
  bombsCount: number;
}
