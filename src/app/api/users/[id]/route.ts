import { db } from "~/server/db";
import { z } from "zod";
import { getServerAuthSession } from "~/server/auth";

// PATCH /api/users/[id] - Update user profile
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerAuthSession();
  if (!session) {
    return Response.json({ message: "Access denied" }, { status: 403 });
  }

  // Authorization: Users can only update their own profile
  if (session.user.id !== params.id) {
    return Response.json({ message: "Forbidden: You can only update your own profile" }, { status: 403 });
  }

  const requestBodySchema = z.object({
    gender: z.number().min(1).max(2),
  });
  
  try {
    const { gender } = requestBodySchema.parse(await req.json());

    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: { gender: gender },
    });

    return Response.json({ message: "User updated successfully", user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// GET /api/users/[id] - Get user profile
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerAuthSession();
  if (!session) {
    return Response.json({ message: "Access denied" }, { status: 403 });
  }

  // Authorization: Users can only view their own profile
  if (session.user.id !== params.id) {
    return Response.json({ message: "Forbidden: You can only view your own profile" }, { status: 403 });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        gender: true,
        emailVerified: true,
      }
    });

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

