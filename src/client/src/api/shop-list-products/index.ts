import { authenticatedFetch } from "../auth/authentication";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

//
// ⬇ Obtener TODOS los productos asociados a una lista
//
export async function getListProducts(
    listId: string
): Promise<{ success: boolean; items?: any[]; error?: string }> {
    try {
        const res = await authenticatedFetch(`${API_URL}/shopping-list-products/${listId}`);

        if (res.ok) {
            const data = await res.json();
            return { success: true, items: data.items };
        } else {
            const data = await res.json();
            return { success: false, error: data.error || "Failed to fetch list products" };
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch list products"
        };
    }
}

//
// ⬇ Agregar un producto a la lista
//
export async function addProductToList(
    item: {
        list_id: string;
        product_id: string;
        price?: number;
        quantity?: number;
        unit?: string;
    }
): Promise<{ success: boolean; item?: any; error?: string }> {
    try {
        const res = await authenticatedFetch(`${API_URL}/shopping-list-products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(item)
      });

        if (res.ok) {
            const data = await res.json();
            return { success: true, item: data.item };
        } else {
            const data = await res.json();
            return { success: false, error: data.error || "Failed to add product" };
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to add product"
        };
    }
}

//
// ⬇ Actualizar un producto ya existente en la lista
//
export async function updateProductInList(
    item: {
        list_id: string;
        product_id: string;
        price?: number | null;
        quantity?: number | null;
        unit?: string | null;
        is_checked?: boolean | null;
        added_at: Date;
    }
): Promise<{ success: boolean; item?: any; error?: string }> {

    console.log("ITEM ANTES DE ENVIAR →", {
      ...item,
      priceType: typeof item.price,
      quantityType: typeof item.quantity,
      unitType: typeof item.unit,
      is_checkedType: typeof item.is_checked,
      added_atType: typeof item.added_at
    });


    try {
        console.log("AUTH HEADER →", authenticatedFetch);
        const res = await authenticatedFetch(`${API_URL}/shopping-list-products`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(item)
      });


        if (res.ok) {
            const data = await res.json();
            return { success: true, item: data.item };
        } else {
            const data = await res.json();
            return { success: false, error: data.error || "Failed to update product" };
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update product"
        };
    }
}

//
// ⬇ Eliminar un producto de la lista
//
export async function deleteProductsFromList(
    listId: string,
    productId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const res = await authenticatedFetch(
            `${API_URL}/shopping-list-products/${listId}/${productId}`,
            { method: "DELETE" }
        );

        if (res.ok) {
            return { success: true };
        } else {
            const data = await res.json();
            return { success: false, error: data.error || "Failed to delete product" };
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete product"
        };
    }
}
