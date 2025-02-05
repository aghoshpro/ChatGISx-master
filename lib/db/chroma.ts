import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export class ChromaManager {
	private client: ChromaClient;
	private collection: any;
	private embeddingFunction: any;

	constructor() {
		this.client = new ChromaClient();
		this.embeddingFunction = new OpenAIEmbeddingFunction();
	}

	async initialize(collectionName: string) {
		try {
			// Get or create collection
			this.collection = await this.client.getOrCreateCollection({
				name: collectionName,
				embeddingFunction: this.embeddingFunction,
			});
		} catch (error) {
			console.error("Error initializing ChromaDB:", error);
			throw error;
		}
	}

	async addDocuments(documents: Document[]) {
		const textSplitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 200,
		});

		const splits = await textSplitter.splitDocuments(documents);

		const ids = splits.map((_, i) => `doc_${i}`);
		const texts = splits.map((split) => split.pageContent);
		const metadatas = splits.map((split) => split.metadata);

		await this.collection.add({
			ids,
			documents: texts,
			metadatas,
		});
	}

	async similaritySearch(query: string, k: number = 4) {
		const results = await this.collection.query({
			queryTexts: [query],
			nResults: k,
		});

		return results.documents[0].map((doc: string, i: number) => ({
			pageContent: doc,
			metadata: results.metadatas[0][i],
		}));
	}
}
