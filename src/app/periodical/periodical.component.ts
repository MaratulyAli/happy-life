import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ICirculation } from '../_shared/models/circulation.model';
import { IUser } from '../_shared/models/user.model';

@Component({
  selector: 'app-periodical',
  templateUrl: './periodical.component.html',
  styleUrls: ['./periodical.component.scss']
})
export class PeriodicalComponent implements OnInit {
  users$!: Observable<IUser[]>;
  circulations$!: Observable<ICirculation[]>;

  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const periodicalId = this.route.snapshot.paramMap.get('id');

    this.circulations$ = this.afs.collection<ICirculation>(
      'circulations',
      ref => ref.where('periodicalId', '==', periodicalId)
    ).valueChanges().pipe(
      switchMap(c => {
        const items = c[0]?.queue;

        if (!items) {
          return of(c);
        }

        this.users$ = this.afs.collection<IUser>(
          'users', ref => ref.where('id', 'in', items.map(i => i.userId))
        ).valueChanges();

        return of(c);
      })
    );
  }
}
