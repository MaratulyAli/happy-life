import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCirculationComponent } from './create-circulation.component';

describe('CreateCirculationComponent', () => {
  let component: CreateCirculationComponent;
  let fixture: ComponentFixture<CreateCirculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCirculationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCirculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
