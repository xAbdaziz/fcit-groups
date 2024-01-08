import { db } from "~/server/db";
import { z } from "zod";
import { getServerAuthSession } from "~/server/auth";

export async function GET(req: Request) {
    const session = await getServerAuthSession();
    if (!session) {
        return Response.json({ message: "Access denied" }, { status: 403 });
    }
    try {
        // Extract parameters from request headers
        const courseCode = req.headers.get("courseCode");

        // Validate the extracted parameters
        const schema = z.object({
            courseCode: z.enum(['CPIS', 'CPCS', 'CPIT', 'STAT', 'MATH', 'BUS', 'MRKT', 'ACCT']),
        });

        const validData = schema.parse({ courseCode });

        const courses = await db.courses.findMany({
            where: {
                course_code: validData.courseCode,
            },
        });

        return Response.json(courses, {status: 200})

    } catch (error) {
        return Response.json("Internal server error", { status: 500 });
    }
}
