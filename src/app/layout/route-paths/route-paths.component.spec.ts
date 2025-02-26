import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePathsComponent } from './route-paths.component';

describe('RoutePathsComponent', () => {
  let component: RoutePathsComponent;
  let fixture: ComponentFixture<RoutePathsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutePathsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutePathsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
