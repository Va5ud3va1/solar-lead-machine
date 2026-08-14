import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {

    console.log("Sending login:", {
      email,
      password
    });

    return this.http
      .post<LoginResponse>(
        `${this.apiUrl}/login`,
        {
          email,
          password
        }
      )
      .pipe(
        tap(response => {

          console.log("Login response:", response);

          localStorage.setItem(
            'token',
            response.token
          );

          localStorage.setItem(
            'user',
            JSON.stringify(response.user)
          );

        })
      );
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }


  isLoggedIn(): boolean {
    return !!this.getToken();
  }

 getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
 }

 getUserRole(): string | null {
  return this.getUser()?.role ?? null;
 }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

}
