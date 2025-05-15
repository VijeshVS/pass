"use server";
import { connectDB } from "../db/db";
import { EventModel, Registration } from "../db/models";
import { checkIfAuthenticated } from "./auth";

export async function checkIfAdmin(token: string) {}

export async function getAllEvents(token: string) {
  await connectDB();
  const check = await checkIfAuthenticated(token);

  if (!check) {
    return {
      status: 401,
    };
  }

  const events = await EventModel.find({}).lean();

  const sanitizedEvents = events.map((event: any) => ({
    ...event,
    _id: event._id.toString(),
    contact:
      event.contact?.map((c: any) => ({
        ...c,
        _id: c._id?.toString?.() || "",
      })) || [],
  }));

  return {
    status: 200,
    events: sanitizedEvents,
  };
}

export async function getEventById(eventId: string, token: string) {
  await connectDB();
  const isAuthenticated = await checkIfAuthenticated(token);

  if (!isAuthenticated) {
    return {
      status: 401,
      error: "Unauthorized",
    };
  }

  try {
    const event = await EventModel.findById(eventId).lean();

    if (!event) {
      return {
        status: 404,
        error: "Event not found",
      };
    }

    // @ts-ignore
    const sanitizedEvent = {
      ...event,
      // @ts-ignore
      _id: event._id.toString(),
      // @ts-ignore
      contact:
        // @ts-ignore
        event.contact?.map((c: any) => ({
          ...c,
          _id: c._id?.toString?.() || "",
        })) || [],
    };

    return {
      status: 200,
      event: sanitizedEvent,
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return {
      status: 500,
      error: "Internal server error",
    };
  }
}

export async function createOneEvent(formData: any, token: string) {
  await connectDB();

  const isAuthenticated = await checkIfAuthenticated(token);
  if (!isAuthenticated) {
    return { status: 401, error: "Unauthorized" };
  }

  try {
    const {
      _id,
      photoPath,
      slug,
      name,
      description,
      date,
      time,
      venue,
      category,
      prizes,
      teamsize,
      registrationFee,
      feetype,
      guidelines,
      contact,
      registrationDeadline,
      registrationOpen,
    } = formData;

    const newEvent = new EventModel({
      _id,
      photoPath,
      slug,
      name,
      description,
      date,
      time,
      venue,
      category,
      prizes,
      teamsize,
      registrationFee,
      feetype,
      guidelines,
      contact,
      registrationDeadline,
      registrationOpen,
    });

    await newEvent.save();

    return { status: 200 };
  } catch (error: any) {
    console.error("Error creating event:", error);
    return {
      status: 500,
      error: "Internal Server Error",
    };
  }
}

export async function updateOneEvent(formData: any, token: string) {
  await connectDB();

  const isAuthenticated = await checkIfAuthenticated(token);
  if (!isAuthenticated) {
    return { status: 401, error: "Unauthorized" };
  }

  try {
    const {
      _id,
      photoPath,
      slug,
      name,
      description,
      date,
      time,
      venue,
      category,
      prizes,
      teamsize,
      registrationFee,
      feetype,
      guidelines,
      contact,
      registrationDeadline,
      registrationOpen,
    } = formData;

    if (!_id) {
      return { status: 400, error: "_id (Event ID) is required" };
    }

    const updated = await EventModel.findByIdAndUpdate(
      _id,
      {
        photoPath,
        slug,
        name,
        description,
        date,
        time,
        venue,
        category,
        prizes,
        teamsize,
        registrationFee,
        feetype,
        guidelines,
        contact,
        registrationDeadline,
        registrationOpen,
      },
      { new: true } // return updated doc (optional)
    ).lean();

    if (!updated) {
      return { status: 404, error: "Event not found" };
    }

    return { status: 200, event: updated };
  } catch (error: any) {
    console.error("Error updating event:", error);
    return { status: 500, error: "Internal Server Error" };
  }
}

export async function getEventPasses(token: string, event_id: string) {
  await connectDB();

  const isAuthenticated = await checkIfAuthenticated(token);
  if (!isAuthenticated) {
    return { status: 401, error: "Unauthorized" };
  }

  try {
    const rawPasses = await Registration.find({
      classId: event_id,
    }).lean();

    const passes = rawPasses.map(pass => {
      const { _id, createdAt, updatedAt, ...rest } = pass;

      return {
        ...rest,
        // @ts-ignore
        _id: _id.toString(),
        createdAt: createdAt?.toISOString?.(),
        updatedAt: updatedAt?.toISOString?.(),
      };
    });

    let totalParticipants = 0;
    passes.forEach((pass) => {
      // @ts-ignore
      totalParticipants += pass.noOfParticipants || 0;
    });

    return {
      success: true,
      totalParticipants,
      passes,
    };
  } catch (error) {
    console.error("Error fetching event passes:", error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
}


