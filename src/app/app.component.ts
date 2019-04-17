import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  ifQuizSelected = true;

  constructor(public auth: AuthService) {
    this.ifQuizSelected = true;
  }

  triggerMenu() {
    this.ifQuizSelected = !this.ifQuizSelected;
  }

  triggerMenuWith(show: boolean) {
    this.ifQuizSelected = show;
  }

  logout() {
    this.auth.signOut();
  }

}
