import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ICirculation } from 'src/app/_shared/models/circulation.model';
import { IUser } from 'src/app/_shared/models/user.model';
import { CirculationService } from 'src/app/_shared/services/circulation.service';

@Component({
  selector: 'app-circulation',
  templateUrl: './circulation.component.html',
  styleUrls: ['./circulation.component.scss']
})
export class CirculationComponent implements OnInit {
  members$!: Observable<IUser[]>;

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private circulationService: CirculationService,
  ) {
  }

  ngOnInit(): void {
    this.members$ = this.circulationService.observable.pipe(
      switchMap(
        c => this.afs.collection<IUser>(
          'users',
          ref => ref.where('circulations', 'array-contains', c.id)
        ).valueChanges()
      )
    );
  }
}
