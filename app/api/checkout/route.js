import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const token = req.headers.get('authorization')?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { items, totalAmount, name } = await req.json();

    const order = await prisma.order.create({
      data: {
        userId,
        items,
        totalAmount: parseFloat(totalAmount),
      },
    });

    return NextResponse.json({ message: 'Orden guardada exitosamente', order });
  } catch (error) {
    console.error("Error en el checkout:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
