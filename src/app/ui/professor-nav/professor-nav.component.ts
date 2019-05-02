import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'professor-nav',
  templateUrl: './professor-nav.component.html',
  styleUrls: ['./professor-nav.component.scss'],
})
export class ProfessorNavComponent {
  
  constructor(public auth: AuthService) {}

  logout() {
    this.auth.signOut();
  }
}