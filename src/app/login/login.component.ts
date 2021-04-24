import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  constructor(
    public auth: AngularFireAuth,
    public router: Router,
  ) { }

  ngOnInit(): void {
  }

  public async login(email: string, password: string): Promise<void> {
    await this.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.router.navigate(['/periodicals']);
      })
      .catch((e: HttpErrorResponse) => console.log(e.message));
  }
}
