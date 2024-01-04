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
        const courseNumber = parseInt(req.headers.get("courseNumber") ?? "", 10);

        // Validate the extracted parameters
        const schema = z.object({
            courseCode: z.string().max(4).min(4),
            courseNumber: z.number().min(101).max(499),
        });

        const validData = schema.parse({ courseCode, courseNumber });

        // Search for the course based on courseCode and courseNumber
        const course = await db.courses.findFirst({
            where: { course_code: validData.courseCode, course_number: validData.courseNumber },
        });

        if (!course) {
            return new Response("Course not found", { status: 404 });
        }

        // Build the search criteria based on the provided parameters
        const groups = await db.whatsapp_groups.findMany({
            where: {
                course_id: course.course_id,
                OR: [
                    {gender: session.user.gender},
                    {gender: 0}
                ]
            },
        });

        if (groups.length > 0) {
            return Response.json(groups, { status: 200 });
        } else {
            return Response.json({ message: "No group links found"}, { status: 404 });
        }
    } catch (error) {
        return Response.json("Internal server error", { status: 500 });
    }
}
