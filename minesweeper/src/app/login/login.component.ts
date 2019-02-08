import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LoginDataModel } from '../model/game.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Input() loginData: LoginDataModel;
  @Output() loginDataChange = new EventEmitter<LoginDataModel>();
  selected = 0;

  constructor() {}

  startGame() {
    if (this.selected === 1) {
      this.loginDataChange.emit({
        isLogged: true,
        boardSize: 9,
        bombsCount: 10
      });
    } else {
      this.loginDataChange.emit({
        isLogged: true,
        boardSize: 16,
        bombsCount: 40
      });
    }
  }

}
