import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ICirculation } from 'src/app/_shared/models/circulation.model';
import { IUser } from 'src/app/_shared/models/user.model';

@Component({
  selector: 'app-circulation',
  templateUrl: './circulation.component.html',
  styleUrls: ['./circulation.component.scss']
})
export class CirculationComponent implements OnInit {
  @Input() data!: ICirculation;
  members$!: Observable<IUser[]>;

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }
}
