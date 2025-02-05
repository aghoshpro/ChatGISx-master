"use client";

interface ModelOption {
	id: string;
	name: string;
	description: string;
}

const AVAILABLE_MODELS: ModelOption[] = [
	{ id: "llama3.2", name: "llama 3.2", description: "Meta's Llama 2 model" },
	{ id: "mistral", name: "Mistral", description: "Mistral AI model" },
	{ id: "codellama", name: "CodeLlama", description: "Specialized for code" },
];

interface ModelSelectorProps {
	currentModel: string;
	onModelChange: (modelId: string) => void;
}

export function ModelSelector({
	currentModel,
	onModelChange,
}: ModelSelectorProps) {
	return (
		<div className="flex items-center space-x-2 mb-4">
			<label className="text-sm font-medium">Model:</label>
			<select
				value={currentModel}
				onChange={(e) => onModelChange(e.target.value)}
				className="block w-full max-w-xs rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
			>
				{AVAILABLE_MODELS.map((model) => (
					<option key={model.id} value={model.id}>
						{model.name}
					</option>
				))}
			</select>
		</div>
	);
}
