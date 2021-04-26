import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  hide = true;

  constructor(
    public auth: AngularFireAuth,
    public router: Router,
  ) { }

  ngOnInit(): void {
  }

  public async login(): Promise<void> {
    await this.auth.signInWithEmailAndPassword(
      this.email.value, this.password.value
    ).then(() => {
      this.router.navigate(['/periodicals']);
    }).catch((e: HttpErrorResponse) => console.log(e.message));
  }

  getEmailErrorMessage(): string {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Invalid email' : '';
  }

  getPasswordErrorMessage(): string {
    if (this.password.hasError('required')) {
      return 'You must enter a value';
    }

    return '';
  }
}
