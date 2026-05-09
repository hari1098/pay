import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Angular HttpClient withCredentials handles cookies automatically
  // This interceptor can add additional headers if needed
  return next(req);
};
