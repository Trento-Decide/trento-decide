"use client"

import { useRef, useMemo } from "react"
import { MapContainer, TileLayer, Marker, FeatureGroup, GeoJSON, useMapEvents } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import L from "leaflet"
import type { Feature, Geometry, GeoJsonObject } from "geojson"

import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

interface MapProps {
  value: string | null | undefined
  onChange: (val: string) => void
  drawMode?: 'marker' | 'polygon'
}

interface DrawCreatedEvent {
    layer: L.Layer & { toGeoJSON: () => GeoJsonObject };
    layerType: string;
}

function ClickHandler({ onChange }: { onChange: (val: string) => void }) {
  useMapEvents({
    click(e) {
      onChange(`${e.latlng.lat},${e.latlng.lng}`)
    },
  })
  return null
}

export default function LeafletMap({ value, onChange, drawMode = 'marker' }: MapProps) {
  const center: [number, number] = [46.0674, 11.1267]
  const featureGroupRef = useRef<L.FeatureGroup>(null)

  const markerPos = useMemo<L.LatLng | null>(() => {
    if (drawMode === 'marker' && typeof value === 'string' && value.includes(',')) {
        const [lat, lng] = value.split(',').map(Number)
        if (!isNaN(lat) && !isNaN(lng)) return new L.LatLng(lat, lng)
    }
    return null
  }, [value, drawMode])

  const polygonData = useMemo<GeoJsonObject | null>(() => {
      if (drawMode === 'polygon' && typeof value === 'string' && value.trim().length > 0) {
          try {
              return JSON.parse(value) as GeoJsonObject
          } catch (e) {
              console.error("GeoJSON non valido", e)
              return null
          }
      }
      return null
  }, [value, drawMode])

  const getGeometry = (geo: GeoJsonObject): Geometry | GeoJsonObject => {
      if (geo.type === 'Feature') {
          return (geo as Feature).geometry;
      }
      return geo;
  }

  const onCreated = (e: unknown) => {
    const event = e as DrawCreatedEvent;
    const layer = event.layer;

    if (drawMode === 'polygon') {
        if (featureGroupRef.current) {
             const layers = featureGroupRef.current.getLayers();
             layers.forEach((l) => {
                 const currentId = (l as unknown as { _leaflet_id: number })._leaflet_id;
                 const newId = (layer as unknown as { _leaflet_id: number })._leaflet_id;

                 if (currentId !== newId) {
                     featureGroupRef.current?.removeLayer(l);
                 }
             })
        }

        const geoJson = layer.toGeoJSON();
        const geometry = getGeometry(geoJson);
        
        onChange(JSON.stringify(geometry));
    }
  }

  const onDeleted = () => {
      onChange("")
  }

  return (
    <div style={{ height: "350px", width: "100%", borderRadius: "12px", overflow: "hidden", border: "1px solid #dee2e6" }}>
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FeatureGroup ref={featureGroupRef}>
            {drawMode === 'polygon' && (
                <EditControl
                    position="topright"
                    onCreated={onCreated}
                    onDeleted={onDeleted}
                    draw={{
                        rectangle: false,
                        circle: false,
                        circlemarker: false,
                        marker: false,
                        polyline: false,
                        polygon: {
                            allowIntersection: false,
                            showArea: true,
                            shapeOptions: { color: '#0d6efd' }
                        }
                    }}
                />
            )}
            
            {drawMode === 'polygon' && polygonData && (
                <GeoJSON 
                    key={JSON.stringify(polygonData)} 
                    data={polygonData} 
                    style={{ color: '#0d6efd' }} 
                />
            )}
        </FeatureGroup>

        {drawMode === 'marker' && (
            <>
                <ClickHandler onChange={onChange} />
                {markerPos && <Marker position={markerPos} icon={defaultIcon} />}
            </>
        )}

      </MapContainer>
    </div>
  )
}