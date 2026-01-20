import { HttpInterceptorFn } from '@angular/common/http';
import { Inject, inject } from '@angular/core';
import { LoadService } from '../load.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // const busyService = inject(LoadService)
  // busyService.busy()
  // return next(req).pipe(
  //   // delay(200),
  //   finalize(() => busyService.idle()
  // )
  // );
  return next(req)
};
