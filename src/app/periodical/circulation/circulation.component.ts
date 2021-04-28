import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
  c!: ICirculation;

  constructor(
    private afs: AngularFirestore,
    private circulationService: CirculationService,
  ) {
  }

  ngOnInit(): void {
    this.members$ = this.circulationService.circulation$.pipe(
      map(
        c => { this.c = c; console.log('c', c); return c; }
      ),
      switchMap(
        (c: ICirculation) => this.afs.collection<IUser>(
          'users',
          ref => ref.where('circulations', 'array-contains', c.id)
        ).valueChanges()
      ),
    );
  }
}
