import { db } from "~/server/db";
import { z } from "zod";

export async function GET(req: Request) {
    try {
        // Extract parameters from request headers
        const courseCode = req.headers.get("courseCode");
        const courseNumber = parseInt(req.headers.get("courseNumber") || "", 10);
        const section = req.headers.get("section");

        // Validate the extracted parameters
        const schema = z.object({
            courseCode: z.string().max(4).min(4),
            courseNumber: z.number().min(101).max(499),
            section: z.string().min(3).max(3).optional().or(z.literal('')),
        });

        const validData = schema.parse({ courseCode, courseNumber, section });

        // Search for the course based on courseCode and courseNumber
        const course = await db.courses.findFirst({
            where: { course_code: validData.courseCode, course_number: validData.courseNumber }
        });

        if (!course) {
            return new Response("Course not found", { status: 404 });
        }

        // Build the search criteria based on the provided parameters
        const searchCriteria: Record<string, any> = {
            course_id: course.course_id
        };

        if (validData.section) {
            searchCriteria.section = validData.section;
        }

        // Search for the group links in the database
        const groups = await db.whatsapp_groups.findMany({
            where: searchCriteria
        });

        if (groups.length > 0) {
            return Response.json({ message: "Group links found", groups }, { status: 200 });
        } else {
            return new Response("No group links found", { status: 404 });
        }
    } catch (error) {
        return new Response("Internal server error", { status: 500 });
    }
}
