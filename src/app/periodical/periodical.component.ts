import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ICirculation } from '../_shared/models/circulation.model';
import { IPeriodical } from '../_shared/models/periodical.model';
import { IUser } from '../_shared/models/user.model';

@Component({
  selector: 'app-periodical',
  templateUrl: './periodical.component.html',
  styleUrls: ['./periodical.component.scss']
})
export class PeriodicalComponent implements OnInit {
  periodical$!: Observable<IPeriodical[]>;
  allUsers$!: Observable<IUser[]>;
  circulations$!: Observable<ICirculation[]>;

  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const periodicalId = this.route.snapshot.paramMap.get('id');

    this.periodical$ = this.afs.collection<IPeriodical>(
      'periodicals',
      ref => ref.where('id', '==', periodicalId)
    ).valueChanges();

    this.allUsers$ = this.afs.collection<IUser>('users').valueChanges();

    this.circulations$ = this.afs.collection<ICirculation>(
      'circulations',
      ref => ref.where('periodicalId', '==', periodicalId)
    ).valueChanges();
  }
}
