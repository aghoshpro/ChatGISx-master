"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { TableView } from "@/components/DataView/TableView";
import { ChatBox } from "@/components/Chat/ChatBox";
import { FileUpload } from "@/components/FileUpload/FileUpload";

// Dynamically import the MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/Map/MapComponent"), {
	ssr: false,
});

export default function Home() {
	const [isDarkTheme, setIsDarkTheme] = useState(true);

	const toggleTheme = () => {
		setIsDarkTheme(!isDarkTheme);
		// Toggle theme class on document body
		document.body.classList.toggle("dark-theme");
		document.body.classList.toggle("light-theme");
	};

	return (
		<div className="quadrant-layout">
			<aside className="sidebar">
				<h1 className="app-title">ChatGIS</h1>
				<button
					onClick={toggleTheme}
					className="theme-toggle-btn"
					aria-label="Toggle theme"
				>
					{isDarkTheme ? "☀️ Light Mode" : "🌙 Dark Mode"}
				</button>
				{/* Add more sidebar content here if needed */}
			</aside>

			<main className="main-content">
				<div className="left-column space-y-4">
					<div className="map-container">
						<MapComponent />
					</div>
					<div className="table-container">
						<TableView />
					</div>
				</div>
				<div className="chat-container upload-container">
					<FileUpload />
					<ChatBox />
				</div>
			</main>
		</div>
	);
}
