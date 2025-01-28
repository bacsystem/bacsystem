import { HttpInterceptorFn } from "@angular/common/http";
//https://github.com/gothinkster/angular-realworld-example-app/blob/main/src/app/core/interceptors/token.interceptor.ts
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const apiReq = req.clone({ url: `http://localhost:8000/admin-console/v1${req.url}` })
    return next(apiReq)
}