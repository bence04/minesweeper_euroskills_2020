import { Component, OnInit } from '@angular/core';
import { GameService } from './service/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'minesweeper';

  constructor(private gameService: GameService) {}

  ngOnInit() {
    console.log('init');
    this.gameService.generateMap(9, 9, 10);
  }





}
