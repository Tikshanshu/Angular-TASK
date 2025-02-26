import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopsPointComponent } from './stops-point.component';

describe('StopsPointComponent', () => {
  let component: StopsPointComponent;
  let fixture: ComponentFixture<StopsPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StopsPointComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopsPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
