import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ICirculation } from '../models/circulation.model';

@Injectable({
  providedIn: 'root'
})
export class CirculationService {
  private circulationSub = new Subject<ICirculation>();
  public circulation$: Observable<ICirculation>;

  constructor() {
    this.circulation$ = this.circulationSub.asObservable();
  }

  next(circulation: ICirculation): void {
    this.circulationSub.next(circulation);
  }
}
