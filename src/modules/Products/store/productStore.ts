import { create } from "zustand";

interface ProductsState {
    barCodeScanned: string | null;

    // Actions
    setBarCodeScanned: (barCode: string) => void;
}

export const useProductStore = create<ProductsState>()((set)=>({
    barCodeScanned: null,

    // Actions
    setBarCodeScanned: (barCode: string) => set({ barCodeScanned: barCode }),
}))
