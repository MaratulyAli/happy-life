import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ICirculation } from '../_shared/models/circulation.model';
import { IPeriodical } from '../_shared/models/periodical.model';
import { IUser } from '../_shared/models/user.model';

@Component({
  selector: 'app-periodicals',
  templateUrl: './periodicals.component.html',
  styleUrls: ['./periodicals.component.scss']
})
export class PeriodicalsComponent implements OnInit {
  users$!: Observable<IUser[]>;
  periodicals$!: Observable<IPeriodical[]>;
  circulations$!: Observable<ICirculation[]>;

  constructor(private afs: AngularFirestore) {
  }

  ngOnInit(): void {
    this.users$ = this.afs.collection<IUser>('users').valueChanges();
    this.periodicals$ = this.afs.collection<IPeriodical>('periodicals').valueChanges();
    this.circulations$ = this.afs.collection<ICirculation>('circulations').valueChanges();
  }
}
