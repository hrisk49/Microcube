import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pacs053 } from './pacs-053';

describe('Pacs053', () => {
  let component: Pacs053;
  let fixture: ComponentFixture<Pacs053>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pacs053]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pacs053);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
