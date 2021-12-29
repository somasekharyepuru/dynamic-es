import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VlSelectComponent } from './vl-select.component';

describe('VlSelectComponent', () => {
  let component: VlSelectComponent;
  let fixture: ComponentFixture<VlSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VlSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VlSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
