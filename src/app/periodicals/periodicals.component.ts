import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IPeriodical } from '../_shared/models/periodical.model';

@Component({
  selector: 'app-periodicals',
  templateUrl: './periodicals.component.html',
  styleUrls: ['./periodicals.component.scss']
})
export class PeriodicalsComponent implements OnInit {
  periodicals$!: Observable<IPeriodical[]>;

  constructor(private afs: AngularFirestore) {
  }

  ngOnInit(): void {
    this.periodicals$ = this.afs.collection<IPeriodical>('periodicals').valueChanges();
  }
}
