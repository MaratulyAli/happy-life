import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ICirculation } from '../_shared/models/circulation.model';
import { IPeriodical } from '../_shared/models/periodical.model';
import { IUser } from '../_shared/models/user.model';

@Component({
  selector: 'app-create-circulation',
  templateUrl: './create-circulation.component.html',
  styleUrls: ['./create-circulation.component.scss']
})
export class CreateCirculationComponent implements OnInit {
  periodicals$!: Observable<IPeriodical[]>;

  periodicalId = '';

  uploadPercent!: Observable<number | undefined>;
  downloadURL!: Observable<string>;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    this.periodicals$ = this.afs.collection<IPeriodical>(`periodicals`).valueChanges();
  }

  uploadFile(event: any): void {
    const file = event.target.files[0];
    const filePath = file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges().pipe(
      map(p => {
        if (!p) { return 1; }

        if (p < 99) { return p; }

        return undefined;
      })
    );

    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => this.downloadURL = fileRef.getDownloadURL())
    ).subscribe();
  }

  async createCirculation(filePath: string): Promise<void> {
    const newDoc = this.afs.collection<ICirculation>('circulations').doc();

    const subscribers: IUser[] = [];

    await this.afs.collection<IUser>(
      'users',
      ref => ref
        .where('subscriptions', 'array-contains', this.periodicalId)
    ).get().toPromise().then(
      (snap) => {
        snap.forEach(s => subscribers.push(s.data()));
      }
    );

    if (subscribers.length === 0) {
      console.log('no subs');
      return;
    }

    const expiresIn = 86400 * 3;
    const createdAt = firebase.firestore.Timestamp.now().toDate();
    createdAt.setSeconds(createdAt.getSeconds() + expiresIn);
    const threeDaysAhead = firebase.firestore.Timestamp.fromDate(createdAt);

    await newDoc.set({
      id: newDoc.ref.id,
      nextDeadlineAt: threeDaysAhead,
      nextUserId: subscribers[0].id,
      periodicalId: this.periodicalId,
      filePath,
      queue: subscribers.map(s => s.id)
    });

    const users = this.afs.collection<IUser>(
      `users`,
      ref => ref.where('id', '==', this.periodicalId)
    );

    await users.get().toPromise().then(snapshots => {
      if (snapshots.size > 0) {
        snapshots.forEach(orderItem => {
          users.doc(orderItem.id).update({
            subscriptions: firebase.firestore.FieldValue.arrayUnion(newDoc.ref.id)
          });
        });
      }
    });
  }

}
