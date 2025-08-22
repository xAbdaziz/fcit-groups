import { db } from "~/server/db";
import { z } from "zod";
import { getServerAuthSession } from "~/server/auth";

// GET /api/courses - Get courses by course code
export async function GET(req: Request) {
    const session = await getServerAuthSession();
    if (!session) {
        return Response.json({ message: "Access denied" }, { status: 403 });
    }
    
    try {
        // Extract parameters from URL search params instead of headers
        const { searchParams } = new URL(req.url);
        const courseCode = searchParams.get("courseCode");

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

        return Response.json(courses, { status: 200 });

    } catch (error) {
        console.error(error)
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}

