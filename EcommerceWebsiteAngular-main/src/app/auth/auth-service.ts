import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, ApiResponse, ForgotPasswordResponse, ResetPassword } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth';

  private userSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.userSubject.asObservable();
  constructor() {
    // this.getUser();
  }
  private http = inject(HttpClient);

  /**
   * @param userData
   * @returns
   */
  register(userData: Partial<User>): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  /**
   *
   * @param userData
   * @returns
   */
  login(userData: User): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(`${this.baseUrl}/login`, userData)
      .pipe(tap((response) => this.userSubject.next(response.user)));
  }

  getUser() {
    return this.http.get<User>(`${this.baseUrl}/get-users`, { withCredentials: true }).subscribe({
      next: (user) => this.userSubject.next(user),
      error: () => this.userSubject.next(null),
    });
  }

  getUserRole(): string | null {
    const user = this.userSubject.value;
    return user ? user?.role : null;
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        this.userSubject.next(null);
      }),
    );
  }

  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(`${this.baseUrl}/forgotPassword`, { email });
  }

  resetPassword(resetForm: ResetPassword) {
    return this.http.post(`${this.baseUrl}/resetPassword`, resetForm);
  }

}
