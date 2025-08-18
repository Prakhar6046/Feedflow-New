import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const species = await prisma.species.findUnique({ where: { id } });
        if (!species) {
            return NextResponse.json({ error: "Species not found" }, { status: 404 });
        }

        const updated = await prisma.species.update({
            where: { id },
            data: { isFeatured: !species.isFeatured },
        });

        return NextResponse.json({
            message: updated.isFeatured ? "Species featured" : "Species unfeatured",
            species: updated,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}