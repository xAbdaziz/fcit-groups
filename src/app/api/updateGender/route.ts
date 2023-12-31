import { db } from "~/server/db";
import { z } from "zod";

export async function POST(req: Request) {
    const requestBodySchema = z.object({
        email: z.string().email(),
        gender: z.number().min(1).max(2),
      });

  const { email, gender } = requestBodySchema.parse(await req.json());

  const user = await db.user.update({
    where: { email: email },
    data: { gender: gender },
  });

  return Response.json({ message: "Success" }, { status: 200 });
}