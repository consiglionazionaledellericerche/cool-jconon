import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUser_istituti } from 'app/shared/model/user-istituti.model';

@Component({
    selector: 'jhi-user-istituti-detail',
    templateUrl: './user-istituti-detail.component.html'
})
export class User_istitutiDetailComponent implements OnInit {
    user_istituti: IUser_istituti;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ user_istituti }) => {
            this.user_istituti = user_istituti;
        });
    }

    previousState() {
        window.history.back();
    }
}
