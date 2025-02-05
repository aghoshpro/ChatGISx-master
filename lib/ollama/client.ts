const OLLAMA_API_HOST = process.env.OLLAMA_API_HOST || "http://localhost:11434";

export const useOllamaClient = () => {
	const generateResponse = async (prompt: string, model: string) => {
		try {
			const response = await fetch(`${OLLAMA_API_HOST}/api/generate`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					model,
					prompt,
					stream: false,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to generate response");
			}

			const data = await response.json();
			return data.response;
		} catch (error) {
			console.error("Error calling Ollama:", error);
			throw error;
		}
	};

	return { generateResponse };
};
