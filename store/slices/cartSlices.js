import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCartItems = createAsyncThunk("cart/fetchCartItems", async (userId) => {
  const response = await fetch(`/api/cartt/user/${userId}`);
  if (!response.ok) {
    throw new Error("Error al cargar los elementos del carrito.");
  }
  const data = await response.json();
  return data.cartItems || [];
});

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (product, { getState }) => {
    const state = getState();
    const { userId, token } = state.auth;

    const response = await fetch("/api/cartt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ ...product, userId }),
    });

    if (!response.ok) {
      throw new Error("Error al agregar al carrito.");
    }

    const data = await response.json();
    return data.cartItem;
  }
);

export const incrementQuantity = createAsyncThunk(
  "cart/incrementQuantity",
  async (productId, { getState }) => {
    const state = getState();
    const { userId, token } = state.auth;

    const response = await fetch("/api/cartt", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        productId,
        increment: true
      }),
    });

    if (!response.ok) {
      throw new Error("Error al incrementar la cantidad.");
    }

    const data = await response.json();
    return data.cartItem;
  }
);

export const decrementQuantity = createAsyncThunk(
  "cart/decrementQuantity",
  async (productId, { getState }) => {
    const state = getState();
    const { userId, token } = state.auth;

    const response = await fetch("/api/cartt", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        productId,
        increment: false
      }),
    });

    if (!response.ok) {
      throw new Error("Error al disminuir la cantidad.");
    }

    const data = await response.json();
    return data.cartItem;
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { getState }) => {
    const state = getState();
    const { userId, token } = state.auth;

    const response = await fetch(`/api/cartt/user/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el artículo del carrito.");
    }

    return productId;
  }
);

export const clearCartItems = createAsyncThunk(
  "cart/clearCartItems",
  async (_, { getState }) => {
    const state = getState();
    const { userId, token } = state.auth;

    const response = await fetch(`/api/cartt`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error("Error al limpiar el carrito.");
    }

    return;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    isCartOpen: false,
  },
  reducers: {
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Cargar artículos del carrito
      .addCase(fetchCartItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Añadir artículo al carrito
      .addCase(addToCart.fulfilled, (state, action) => {
        const existingItem = state.items.find(item => item.id === action.payload.id);
        if (existingItem) {
          existingItem.quantity = action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
      })
      // Incrementar cantidad
      .addCase(incrementQuantity.fulfilled, (state, action) => {
        const item = state.items.find(item => item.id === action.payload.id);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      })
      // Decrementar cantidad
      .addCase(decrementQuantity.fulfilled, (state, action) => {
        const item = state.items.find(item => item.id === action.payload.id);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      })
      // Eliminar artículo del carrito
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.productId !== action.payload);
      })
      // Limpiar carrito
      .addCase(clearCartItems.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { toggleCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;
