import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternComponent } from './pattern.component';

describe('PatternComponent', () => {
  let component: PatternComponent;
  let fixture: ComponentFixture<PatternComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatternComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
