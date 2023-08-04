import {Component, OnInit} from '@angular/core';
import {AppService} from '@services/app.service';
import {DateTime} from 'luxon';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    public user:any=null;

    public name:any ={    }

    constructor(private appService: AppService) {}

    ngOnInit(): void {
        this.user = this.appService.user;
        // console.log(this.user);
        // console.log(this.user.email);
    }

    logout() {
        this.appService.logout();
    }

    formatDate(date) {
        return DateTime.fromISO(date).toFormat('dd LLL yyyy');
    }
}
