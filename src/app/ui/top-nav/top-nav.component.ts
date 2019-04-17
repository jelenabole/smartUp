import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent {

  show = false;

  constructor(public auth: AuthService){
    /*
    auth.user.subscribe((data) =>
      console.log(data)
    );
    */
  }

  toggleCollapse() {
    this.show = !this.show;
  }

}
