import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {


  http = inject(HttpClient);
  fb = inject(FormBuilder);
  router = inject(Router);

  frmGroup: FormGroup;
  loginError: boolean = false;

  ngOnInit(): void {
    this.frmGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  doLogin() {
    this.loginError = false;
    this.http.post('http://localhost:8096/swiftCoreAccess/api/v1/auth/login', this.frmGroup.value).subscribe((response: any) => {
      if (response.status) {
        this.router.navigateByUrl('/dashboard');
      } else this.loginError = true;
    }, error => {
      this.loginError = true;
    })
  }

}
