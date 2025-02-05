import { create } from "zustand";

interface DataStore {
	data: any[] | null;
	setData: (data: any[]) => void;
}

export const useDataStore = create<DataStore>((set) => ({
	data: null,
	setData: (data) => set({ data }),
}));
