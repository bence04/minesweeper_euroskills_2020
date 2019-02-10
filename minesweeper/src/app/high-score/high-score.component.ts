import { Component, OnInit, Input } from '@angular/core';
import { HighScoreModel } from '../model/game.enum';

@Component({
  selector: 'app-high-score',
  templateUrl: './high-score.component.html',
  styleUrls: ['./high-score.component.scss']
})
export class HighScoreComponent implements OnInit {
  @Input() highScore: HighScoreModel[];

  constructor() { }

  ngOnInit() {
  }

}
