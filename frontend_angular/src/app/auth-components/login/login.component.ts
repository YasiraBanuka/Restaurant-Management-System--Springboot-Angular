import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth-services/auth-service/auth.service';
import { StorageService } from 'src/app/auth-services/storage-service/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  isSpinning: boolean;

  constructor(
    private service: AuthService, 
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  submitForm() {
    this.service.login(this.loginForm.value).subscribe((res) => {
      console.log(res);

      if (res.userId != null) {
        const user = {
          id: res.userId,
          role: res.userRole
        }
        console.log(user);

        StorageService.saveToken(res.jwt);
        StorageService.saveUser(user);

        if (StorageService.isAdminLoggedIn()) {
          this.router.navigateByUrl('/admin/dashboard');
        } else if (StorageService.isCustomerLoggedIn()) {
          this.router.navigateByUrl('/customer/dashboard');
        }
        
      } else {
        console.log("Wrong Credentials");
      }
    })
  }

}
