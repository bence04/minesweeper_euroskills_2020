import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginDataModel } from '../model/game.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input() loginData: LoginDataModel;
  @Output() loginDataChange = new EventEmitter<LoginDataModel>();
  selected = 0;

  constructor() {}

  ngOnInit() {
    console.log(this.loginData);
  }

  startGame() {
    if (this.selected === 1) {
      this.loginDataChange.emit({
        isLogged: true,
        boardSize: 9,
        bombsCount: 10
      });
    } else { // error ha nincs kiválasztva, ide else if
      this.loginDataChange.emit({
        isLogged: true,
        boardSize: 16,
        bombsCount: 40
      });
    }
  }

}
