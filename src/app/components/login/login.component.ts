import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import {LoginService} from "../../services/login.service";
import {AuthenticationRequest} from "../../model/sharedmodel/AuthenticationRequest";
import {HttpResponse} from "@angular/common/http";
import {UserAuthenticationResponse} from "../../model/sharedmodel/UserAuthenticationResponse";
import {CookieService} from "ngx-cookie-service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
  loading=false;

  constructor(private formBuilder: FormBuilder,private loginService:LoginService,private cookieService:CookieService,private router:Router) {}

  ngOnInit(): void {
    // Initialize the form with email and password fields
    this.loginForm = this.formBuilder.group({
      userEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading=true;
      // Handle login logic here
      console.log('Form submitted:', this.loginForm.value);
      let authenticationRequest = new AuthenticationRequest();
      authenticationRequest.userEmail=this.loginForm.value.userEmail;
      authenticationRequest.password=this.loginForm.value.password;

      this.loginService.userAuthentication(authenticationRequest).subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading=false;

          if(response.status==200)
          {
            let userAuthenticationResponse !: UserAuthenticationResponse;
            userAuthenticationResponse= response.body
            this.cookieService.set("userAuthenticationResponse", JSON.stringify(userAuthenticationResponse));
            this.cookieService.set("userFullName",userAuthenticationResponse.user_full_name);
         console.log(JSON.parse(            this.cookieService.get("userAuthenticationResponse")
          ))

            this.router.navigate(['/player/ListPlayers']);  // Rediriger vers la page de connexion en cas d'erreur
          }
          else
          {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Veuillez vérifeir votre email ou votre mot de passe!",
             });
          }

        },
        error: (error) => {
          this.loading=false;
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.error,
          });
          const errorMessage = error.toString();

          console.log(error);
        },
        complete: () => {
          this.loading=false;

        }
      });
    }
  }
}
