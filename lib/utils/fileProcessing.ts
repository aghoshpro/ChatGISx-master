import JSZip from "jszip";
import * as shapefile from "shapefile";
import * as turf from "@turf/turf";

export async function processFile(file: File) {
	const fileType = getFileType(file.name);

	switch (fileType) {
		case "json":
		case "geojson":
		case "topojson":
			return await processJSONFile(file);
		case "zip":
			return await processShapefile(file);
		default:
			throw new Error("Unsupported file type");
	}
}

async function processJSONFile(file: File) {
	const text = await file.text();
	const json = JSON.parse(text);

	if (isGeoJSON(json)) {
		return json;
	} else {
		// Convert regular JSON to GeoJSON if it contains coordinates
		return convertToGeoJSON(json);
	}
}

async function processShapefile(file: File) {
	const zip = new JSZip();
	const zipContents = await zip.loadAsync(file);

	// Extract required files
	const shpFile = zipContents.file(/\.shp$/i)[0];
	const dbfFile = zipContents.file(/\.dbf$/i)[0];

	if (!shpFile || !dbfFile) {
		throw new Error("Invalid shapefile archive");
	}

	// Convert to ArrayBuffer
	const shpBuffer = await shpFile.async("arraybuffer");
	const dbfBuffer = await dbfFile.async("arraybuffer");

	// Read shapefile
	const geojson = await shapefile.read(shpBuffer, dbfBuffer);
	return geojson;
}

function getFileType(filename: string): string {
	const extension = filename.split(".").pop()?.toLowerCase();
	return extension || "";
}

function isGeoJSON(json: any): boolean {
	return json.type === "FeatureCollection" || json.type === "Feature";
}

function convertToGeoJSON(json: any) {
	// Basic conversion logic - extend as needed
	const features = [];

	for (const item of Array.isArray(json) ? json : [json]) {
		if (item.latitude && item.longitude) {
			features.push({
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: [parseFloat(item.longitude), parseFloat(item.latitude)],
				},
				properties: { ...item },
			});
		}
	}

	return {
		type: "FeatureCollection",
		features,
	};
}
