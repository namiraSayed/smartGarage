import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('XLDI7PNGLTN')
  const newReq = req.clone({
    setHeaders: {
       Authorization: `Bearer ${token}`,
    }
    // setHeaders: {
    //   Authorization: `Bearer ${token}`,
    //   // 'Access-Control-Allow-Origin': '*' ,
    //   // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    //   // "Access-Control-Allow-Methods": "POST,GET,PUT,DELETE",
    //   // 'Access-Control-Allow-Credentials': 'true'
    // }
  })
  return next(newReq);
};
