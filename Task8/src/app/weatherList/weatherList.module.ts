import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { SharedModule } from './../shared/shared.module';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { reducer } from './../../reducers';

import { ListComponent } from './list/list.component';
import { WeatherListComponent } from './weatherList.component';
import { PaginationListComponent } from './pagination/pagination.component';
import { KelvinToCelsiusPipe } from './../../pipes/kelvinToCelsius';
import { CitySearchComponent } from './citySearch/citySearch.component';
import { CityWeatherPipe } from './../../pipes/cityWeatherPipe';
import { CapitalizePipe } from './../../pipes/capitalizePipe';
import { WeatherService } from './../../services/weatherService';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        StoreModule.provideStore(reducer),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        SharedModule
    ],
    exports: [WeatherListComponent],
    declarations: [
        ListComponent,
        WeatherListComponent, 
        PaginationListComponent,
        KelvinToCelsiusPipe,
        CitySearchComponent,
        CityWeatherPipe,
        CapitalizePipe
    ],
    providers: [WeatherService]
})
export class WeatherListModule {}