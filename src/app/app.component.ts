import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  opened = false;

  constructor(
    public auth: AngularFireAuth,
    public router: Router,
  ) {
  }

  public async logout(): Promise<void> {
    await this.auth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((e: HttpErrorResponse) => console.log(e.message));
  }
}
