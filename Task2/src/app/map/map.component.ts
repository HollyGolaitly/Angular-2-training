import { Component, Input, OnChanges, ElementRef } from '@angular/core';
import { IDot } from './../../interfaces';

@Component({
    selector: 'google-map',
    template: '<div class="map-container"></div>',
    styles: ['.map-container { height: 350px; }']
})
export class MapComponent implements OnChanges {
    @Input() location: IDot;
    private elem: HTMLElement;
    private map: google.maps.Map ;

    constructor(el: ElementRef) {
        this.elem = <HTMLElement>el.nativeElement
    }

    public ngOnChanges() {
        if (this.location) {
            this.createMap();
        }
    }

    private createMap(): void {

        this.map = new google.maps.Map(this.elem.children[0], {
            center: this.location,
            zoom: 12
        });
    }
}