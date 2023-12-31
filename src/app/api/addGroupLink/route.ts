import { db } from "~/server/db";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        // Check if request is well-formatted
        const whatsappGroupLinkRegex = /^https:\/\/chat\.whatsapp\.com\//;
        const schema = z.object({
            courseCode: z.string().max(4).min(4),
            courseNumber: z.number().min(101).max(499),
            section: z.string().min(3).max(3),
            gender: z.number().min(0).max(2),
            groupLink: z.string().url().max(48).refine((value) => whatsappGroupLinkRegex.test(value), { message: "Invalid group link" })
        });

        const validData = schema.parse(await req.json());
        const { courseCode, courseNumber, section, gender, groupLink } = validData;

        // Check if record exists, insert otherwise
        const recordExists = await db.whatsapp_groups.findFirst({ where: { group_link: groupLink, section: section } });
        if (recordExists) {
            return Response.json({ message: "Record already exists" }, { status: 400 });
        }

        const course = await db.courses.findFirst({
            where: { course_code: courseCode, course_number: courseNumber }
        });

        if (!course) {
            return Response.json({ message: "Course not found" }, { status: 404 });
        }

        await db.whatsapp_groups.create({
            data: {
                section: section,
                gender: gender,
                group_link: groupLink,
                course_id: course.course_id,
            }
        });

        return Response.json({ message: "Success" }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}
