import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {CookieService} from "ngx-cookie-service";
import {UserAuthenticationResponse} from "../model/sharedmodel/UserAuthenticationResponse";

@Injectable()
export class UserInterceptorInterceptor implements HttpInterceptor {

  constructor(private cookieService:CookieService) {}
getToken():string
{
  if(this.cookieService.get("userAuthenticationResponse")) {
    console.log(JSON.parse(this.cookieService.get("userAuthenticationResponse")).access_token)
        return JSON.parse(this.cookieService.get("userAuthenticationResponse")).access_token;


  }
return ""
}
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.getToken();
    if(token !== "" && token !== null ) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(request)
    }

    return next.handle(request);
  }
}
