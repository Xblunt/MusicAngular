import { TestBed } from '@angular/core/testing';

import { WebSocetServiceService } from './web-socet-service.service';

describe('WebSocetServiceService', () => {
  let service: WebSocetServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocetServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
