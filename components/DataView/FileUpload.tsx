import { useState } from "react";
import { processFile } from "@/lib/utils/fileProcessing";

export function FileUpload() {
	const [isUploading, setIsUploading] = useState(false);

	const handleFileUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsUploading(true);
		try {
			const processedData = await processFile(file);
			// Handle the processed data (store in state, send to parent, etc.)
		} catch (error) {
			console.error("Error processing file:", error);
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="p-4">
			<input
				type="file"
				accept=".json,.geojson,.topojson,.zip"
				onChange={handleFileUpload}
				className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
			/>
			{isUploading && <p>Processing file...</p>}
		</div>
	);
}
