import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'readme-page',
  templateUrl: './readme-page.component.html',
  styleUrls: ['./readme-page.component.scss'],
})
export class ReadmePageComponent {

  // XXX - "index" doesnt exist - reroute to login
  constructor(private router: Router) {
    router.navigate(['/login']);
  }
}
