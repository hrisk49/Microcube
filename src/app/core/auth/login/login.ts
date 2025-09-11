import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  standalone: true,
  styleUrl: './login.scss'
})
export class Login implements OnInit {

  http = inject(HttpClient);
  fb = inject(FormBuilder);
  router = inject(Router);

  frmGroup: FormGroup;
  loginError: boolean = false;
  coreBaseUrl: string = environment.coreBaseUrl;
  terminalIp: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  ngOnInit(): void {
    this.frmGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    
    // Get IP address when component initializes
    this.getClientIP();
  }

  // Get client IP using external service
  getClientIP(): void {
    this.http.get<any>('https://api.ipify.org?format=json').subscribe({
      next: (response) => {
        this.terminalIp = response.ip;
        console.log('Client IP:', this.terminalIp);
      },
      error: (error) => {
        console.error('Error getting IP:', error);
        this.terminalIp = 'unknown';
        // Fallback to alternative service
        this.getFallbackIP();
      }
    });
  }

  
  private markFormGroupTouched(): void {
    Object.keys(this.frmGroup.controls).forEach(key => {
      this.frmGroup.get(key)?.markAsTouched();
    });
  }

  // Fallback IP service
  getFallbackIP(): void {
    this.http.get<any>('https://jsonip.com').subscribe({
      next: (response) => {
        this.terminalIp = response.ip;
        console.log('Fallback IP:', this.terminalIp);
      },
      error: (error) => {
        console.error('Fallback IP service also failed:', error);
        this.terminalIp = '127.0.0.1'; // Default fallback
      }
    });
  }

  doLogin() {
    // Check if form is valid before proceeding
    // if (this.frmGroup.invalid) {
    //   console.log('Form is invalid');
    //   this.markFormGroupTouched();
    //   return;
    // }

    let payload = this.generatePayload();
    this.loginError = false;
    this.errorMessage = '';
    this.isLoading = true;
    
    this.http.post(this.coreBaseUrl, payload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        console.log('Login response', response);
        if (response.returnValue === '1' || response.token) {
          // Store token if provided
          if (response.token) {
            localStorage.setItem('userId', this.frmGroup.value.username);
            localStorage.setItem('authToken', response.token);
          }
          this.router.navigateByUrl('/dashboard');
        } else {
          // Handle invalid login response
          console.log('Invalid login response', response);
          this.loginError = true;
          this.errorMessage = response.errorMsg || 'Invalid credentials';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.loginError = true;
        this.errorMessage = 'Login failed. Please try again.';
        console.error('Login error:', error);
      }
    });
  }

  generatePayload(): any {
    const currentDateTime = new Date().toISOString();
    
    return {
        "userId": this.frmGroup.value.username,
        "passwordString": this.frmGroup.value.password,
        "terminalIp": "192.168.20.299",
        "browser": this.getBrowserName(),
        "sessionId": this.generateSessionId(),
        "sessionTerminalIp": "192.168.10.127",
        "macAddress":"00:14:22:01:23:45",
        "appId":"3",
        "appLogInTime": "2025-08-21T10:30:00",
        "clientPCName":"DEV-PC",
        "clientMACAdd":"dddd-eeee-dddd-rrrr"
    };
  }

  // Helper methods for generating dynamic values
  private getBrowserName(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private generateSessionId(): string {
    return 'sess-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
  }

  private getClientPCName(): string {
    // Browser cannot access actual PC name, so we'll use a fallback
    return navigator.platform || 'WEB-CLIENT';
  }
}







// "userId": this.frmGroup.value.username,
// "passwordString": this.frmGroup.value.password,
// "terminalIp": this.terminalIp,
// "browser": this.getBrowserName(),
// "sessionId": this.generateSessionId(),
// "sessionTerminalIp": this.terminalIp,
// "macAddress": "00:14:22:01:23:45", 
// "appId": "3",
// "appLogInTime": currentDateTime,
// "clientPCName": this.getClientPCName(),
// "clientMACAdd": "dddd-eeee-dddd-rrrr" 