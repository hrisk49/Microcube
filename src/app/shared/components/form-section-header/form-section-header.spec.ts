import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSectionHeader } from './form-section-header';

describe('FormSectionHeader', () => {
  let component: FormSectionHeader;
  let fixture: ComponentFixture<FormSectionHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSectionHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSectionHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
