import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase';
import { Observable, Operator, Subscriber } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { ICirculation } from '../_shared/models/circulation.model';
import { IPeriodical } from '../_shared/models/periodical.model';
import { IUser } from '../_shared/models/user.model';
import { CirculationService } from '../_shared/services/circulation.service';

@Component({
  selector: 'app-periodical',
  templateUrl: './periodical.component.html',
  styleUrls: ['./periodical.component.scss']
})
export class PeriodicalComponent implements OnInit {
  periodicalId!: string;
  userId!: string;
  isSubscribed$!: Observable<boolean>;
  periodical$!: Observable<IPeriodical | undefined>;
  subscribers$!: Observable<IUser[]>;
  circulations$!: Observable<ICirculation[]>;

  selected!: ICirculation;

  isMeNext$!: Observable<boolean>;

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private route: ActivatedRoute,
    public circulationService: CirculationService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.periodicalId = this.route.snapshot.paramMap.get('id') || '';
    this.userId = await this.auth.user.pipe(first()).toPromise().then(u => u?.uid) || '';

    this.isSubscribed$ = this.afs.collection<IUser>(
      'users',
      ref => ref
        .where('subscriptions', 'array-contains', this.periodicalId)
        .where('id', '==', this.userId)
    ).valueChanges().pipe(map(s => s.length > 0));

    this.periodical$ = this.afs.doc<IPeriodical>(`periodicals/${this.periodicalId}`).valueChanges();

    this.subscribers$ = this.afs.collection<IUser>(
      'users',
      ref => ref.where('subscriptions', 'array-contains', this.periodicalId)
    ).valueChanges();

    this.circulations$ = this.afs.collection<ICirculation>(
      'circulations',
      ref => ref.where('periodicalId', '==', this.periodicalId)
    ).valueChanges();

    this.isMeNext$ = this.afs.collection<ICirculation>(
      'circulations',
      ref => ref
        .where('id', '==', this.selected?.id || '')
        .where('nextUserId', '==', this.userId))
      .valueChanges().pipe(map(c => c.length > 0));
  }

  async subscribe(): Promise<void> {
    this.afs.doc(`periodicals/${this.periodicalId}`).update({
      subscribers: firebase.firestore.FieldValue.arrayUnion(this.userId)
    });
    this.afs.doc<IUser>(`users/${this.userId}`).update({
      subscriptions: firebase.firestore.FieldValue.arrayUnion(this.periodicalId)
    });
  }

  async unsubscribe(): Promise<void> {
    this.afs.doc(`periodicals/${this.periodicalId}`).update({
      subscribers: firebase.firestore.FieldValue.arrayRemove(this.userId)
    });
    this.afs.doc(`users/${this.userId}`).update({
      subscriptions: firebase.firestore.FieldValue.arrayRemove(this.periodicalId)
    });
  }

  passNext(): void {
    this.afs.collection<ICirculation>(
      'circulations',
      ref => ref.where('id', '==', this.selected.id)
    ).valueChanges({ idField: 'docId' }).pipe(
      switchMap(
        circulations => {
          const circulation = circulations[0];

          const selectedIndex = circulation.queue.findIndex(m => m === this.userId);

          if (selectedIndex === circulation.queue.length - 1) {
            return this.afs.collection('circulations').doc<ICirculation>(circulation.docId).update({
              nextUserId: undefined
            });
          }

          const nextUserId = circulation.queue[selectedIndex + 1];

          return this.afs.collection('circulations').doc<ICirculation>(circulation.docId).update({
            nextUserId
          });
        }
      )
    ).subscribe();
  }
}
