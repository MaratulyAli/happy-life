import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    // this.users$ = this.afs.collection<IUser>('users').valueChanges();
    // this.circulations$ = this.afs.collection<ICirculation>('circulations').valueChanges();
  }
}
