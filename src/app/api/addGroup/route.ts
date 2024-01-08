import { db } from "~/server/db";
import { z } from "zod";
import { getServerAuthSession } from "~/server/auth";

export async function POST(req: Request) {
  const session = await getServerAuthSession();
  if (!session) {
    return Response.json({ message: "Access denied" }, { status: 403 });
  }

  try {
    // Check if request is well-formatted
    const schema = z.object({
      courseCode: z.string().max(4).min(4),
      courseNumber: z.number().min(101).max(499),
      section: z.string().min(2).max(3).optional(),
      groupLink: z.string().url().max(48).refine((value) => value.startsWith("https://chat.whatsapp.com/"), { message: "Invalid group link" }),
      generalGroup: z.boolean()
    });

    const validData = schema.parse(await req.json());
    const { courseCode, courseNumber, section, groupLink, generalGroup } = validData;

    // Check if record exists
    let recordExists;
    if (generalGroup) {
      recordExists = await db.whatsapp_groups.findFirst({ where: { group_link: groupLink, section: section, gender: 0 } });
    } else {
      recordExists = await db.whatsapp_groups.findFirst({ where: { group_link: groupLink, section: section } });
    }

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
        section: generalGroup ? "N/A" : section ?? "N/A",
        gender: generalGroup ? 0 : session.user.gender,
        group_link: groupLink,
        course_id: course.course_id,
        owner_id: session.user.id
      }
    });

    return Response.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.log(error)
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
