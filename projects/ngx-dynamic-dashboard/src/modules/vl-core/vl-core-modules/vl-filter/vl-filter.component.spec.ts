import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VlFilterComponent } from './vl-filter.component';

describe('VlFilterComponent', () => {
  let component: VlFilterComponent;
  let fixture: ComponentFixture<VlFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VlFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VlFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
