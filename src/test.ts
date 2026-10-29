// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

beforeEach(() => {
  getTestBed().configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            params: {},
            queryParams: {},
            paramMap: convertToParamMap({}),
            queryParamMap: convertToParamMap({}),
          },
          params: of({}),
          queryParams: of({}),
          paramMap: of(convertToParamMap({})),
          queryParamMap: of(convertToParamMap({})),
          data: of({
            divisas: [],
            obrero: [],
            nacionalidad: [],
            congregacion: [],
            pais: [],
            razonSolicitud: [],
            tipoEstudio: [],
            opcionTransporte: [],
            parentesco: [],
            perfilData: null,
          }),
        },
      },
    ],
  });
});
