import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { tap, map, switchMap } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';

declare var google: any;

@Injectable({
    providedIn: 'root'
})
export class GeocodeService {

    private geocoder: any;

    constructor(
        private mapLoader: MapsAPILoader
    ) { }

    private initGeocoder() {
        this.geocoder = new google.maps.Geocoder();
    }

    private waitForMapsToLoad(): Observable<boolean> {
        if (!this.geocoder) {
            return from(this.mapLoader.load())
                .pipe(
                    tap(() => this.initGeocoder()),
                    map(() => true)
                );
        }
        return of(true);
    }

    public geocodeAddress(location: string): Observable<any> {
        return this.waitForMapsToLoad().pipe(
            switchMap(() => {
                return new Observable(observer => {
                    this.geocoder.geocode({ 'address': location }, (results, status) => {
                      if (status == google.maps.GeocoderStatus.OK) {
                            observer.next({
                                lat: results[0].geometry.location.lat(),
                                lng: results[0].geometry.location.lng(),
                                address: results[0].formatted_address
                            });
                        } else {
                            console.log('Error - ', results, ' & Status - ', status);
                            observer.next({ lat: 0, lng: 0, address: '-' });
                        }
                        observer.complete();
                    });
                })
            })
        );
    }

    public getAddress(latitude: number, longitude: number): Observable<any> {
        return this.waitForMapsToLoad().pipe(
            switchMap(() => {
                return new Observable(observer => {
                    this.geocoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
                        if (status == google.maps.GeocoderStatus.OK) {
                            observer.next({ address: results[0].formatted_address });
                        } else {
                            console.log('Error - ', results, ' & Status - ', status);
                            observer.next({ address: '-' });
                        }
                        observer.complete();
                    });
                })
            })
        );
    }
}
