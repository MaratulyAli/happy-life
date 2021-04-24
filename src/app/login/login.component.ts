import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  constructor(public auth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  login(email: string, password: string): void {
    this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(): void {
    this.auth.signOut();
  }
}
