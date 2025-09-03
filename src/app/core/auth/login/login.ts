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

  ngOnInit(): void {
    this.frmGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  doLogin() {
    this.loginError = false;
    // this.router.navigateByUrl('/dashboard');
    this.http.post(this.coreBaseUrl + 'auth/login', this.frmGroup.value).subscribe((response: any) => {
      if (response.status) {
        this.router.navigateByUrl('/dashboard');
      } else this.loginError = true;
    }, error => {
      this.loginError = true;
    })
  }

}
