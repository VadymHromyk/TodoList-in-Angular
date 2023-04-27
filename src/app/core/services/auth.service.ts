import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { CommonResponse } from '../models/core.codels'
import { ResultCodeEnum } from '../enums/resultCode.enum'
import { Router } from '@angular/router'
import { LoginRequestData, MeResponse } from '../models/auth.models'
import { EMPTY, catchError, map } from 'rxjs'
import { NotificationService } from './notification.service'

@Injectable()
export class AuthService {
  isAuth = false

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  login(data: Partial<LoginRequestData>) {
    this.http
      .post<CommonResponse<{ userId: number }>>(`${environment.baseUrl}/auth/login`, data)
      .pipe(catchError(this.errorHandler.bind(this)))
      .subscribe(res => {
        if (res.resultCode === ResultCodeEnum.success) {
          this.router.navigate(['/'])
        } else {
          this.notificationService.handleError(res.messages[0])
        }
      })
  }

  logout() {
    this.http
      .delete<CommonResponse>(`${environment.baseUrl}/auth/login`)
      .pipe(catchError(this.errorHandler.bind(this)))
      .subscribe(res => {
        if (res.resultCode === ResultCodeEnum.success) {
          this.router.navigate(['/login'])
        } else {
          this.notificationService.handleError(res.messages[0])
        }
      })
  }

  me() {
    return this.http
      .get<CommonResponse<MeResponse>>(`${environment.baseUrl}/auth/me`)
      .pipe(catchError(this.errorHandler.bind(this)))
      .pipe(
        map(res => {
          const isSuccess = res.resultCode === ResultCodeEnum.success
          if (isSuccess) {
            this.isAuth = true
          } else {
            this.notificationService.handleError(res.messages[0])
          }
          return isSuccess
        })
      )
  }

  private errorHandler(err: HttpErrorResponse) {
    this.notificationService.handleError(err.message)
    return EMPTY
  }
}
