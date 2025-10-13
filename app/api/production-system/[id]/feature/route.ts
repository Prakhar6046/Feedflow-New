import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
          const user = await verifyAndRefreshToken(req);
            if (user.status === 401) {
              return new NextResponse(
                JSON.stringify({
                  status: false,
                  message: 'Unauthorized: Token missing or invalid',
                }),
                { status: 401 },
              );
            }
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