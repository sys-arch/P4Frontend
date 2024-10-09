import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoblefactorComponent } from './doblefactor.component';

describe('DoblefactorComponent', () => {
  let component: DoblefactorComponent;
  let fixture: ComponentFixture<DoblefactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoblefactorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoblefactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
