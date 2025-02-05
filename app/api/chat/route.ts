import { NextRequest, NextResponse } from "next/server";
import { ChromaManager } from "@/lib/db/chroma";
import { useOllamaClient } from "@/lib/ollama/client";

export async function POST(req: NextRequest) {
	try {
		const { message, model, context } = await req.json();

		// Initialize ChromaDB and Ollama
		const chromaManager = new ChromaManager();
		await chromaManager.initialize("chat-context");
		const { generateResponse } = useOllamaClient();

		// Get relevant context from vector store
		const relevantDocs = await chromaManager.similaritySearch(message);
		const contextText = relevantDocs.map((doc) => doc.pageContent).join("\n");

		// Generate response with context
		const prompt = `Context: ${contextText}\n\nQuestion: ${message}\n\nAnswer:`;
		const response = await generateResponse(prompt, model);

		return NextResponse.json({ response });
	} catch (error) {
		console.error("Chat API error:", error);
		return NextResponse.json(
			{ error: "Failed to process chat request" },
			{ status: 500 }
		);
	}
}
