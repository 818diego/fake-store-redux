import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { userId } = params;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: parseInt(userId) },
    });

    return NextResponse.json({ cartItems });
  } catch (error) {
    console.error("Error en el backend al obtener el carrito:", error);
    return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { userId } = params;
    const { productId } = await req.json();

    // Busca y elimina el artículo del carrito con el userId y productId especificados
    const deletedItem = await prisma.cartItem.deleteMany({
      where: { userId: parseInt(userId), productId: parseInt(productId) },
    });

    if (deletedItem.count === 0) {
      return NextResponse.json(
        { error: 'Artículo no encontrado en el carrito' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Artículo eliminado del carrito' });
  } catch (error) {
    console.error("Error en el backend al eliminar el artículo:", error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}



