import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuzonReunionesComponent } from './buzon-reuniones.component';

describe('BuzonReunionesComponent', () => {
  let component: BuzonReunionesComponent;
  let fixture: ComponentFixture<BuzonReunionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuzonReunionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuzonReunionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
