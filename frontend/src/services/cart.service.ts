import { fetchWithAuth } from "./apiClient";

const BASE_URL = "/cart";

export const cartService = {
    async getCart() {
        const response = await fetchWithAuth(`${BASE_URL}`);
        if (!response.ok) throw new Error("Failed to fetch cart");
        return response.json();
    },

    async addItem(item: any) {
        const response = await fetchWithAuth(`${BASE_URL}/items`, {
            method: "POST",
            body: JSON.stringify(item),
        });
        if (!response.ok) throw new Error("Failed to add item to cart");
    },

    async updateQuantity(itemId: number, quantity: number) {
        const response = await fetchWithAuth(`${BASE_URL}/items/${itemId}`, {
            method: "PATCH",
            body: JSON.stringify({ quantity }),
        });
        if (!response.ok) throw new Error("Failed to update quantity");
    },

    async removeItem(itemId: number) {
        const response = await fetchWithAuth(`${BASE_URL}/items/${itemId}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to remove item");
    },

    async getCount() {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined") return 0;

        const response = await fetchWithAuth(`${BASE_URL}/count`);
        if (!response.ok) return 0;
        return response.json();
    },

    async checkout() {
        const response = await fetchWithAuth(`${BASE_URL}/checkout`, {
            method: "POST",
        });
        if (!response.ok) throw new Error("Failed to checkout");
        return response.json();
    },
};
