import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { LoginDataModel, GameConfigModel } from '../model/game.model';
import { GameService } from '../service/game.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @Input() loginData: LoginDataModel;
  @Output() loginDataChange = new EventEmitter<LoginDataModel>();
  readConfig: Subscription;
  config: GameConfigModel[];
  boardSize: number;
  bombsCount: number;

  constructor(private service: GameService) {}

  ngOnInit(): void {
    this.readConfig = this.service.readConfigJson().subscribe(val => {
      this.config = val;
    });
  }
  ngOnDestroy(): void {
    this.readConfig.unsubscribe();
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
