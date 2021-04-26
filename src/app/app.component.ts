import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { IUser } from './_shared/models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  opened = false;
  role$!: Observable<string | undefined>;

  constructor(
    public auth: AngularFireAuth,
    public fs: AngularFirestore,
    public router: Router,
  ) {
  }

  async ngOnInit(): Promise<void> {
    const user = await this.auth.user.pipe(first()).toPromise();
    this.role$ = this.fs.doc<IUser>(`users/${user?.uid}`)
      .valueChanges()
      .pipe(
        map(u => u?.role)
      );
  }

  public async logout(): Promise<void> {
    await this.auth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((e: HttpErrorResponse) => console.log(e.message));
  }
}
