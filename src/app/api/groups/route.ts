import { db } from "~/server/db";
import { z } from "zod";
import { getServerAuthSession } from "~/server/auth";

// POST /api/groups - Create a new group
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
      courseCode: z.string().min(3).max(4),
      courseNumber: z.number().min(101).max(499),
      section: z.string().min(1).max(3).optional(),
      groupLink: z.string().url().max(64).refine((value) => value.startsWith("https://chat.whatsapp.com/"), { message: "Invalid group link" }),
      generalGroup: z.boolean()
    });

    // Parse and validate the request data
    const validData = schema.parse(await req.json());
    if (!validData) {
      return Response.json({ message: "Invalid data, maybe you entered a wrong link or the course doesn't exist" }, { status: 400 });
    }
    const { courseCode, courseNumber, section, groupLink, generalGroup } = validData;

    // Retrieve the course based on courseCode and courseNumber
    const course = await db.courses.findFirst({
      where: { course_code: courseCode, course_number: courseNumber }
    });

    if (!course) {
      return Response.json({ message: "Course not found" }, { status: 404 });
    }

    // Check if a general group already exists for the course (only if trying to create a general group)
    if (generalGroup) {
      const generalGroupExists = await db.whatsapp_groups.findFirst({
        where: {
          course_id: course.course_id,
          gender: 0
        }
      });

      if (generalGroupExists) {
        return Response.json({ message: "General group already exists for this course" }, { status: 400 });
      }
    }

    // Check if the groupLink was already posted
    const linkExists = await db.whatsapp_groups.findFirst({ where: { group_link: groupLink } });
    if (linkExists) {
      return Response.json({ message: "Group link already exists" }, { status: 400 });
    }

    // Check if a record for the specific section already exists (only for non-general groups)
    if (!generalGroup) {
      const sectionExists = await db.whatsapp_groups.findFirst({
        where: {
          course_id: course.course_id,
          section: section,
          gender: session.user.gender // Also check for same gender to allow different genders for same section
        }
      });

      if (sectionExists) {
        return Response.json({ message: "A Group for this section and gender already exists" }, { status: 400 });
      }
    }

    // Create a new WhatsApp group record
    const newGroup = await db.whatsapp_groups.create({
      data: {
        section: generalGroup ? "N/A" : section ?? "N/A",
        gender: generalGroup ? 0 : session.user.gender,
        group_link: groupLink,
        course_id: course.course_id,
        owner_id: session.user.id
      }
    });

    // Return the created group with 201 status
    return Response.json(newGroup, { status: 201 });
  } catch (error) {
    console.error(error)
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// GET /api/groups - Search for groups by course
export async function GET(req: Request) {
    const session = await getServerAuthSession();
    if (!session) {
        return Response.json({ message: "Access denied" }, { status: 403 });
    }

    try {
        // Extract parameters from URL search params instead of headers
        const { searchParams } = new URL(req.url);
        const courseCode = searchParams.get("courseCode");
        const courseNumber = searchParams.get("courseNumber");

        // Validate the extracted parameters
        const schema = z.object({
            courseCode: z.string().max(4).min(4),
            courseNumber: z.string().transform(val => parseInt(val, 10)).pipe(z.number().min(101).max(499)),
        });

        const validData = schema.parse({ courseCode, courseNumber });

        // Search for the course based on courseCode and courseNumber
        const course = await db.courses.findFirst({
            where: { course_code: validData.courseCode, course_number: validData.courseNumber },
        });

        if (!course) {
            return Response.json({ message: "Course not found" }, { status: 404 });
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
        console.error(error)
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}
