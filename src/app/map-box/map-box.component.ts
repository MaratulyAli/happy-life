import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent implements OnInit {
  @Input() data!: any;

  map!: mapboxgl.Map;

  constructor(
    private r2: Renderer2,
  ) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const monument: mapboxgl.LngLatLike = [-77.0353, 38.8895];

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 12,
      center: monument
    });

    /// Add map controls
    const popup = new mapboxgl.Popup({ offset: 25 }).setText(
      'Construction on the Washington Monument began in 1848.'
    );
    const activePopup = new mapboxgl.Popup({ offset: 25 }).setText(
      'Construction on the Washington Monument began in 1848.'
    );

    const markerEl = this.r2.createElement('div');
    this.r2.addClass(markerEl, 'marker');
    const activeMarkerEl = this.r2.createElement('div');
    this.r2.addClass(activeMarkerEl, 'marker');
    this.r2.addClass(activeMarkerEl, 'active-marker');

    const marker = new mapboxgl.Marker({ element: markerEl })
      .setLngLat([-77.0353, 38.8795])
      .addTo(this.map);
    const activeMarker = new mapboxgl.Marker({ element: activeMarkerEl })
      .setLngLat(monument)
      .addTo(this.map);

    // create the marker
    marker.setPopup(popup).addTo(this.map);
    activeMarker.setPopup(activePopup).addTo(this.map);


    this.map.on('load', () => {
      this.map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [-77.0353, 38.8895],
              [-77.0353, 38.8795],
            ]
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