import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ListActions from './../../actions/list.actions';
import * as AppStateActions from './../../actions/appState.actions';
import { InitialState } from './../../states';
import { ListState } from './../../states/list.state';
import { AppStateState } from './../../states/appState.state';
import { Subscription } from 'rxjs';

import {IDot, IWeatherFavoriteItem, IWeatherResponse, ICityWeather, IWeatherItem} from './../../interfaces';
import { WeatherService } from './../../services/weatherService';
import { LoggerService } from './../../services/loggerService';
import 'zone.js';

@Component({
    selector: 'weather-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<md-card>
                    <city-search (addCity)="addNewCity($event)"></city-search>
                    <div *ngIf="list" class="row">
                        <div class="col-sm-10 col-sm-offset-1">
                        <list-table [list]="list | slice:(currentPage - 1) * linesCountPerPage : currentPage * linesCountPerPage" 
                            (setFavorite)="setFavorite($event)" (unsetFavorite)="unsetFavorite($event)" (deleteItem)="deleteCity($event)"></list-table>
                        <list-pagination [totalCount]="pageCount" [currentPage]="currentPage"
                            (setPage)="setPage($event)"></list-pagination>
                        </div>
                    </div>
                </md-card>`,
    styleUrls: ['./list.css']
})
export class WeatherListComponent implements OnInit, OnChanges {
    @Input() location: IDot;

    public readonly linesCountPerPage: number = 10;
    public list: Array<IWeatherFavoriteItem> = [];
    public pageCount: number;
    public currentPage: number = 1;
    private firstLoad: boolean = false;

    private subscription: Subscription;

    constructor(
        private ref: ChangeDetectorRef,
        private logger: LoggerService,
        private weatherService: WeatherService,
        private store: Store<InitialState>
    ) {}

    public ngOnInit() {
        this.ref.detach();

        this.subscription = this.store
            .select((s: InitialState) => s.list)
            .subscribe((data: ListState): void => {
                this.resetList(data);
            });


        // setInterval(() => {
        //     this.getFullList();
        // }, 10000);
    }

    public ngOnChanges(changes: SimpleChanges) {

        if (this.location) {
            this.getFullList();
        }
    }

    private getFullList(): void {
        this.weatherService.requestNearestWeatherData(this.location)
            .then((data: IWeatherResponse) => {

                this.store.dispatch(new ListActions.ResetAction(data.list));

                if (!this.firstLoad) {
                    this.firstLoad = true;

                    this.store.dispatch(new AppStateActions.ChangeAction('loaded'));
                }
            })
            .catch((error: Error) => {
                console.warn(error);
                this.store.dispatch(new AppStateActions.ChangeAction('error'));
            });
    }

    private resetList(list: Array<IWeatherFavoriteItem> = this.list) {
        this.list = list;
        this.pageCount = Math.ceil(this.list.length / this.linesCountPerPage);

        this.ref.markForCheck();
    }

    public setPage($event: {newPage: number}): void {
        console.log('weatherList set page', $event.newPage);
        this.currentPage = $event.newPage;
    }

    public setFavorite($event: number): void {
        let favoriteItems: Array<IWeatherFavoriteItem> = this.list.filter((item: IWeatherFavoriteItem) => {
            return item.favorite;
        });

        if (favoriteItems) {
            favoriteItems.forEach((item: IWeatherFavoriteItem) => {
                item.favorite = false;
            });
        }

        let newFavoriteItem: IWeatherFavoriteItem = this.list.find((item: IWeatherFavoriteItem) => {
            return item.id === $event;
        });

        newFavoriteItem.favorite = true;
    }

    public unsetFavorite($event: number): void {
        let newUnfavoriteItem: IWeatherFavoriteItem = this.list.find((item: IWeatherFavoriteItem) => {
            return item.id === $event;
        });

        newUnfavoriteItem.favorite = false;
    }

    public deleteCity($event: number): void {
        this.store.dispatch(new ListActions.DeleteAction($event));
    }
    
    public addNewCity($event: string): void {
       this.weatherService.getWeatherDataByCity($event)
           .then((data: ICityWeather) => {
               this.store.dispatch(new ListActions.AddAction(data));

               this.logger.log(`${data.name} was added`);
           });
    }
}