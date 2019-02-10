import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LoginDataModel, GameConfig } from '../model/game.model';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Input() loginData: LoginDataModel;
  @Output() loginDataChange = new EventEmitter<LoginDataModel>();
  config: GameConfig[];
  boardSize: number;
  bombsCount: number;

  constructor(private service: GameService) {
    this.service.readConfigJson().subscribe(val => {
      this.config = val;
    });
  }

  selectSize(boardSize: number, bombsCount: number) {
    this.boardSize = boardSize;
    this.bombsCount = bombsCount;
  }

  startGame() {
    this.loginDataChange.emit({
      isLogged: true,
      boardSize: (this.boardSize === undefined) ? 9 : this.boardSize,
      bombsCount: (this.bombsCount === undefined) ? 10 : this.bombsCount
    });
  }

}
