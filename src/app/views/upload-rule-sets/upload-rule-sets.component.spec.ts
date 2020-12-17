import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRuleSetsComponent } from './upload-rule-sets.component';

describe('ShowRuleSetsComponent', () => {
  let component: UploadRuleSetsComponent;
  let fixture: ComponentFixture<UploadRuleSetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadRuleSetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRuleSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
