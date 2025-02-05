interface Message {
	role: "user" | "assistant";
	content: string;
}

interface MessageListProps {
	messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
	return (
		<div className="flex-1 overflow-y-auto space-y-4 mb-4">
			{messages.map((message, index) => (
				<div
					key={index}
					className={`p-4 rounded-lg ${
						message.role === "user"
							? "bg-blue-100 dark:bg-blue-900 ml-auto max-w-[80%]"
							: "bg-gray-100 dark:bg-gray-800 mr-auto max-w-[80%]"
					}`}
				>
					<p className="text-sm font-semibold mb-1">
						{message.role === "user" ? "You" : "Assistant"}
					</p>
					<p className="whitespace-pre-wrap">{message.content}</p>
				</div>
			))}
		</div>
	);
}
