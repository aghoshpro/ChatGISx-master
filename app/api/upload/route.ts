import { NextRequest, NextResponse } from "next/server";
import { processFile } from "@/lib/utils/fileProcessing";
import { ChromaManager } from "@/lib/db/chroma";

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Process the file
		const processedData = await processFile(file);

		// Store in ChromaDB for vector search
		const chromaManager = new ChromaManager();
		await chromaManager.initialize("uploaded-data");

		// Convert processed data to documents
		const documents = Array.isArray(processedData.features)
			? processedData.features.map((feature) => ({
					pageContent: JSON.stringify(feature.properties),
					metadata: {
						geometry: feature.geometry,
						type: feature.type,
					},
			  }))
			: [
					{
						pageContent: JSON.stringify(processedData),
						metadata: { type: "json" },
					},
			  ];

		await chromaManager.addDocuments(documents);

		return NextResponse.json({
			success: true,
			data: processedData,
		});
	} catch (error) {
		console.error("Upload API error:", error);
		return NextResponse.json(
			{ error: "Failed to process file" },
			{ status: 500 }
		);
	}
}

export const config = {
	api: {
		bodyParser: false,
	},
};
