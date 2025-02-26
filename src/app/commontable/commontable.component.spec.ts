import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommontableComponent } from './commontable.component';

describe('CommontableComponent', () => {
  let component: CommontableComponent;
  let fixture: ComponentFixture<CommontableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommontableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommontableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
