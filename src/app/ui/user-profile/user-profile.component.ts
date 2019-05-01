import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {
  hideButton = true;

  constructor(public auth: AuthService) {
    this.hideButton = true;
  }

  logout() {
    this.auth.signOut();
  }

  triggerButton() {
    this.hideButton = !this.hideButton;
  }
  
}