import { db } from "~/server/db";
import { z } from "zod";
import { getServerAuthSession } from "~/server/auth";

export async function POST(req: Request) {
  const session = await getServerAuthSession();
  if (!session) {
    return Response.json({ message: "Access denied" }, { status: 403 });
  }

  const requestBodySchema = z.object({
    gender: z.number().min(1).max(2),
  });
  try {
    const { gender } = requestBodySchema.parse(await req.json());

    await db.user.update({
      where: { id: session.user.id },
      data: { gender: gender },
    });

    return Response.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("Internal server error", { status: 500 });
  }
}
