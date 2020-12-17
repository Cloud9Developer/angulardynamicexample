import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleBucketsComponent } from './rule-buckets.component';

describe('RuleBucketsComponent', () => {
  let component: RuleBucketsComponent;
  let fixture: ComponentFixture<RuleBucketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuleBucketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleBucketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
