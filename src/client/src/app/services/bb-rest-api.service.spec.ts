/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BbRestApiService } from './bb-rest-api.service';

describe('BbRestApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BbRestApiService]
    });
  });

  it('should ...', inject([BbRestApiService], (service: BbRestApiService) => {
    expect(service).toBeTruthy();
  }));
});
