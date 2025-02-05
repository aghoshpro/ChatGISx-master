"use client";

import { useState } from "react";
import { useDataStore } from "@/store/dataStore";

export function FileUpload() {
	const [file, setFile] = useState<File | null>(null);
	const { setData } = useDataStore();

	const handleFileUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setFile(file);

		try {
			const text = await file.text();
			const jsonData = JSON.parse(text);
			setData(jsonData);
		} catch (error) {
			console.error("Error parsing file:", error);
			alert("Please upload a valid JSON file with location data");
		}
	};

	return (
		<div className="p-4 border rounded-lg bg-white shadow-sm">
			<h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-blue-600/100">
				Upload Data
			</h2>
			<input
				type="file"
				accept=".json"
				onChange={handleFileUpload}
				className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
			/>
			{file && (
				<p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>
			)}
		</div>
	);
}
