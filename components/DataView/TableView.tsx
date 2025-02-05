"use client";

import { useDataStore } from "@/store/dataStore";
import { useState } from "react";

// Add these TypeScript interfaces
interface GeoJSONFeature {
	type: string;
	properties: Record<string, any>;
	geometry: any;
}

interface GeoJSONData {
	type: string;
	features: GeoJSONFeature[];
}

export function TableView() {
	const { data } = useDataStore();
	const [horizontalScrollPosition, setHorizontalScrollPosition] = useState(0);
	const [verticalScrollPosition, setVerticalScrollPosition] = useState(0);

	// Add type guard to safely check if data is GeoJSONData
	const isGeoJSONData = (data: any): data is GeoJSONData => {
		return (
			data &&
			typeof data === "object" &&
			"type" in data &&
			"features" in data &&
			Array.isArray(data.features)
		);
	};

	// Use type guard instead of type assertion
	const geoJSONData = isGeoJSONData(data) ? data : null;

	if (!geoJSONData) {
		return (
			<div className="p-4 text-center text-gray-500">
				Please upload data to view the table
			</div>
		);
	}

	// Extract features from GeoJSON
	const features = geoJSONData.features || [];
	const properties = features.length > 0 ? features[0].properties : {};
	const columns = Object.keys(properties);

	if (features.length === 0) {
		return (
			<div className="p-4 text-center text-gray-500">
				No features found in the GeoJSON data
			</div>
		);
	}

	const handleHorizontalScroll = (e: React.ChangeEvent<HTMLInputElement>) => {
		const container = document.querySelector(".table-container");
		if (container) {
			const maxScroll = container.scrollWidth - container.clientWidth;
			const newPosition = (parseInt(e.target.value) * maxScroll) / 100;
			container.scrollLeft = newPosition;
			setHorizontalScrollPosition((newPosition / maxScroll) * 100);
		}
	};

	const handleVerticalScroll = (e: React.ChangeEvent<HTMLInputElement>) => {
		const container = document.querySelector(".table-container");
		if (container) {
			const maxScroll = container.scrollHeight - container.clientHeight;
			const newPosition = (parseInt(e.target.value) * maxScroll) / 100;
			container.scrollTop = newPosition;
			setVerticalScrollPosition((newPosition / maxScroll) * 100);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="table-container overflow-auto h-[700px]">
				<table className="min-w-full table-auto">
					<thead>
						<tr>
							{columns.map((column) => (
								<th key={column} className="px-4 py-2 bg-black-100">
									{column}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{features.map((feature, index) => (
							<tr key={index}>
								{columns.map((column) => (
									<td key={column} className="border px-2 py-2">
										{String(feature.properties[column])}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{/* <div className="flex gap-4">
				<input
					type="range"
					min="0"
					max="100"
					value={horizontalScrollPosition}
					onChange={handleHorizontalScroll}
					className="w-full"
				/>
				<input
					type="range"
					min="0"
					max="100"
					value={verticalScrollPosition}
					onChange={handleVerticalScroll}
					className="h-[500px]"
					orient="vertical"
				/>
			</div> */}
		</div>
	);
}
