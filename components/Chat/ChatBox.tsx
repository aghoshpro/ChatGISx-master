import { useState } from "react";
import { ModelSelector } from "./ModelSelector";
import { MessageList } from "@/components/Chat/MessageList";
import { useOllamaClient } from "@/lib/ollama/client";

interface Message {
	role: "user" | "assistant";
	content: string;
}

export function ChatBox() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [model, setModel] = useState("llama2");
	const { generateResponse } = useOllamaClient();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim()) return;

		const userMessage: Message = { role: "user", content: input };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");

		try {
			const response = await generateResponse(input, model);
			const assistantMessage: Message = {
				role: "assistant",
				content: response,
			};
			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			console.error("Error generating response:", error);
		}
	};

	return (
		<div className="flex flex-col h-screen max-h-screen">
			<div className="flex flex-col flex-1 p-4">
				<ModelSelector currentModel={model} onModelChange={setModel} />
				<div className="flex-1 overflow-y-auto mb-4">
					<MessageList messages={messages} />
				</div>
				<div className="sticky bottom-0 bg-white dark:bg-gray-800">
					<form onSubmit={handleSubmit} className="flex-shrink-0">
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className="w-full p-2 border rounded-lg dark:bg-gray-700"
							placeholder="Ask a question..."
						/>
					</form>
				</div>
			</div>
		</div>
	);
}
