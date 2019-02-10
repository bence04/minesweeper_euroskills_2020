import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HighScoreComponent } from './high-score/high-score.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    LoginComponent,
    HighScoreComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
