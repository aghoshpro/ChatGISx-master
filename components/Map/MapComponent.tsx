"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDataStore } from "@/store/dataStore";
import L from "leaflet";

export default function MapComponent() {
	const { data } = useDataStore();
	const mapRef = useRef<L.Map | null>(null);
	const geoJSONLayerRef = useRef<L.GeoJSON | null>(null);

	useEffect(() => {
		// Fix Leaflet default icon issue
		delete (L.Icon.Default.prototype as any)._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconRetinaUrl: "/leaflet/marker-icon-2x.png",
			iconUrl: "/leaflet/marker-icon.png",
			shadowUrl: "/leaflet/marker-shadow.png",
		});
	}, []);

	useEffect(() => {
		if (!mapRef.current) return;

		try {
			if (data) {
				console.log("Received GeoJSON data:", data);

				// Remove existing GeoJSON layer if it exists
				if (geoJSONLayerRef.current) {
					geoJSONLayerRef.current.removeFrom(mapRef.current);
				}

				// Create new GeoJSON layer
				geoJSONLayerRef.current = L.geoJSON(data).addTo(mapRef.current);
				const bounds = geoJSONLayerRef.current.getBounds();

				if (bounds.isValid()) {
					mapRef.current.fitBounds(bounds);
				} else {
					console.warn("Invalid bounds for GeoJSON data");
				}
			}
		} catch (error) {
			console.error("Error handling GeoJSON data:", error);
		}
	}, [data]);

	// Default view for world map when no data is loaded
	const defaultCenter = [0, 0];
	const defaultZoom = 2;

	return (
		<div style={{ height: "500px", width: "100%" }}>
			<MapContainer
				center={defaultCenter as [number, number]}
				zoom={defaultZoom}
				style={{ height: "100%", width: "100%" }}
				ref={mapRef}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
			</MapContainer>
		</div>
	);
}
