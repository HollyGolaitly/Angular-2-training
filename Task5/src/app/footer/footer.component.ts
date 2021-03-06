import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-footer',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<nav class="navbar navbar-inverse">
                    <span class="navbar-text">{{today | date:'longDate'}}
                        <span *customIf="today.getDate() === 25 && today.getMonth() === 11">&nbsp;&nbsp;&nbsp;Merry Christmas!!!</span>
                    </span>
                    <a class="navbar-brand right" href="#">
                        <span class="glyphicon glyphicon-cloud right" aria-hidden="true"></span>
                        Weather in nearest places
                    </a>
                </nav>`,
    styleUrls: ['./footer.css']
})
export class FooterComponent {
    public today: Date;
    constructor() {
        this.today = new Date();
    }
}