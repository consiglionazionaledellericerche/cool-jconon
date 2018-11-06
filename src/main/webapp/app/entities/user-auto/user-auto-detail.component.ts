import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUser_auto } from 'app/shared/model/user-auto.model';

@Component({
    selector: 'jhi-user-auto-detail',
    templateUrl: './user-auto-detail.component.html'
})
export class User_autoDetailComponent implements OnInit {
    user_auto: IUser_auto;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ user_auto }) => {
            this.user_auto = user_auto;
        });
    }

    previousState() {
        window.history.back();
    }
}
