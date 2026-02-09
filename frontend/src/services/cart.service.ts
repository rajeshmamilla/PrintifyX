const BASE_URL = "http://localhost:8081/api/cart";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": (token && token !== "undefined") ? token : "",
    };
};

export const cartService = {
    async getCart() {
        const response = await fetch(`${BASE_URL}`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch cart");
        return response.json();
    },

    async addItem(item: any) {
        const response = await fetch(`${BASE_URL}/items`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(item),
        });
        if (!response.ok) throw new Error("Failed to add item to cart");
    },

    async updateQuantity(itemId: number, quantity: number) {
        const response = await fetch(`${BASE_URL}/items/${itemId}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ quantity }),
        });
        if (!response.ok) throw new Error("Failed to update quantity");
    },

    async removeItem(itemId: number) {
        const response = await fetch(`${BASE_URL}/items/${itemId}`, {
            method: "DELETE",
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error("Failed to remove item");
    },

    async getCount() {
        const token = localStorage.getItem("token");
        if (!token || token === "undefined") return 0;

        const response = await fetch(`${BASE_URL}/count`, {
            headers: getHeaders(),
        });
        if (!response.ok) return 0;
        return response.json();
    },

    async checkout() {
        const response = await fetch(`${BASE_URL}/checkout`, {
            method: "POST",
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error("Failed to checkout");
        return response.json();
    },
};
