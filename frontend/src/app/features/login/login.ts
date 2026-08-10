import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize } from "rxjs/operators";
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit, OnDestroy {

  email = '';
  password = '';

  isLoading = false;

  errorMessage = '';
  successMessage = '';

  showPassword = false;
  rememberMe = false;

  private destroy$ = new Subject<void>();


  constructor(
    private authService: Auth,
    private router: Router
  ) {}


  ngOnInit(): void {

    // Already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/leads']);
      return;
    }


    // Load saved email
    const savedEmail = localStorage.getItem('savedEmail');

    if (savedEmail) {
      this.email = savedEmail;
      this.rememberMe = true;
    }

  }



  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }



  onLogin(): void {

    this.errorMessage = '';
    this.successMessage = '';


    if (!this.email || !this.password) {

      this.errorMessage =
        'Please enter email and password';

      return;
    }


    if (!this.email.includes('@')) {

      this.errorMessage =
        'Please enter a valid email';

      return;
    }


    this.isLoading = true;


    this.authService
      .login(
        this.email,
        this.password
      )
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({

        next: (response) => {


          console.log(
            'Login successful:',
            response
          );


          // Save email if remember checked
          if (this.rememberMe) {

            localStorage.setItem(
              'savedEmail',
              this.email
            );

          } else {

            localStorage.removeItem(
              'savedEmail'
            );

          }



          this.successMessage =
            'Login successful!';


          this.isLoading = false;



          // Go to leads page

          this.router.navigate([
            '/leads'
          ]);

        },


        error: (error) => {


          console.error(
            'Login failed:',
            error
          );


          this.isLoading = false;



          if (error.status === 401) {

            this.errorMessage =
              'Invalid email or password';

          }

          else if (error.status === 0) {

            this.errorMessage =
              'Cannot connect to server';

          }

          else {

            this.errorMessage =
              error.error?.message ||
              'Login failed';

          }

        }

      });

  }




  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }

}