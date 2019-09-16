import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgUpdateDemoComponent } from './ng-update-demo.component';

describe('NgUpdateDemoComponent', () => {
  let component: NgUpdateDemoComponent;
  let fixture: ComponentFixture<NgUpdateDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgUpdateDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgUpdateDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
