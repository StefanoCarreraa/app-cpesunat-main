import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Gatekeeper} from 'gatekeeper-client-sdk';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AuthService} from '../services/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public user: any = null;
    public url = environment.url;

    constructor(
        private router: Router,
        private toastr: ToastrService,
        private _authService: AuthService
    ) {}

    async loginByAuth({email, password}) {
        try {
            const token = await Gatekeeper.loginByAuth(email, password);
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Login success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async loginByApi({email, password}) {
        this._authService.login_admin({email, password}).subscribe(
            (response) => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', response.data);
                localStorage.setItem('_id', response.data.id_colaborador);
                this.router.navigate(['/']);
                this.toastr.success('Register success');
            },
            (error) => {
                this.toastr.error('Error sesion');
            }
        );
    }

    async registerByAuth({email, password}) {
        try {
            const token = await Gatekeeper.registerByAuth(email, password);
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Register success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async loginByGoogle() {
        try {
            const token = await Gatekeeper.loginByGoogle();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Login success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async registerByGoogle() {
        try {
            const token = await Gatekeeper.registerByGoogle();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Register success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async loginByFacebook() {
        try {
            const token = await Gatekeeper.loginByFacebook();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Login success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async registerByFacebook() {
        try {
            const token = await Gatekeeper.registerByFacebook();
            localStorage.setItem('token', token);
            await this.getProfile();
            this.router.navigate(['/']);
            this.toastr.success('Register success');
        } catch (error) {
            this.toastr.error(error.message);
        }
    }

    async getProfile() {
        try {
            if (localStorage.getItem('user') !== null) {
                this.user = JSON.parse(localStorage.getItem('user'));
            } else {
                throw new Error('No inició sesión');
            }
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('_id');
        this.user = null;
        this.router.navigate(['/login']);
    }
}
