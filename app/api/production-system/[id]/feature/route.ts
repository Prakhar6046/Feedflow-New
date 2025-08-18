import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const productionSystem = await prisma.productionSystem.findUnique({ where: { id } });
        if (!productionSystem) {
            return NextResponse.json({ error: "productionSystem not found" }, { status: 404 });
        }

        const updated = await prisma.productionSystem.update({
            where: { id },
            data: { isFeatured: !productionSystem.isFeatured },
        });

        return NextResponse.json({
            message: updated.isFeatured ? "productionSystem featured" : "productionSystem unfeatured",
            productionSystem: updated,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}