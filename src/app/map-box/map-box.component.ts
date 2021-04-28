import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as mapboxgl from 'mapbox-gl';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ICirculation } from '../_shared/models/circulation.model';
import { IUser } from '../_shared/models/user.model';
import { CirculationService } from '../_shared/services/circulation.service';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent implements OnInit, AfterViewInit {
  @ViewChild('mapElement') mapElement!: ElementRef;

  c!: ICirculation;
  map!: mapboxgl.Map;

  constructor(
    private r2: Renderer2,
    private afs: AngularFirestore,
    public circulationService: CirculationService,
  ) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.circulationService.circulation$
      .pipe(
        map(
          c => { this.c = c; console.log('c', c); return c; }
        ),
        switchMap(
          c => this.afs.collection<IUser>(
            'users',
            ref => ref.where('circulations', 'array-contains', c.id)
          ).valueChanges()
        )
      )
      .subscribe(
        members => {
          this.map = new mapboxgl.Map({
            container: this.mapElement.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom: 12,
            center: [-77.0353, 38.8895]
          });

          this.initMap(members);
        }
      );
  }

  private initMap(members: IUser[]): void {
    this.addMarkers(members);

    this.addRoutes(members);

    this.map.on('idle', () => {
      this.map.resize();
    });
  }

  private addMarkers(members: IUser[]): void {
    members.forEach(m => {
      console.log(m);

      const markerEl = this.r2.createElement('div');
      this.r2.addClass(markerEl, 'marker');

      if (this.c.nextUserId === m.id) { this.r2.addClass(markerEl, 'active-marker'); }

      const marker = new mapboxgl.Marker({ element: markerEl })
        .setLngLat([+m.location.longitude, +m.location.latitude])
        .addTo(this.map);

      const popup = new mapboxgl.Popup({ offset: 25 }).setText(
        m.firstName + ' ' + m.lastName
      );

      marker.setPopup(popup).addTo(this.map);
    });
  }

  private addRoutes(members: IUser[]): void {
    this.map.on('load', () => {
      if (this.map.getSource('route')) {
        return;
      }

      const coords = members.map(
        m => [+m.location.longitude, +m.location.latitude]
      );

      this.map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coords
          }
        }
      });

      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#888',
          'line-width': 8
        }
      });
    });
  }
}
