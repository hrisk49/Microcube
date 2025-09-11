import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentDateFormatComponent } from './moment-date-format.component';

describe('MomentDateFormatComponent', () => {
  let component: MomentDateFormatComponent;
  let fixture: ComponentFixture<MomentDateFormatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MomentDateFormatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MomentDateFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
