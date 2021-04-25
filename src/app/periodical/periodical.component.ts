import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ICirculation } from '../_shared/models/circulation.model';
import { IPeriodical } from '../_shared/models/periodical.model';
import { IUser } from '../_shared/models/user.model';

@Component({
  selector: 'app-periodical',
  templateUrl: './periodical.component.html',
  styleUrls: ['./periodical.component.scss']
})
export class PeriodicalComponent implements OnInit {
  periodical$!: Observable<IPeriodical | undefined>;
  allUsers$!: Observable<IUser[]>;
  circulations$!: Observable<ICirculation[]>;
  isSubscribed$!: Observable<boolean>;
  periodicalId!: string;
  userId!: string;

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    this.periodicalId = this.route.snapshot.paramMap.get('id') || '';
    this.userId = await this.auth.user.pipe(first()).toPromise().then(u => u?.uid) || '';

    const periodicalRef = this.afs.doc<IPeriodical>(`periodicals/${this.periodicalId}`);
    this.periodical$ = periodicalRef.valueChanges();

    this.allUsers$ = this.afs.collection<IUser>('users').valueChanges();

    this.circulations$ = this.afs.collection<ICirculation>(
      'circulations',
      ref => ref.where('periodicalId', '==', this.periodicalId)
    ).valueChanges();

    this.isSubscribed$ = this.afs.doc(`periodicals/${this.periodicalId}/subscribers/${this.userId}`)
      .valueChanges().pipe(map(s => !!s));
  }

  async subscribe(): Promise<void> {
    this.afs.doc(`periodicals/${this.periodicalId}/subscribers/${this.userId}`).set({
      subscribedAt: firebase.firestore.Timestamp.fromDate(new Date())
    });
  }

  async unsubscribe(): Promise<void> {
    this.afs.doc(`periodicals/${this.periodicalId}/subscribers/${this.userId}`).delete();
  }
}
