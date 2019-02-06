import { Component } from '@angular/core';
import { LoginDataModel } from './model/game.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loginData: LoginDataModel = {
    isLogged: false,
    boardSize: 0,
    bombsCount: 0
  };

  constructor() {}


}
