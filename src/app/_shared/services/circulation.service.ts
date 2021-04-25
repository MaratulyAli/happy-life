import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ICirculation } from '../models/circulation.model';

@Injectable({
  providedIn: 'root'
})
export class CirculationService {
  private subject = new Subject<ICirculation>();
  public observable: Observable<ICirculation>;

  constructor() {
    this.observable = this.subject.asObservable();
  }

  next(circulation: ICirculation): void {
    this.subject.next(circulation);
  }
}
