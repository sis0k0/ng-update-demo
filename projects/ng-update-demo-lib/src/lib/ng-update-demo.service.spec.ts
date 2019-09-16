import { TestBed } from '@angular/core/testing';

import { NgUpdateDemoService } from './ng-update-demo.service';

describe('NgUpdateDemoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgUpdateDemoService = TestBed.get(NgUpdateDemoService);
    expect(service).toBeTruthy();
  });
});
