import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { userId, productId, title, price, image, quantity } = await req.json();

    const existingCartItem = await prisma.cartItem.findFirst({
      where: { userId, productId },
    });

    let cartItem;
    if (existingCartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { userId, productId, title, price, image, quantity },
      });
    }

    return NextResponse.json({ message: 'Artículo añadido al carrito', cartItem });
  } catch (error) {
    console.error("Error en el backend al añadir al carrito:", error);
    return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { userId, productId, increment } = await req.json();

    const existingCartItem = await prisma.cartItem.findFirst({
      where: { userId: parseInt(userId), productId: parseInt(productId) },
    });    

    if (!existingCartItem) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    const newQuantity = increment
      ? existingCartItem.quantity + 1
      : existingCartItem.quantity - 1;

    if (newQuantity < 1) {
      return NextResponse.json(
        { error: 'Quantity cannot be less than 1' },
        { status: 400 }
      );
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: newQuantity },
    });

    return NextResponse.json({
      message: 'Quantity updated',
      cartItem: updatedCartItem,
    });
  } catch (error) {
    console.error("Error in backend while updating item quantity:", error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    const { userId } = params;

    // Verificamos si el userId es válido y convertimos a número
    const parsedUserId = parseInt(userId);
    if (isNaN(parsedUserId)) {
      return NextResponse.json({ error: 'ID de usuario inválido' }, { status: 400 });
    }

    // Obtenemos los items del carrito del usuario
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: parsedUserId },
      select: {
        id: true,
        productId: true,
        title: true,
        price: true,
        image: true,
        quantity: true,
      },
    });

    // Devolvemos los items en formato JSON
    return NextResponse.json({ cartItems });
  } catch (error) {
    console.error("Error en el backend al obtener el carrito:", error);
    return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { userId } = await req.json(); // Extraemos userId del cuerpo de la solicitud

    // Verificamos que se recibió un userId
    if (!userId) {
      return NextResponse.json(
        { error: "Se requiere un userId válido" },
        { status: 400 }
      );
    }

    // Eliminamos todos los ítems del carrito de ese usuario
    await prisma.cartItem.deleteMany({
      where: { userId: parseInt(userId) },
    });

    return NextResponse.json({ message: "Carrito limpiado con éxito" });
  } catch (error) {
    console.error("Error al limpiar el carrito:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500 }
    );
  }
}
