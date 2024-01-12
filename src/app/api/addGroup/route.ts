import { db } from "~/server/db";
import { z } from "zod";
import { getServerAuthSession } from "~/server/auth";

export async function POST(req: Request) {
  // Get the session for the current user
  const session = await getServerAuthSession();
  if (!session) {
    // Return an error if the user is not authenticated
    return Response.json({ message: "Access denied" }, { status: 403 });
  }

  try {
    // Define a schema for validating the incoming request
    const schema = z.object({
      courseCode: z.string().max(4).min(4),
      courseNumber: z.number().min(101).max(499),
      section: z.string().min(2).max(3).optional(),
      groupLink: z.string().url().max(48).refine((value) => value.startsWith("https://chat.whatsapp.com/"), { message: "Invalid group link" }),
      generalGroup: z.boolean()
    });

    // Parse and validate the request data
    const validData = schema.parse(await req.json());
    const { courseCode, courseNumber, section, groupLink, generalGroup } = validData;

    // Retrieve the course based on courseCode and courseNumber
    const course = await db.courses.findFirst({
      where: { course_code: courseCode, course_number: courseNumber }
    });

    if (!course) {
      return Response.json({ message: "Course not found" }, { status: 404 });
    }

    // Check if a general group already exists for the course
    const generalGroupExists = await db.whatsapp_groups.findFirst({
      where: {
        course_id: course.course_id,
        gender: 0
      }
    });

    if (generalGroupExists) {
      return Response.json({ message: "General group already exists for this course" }, { status: 400 });
    }

    // Check if the groupLink was already posted
    const linkExists = await db.whatsapp_groups.findFirst({ where: { group_link: groupLink } });
    if (linkExists) {
      return Response.json({ message: "Group link already exists" }, { status: 400 });
    }

    // Check if a record for the specific section already exists
    const sectionExists = await db.whatsapp_groups.findFirst({
      where: {
        course_id: course.course_id,
        section: section
      }
    });

    if (sectionExists) {
      return Response.json({ message: "A Group for this section already exists" }, { status: 400 });
    }

    // Create a new WhatsApp group record
    await db.whatsapp_groups.create({
      data: {
        section: generalGroup ? "N/A" : section ?? "N/A",
        gender: generalGroup ? 0 : session.user.gender,
        group_link: groupLink,
        course_id: course.course_id,
        owner_id: session.user.id
      }
    });

    // Return a success response
    return Response.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
