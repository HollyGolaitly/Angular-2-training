import { Injectable } from '@angular/core';

@Injectable()
export class DevLoggerService {
    public log(message: string): void {
        console.log(`%c ${message}`, 'color: rebeccapurple');
    }
}


@Injectable()
export class LoggerService {

    public log(message: string): void {
        console.log(`%c ${message}`, 'color: pink');
    }
}