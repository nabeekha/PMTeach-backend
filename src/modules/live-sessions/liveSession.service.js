const LiveSession = require("./liveSession.model");
const paginate = require("../../utils/pagination");
const mailgun = require("mailgun-js");
// const { google } = require("googleapis");
// const { OAuth2 } = google.auth;

const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: DOMAIN,
});

const createLiveSession = async (data) => {
  const LiveSessions = new LiveSession(data);
  return await LiveSessions.save();
};

const getAllLiveSessions = async (query, page, limit) => {
  return await paginate(LiveSession, query, page, limit);
};

const getLiveSessionById = async (id) => {
  const liveSession = await LiveSession.findById(id);
  if (!liveSession) throw new Error("liveSession not found.");
  return liveSession;
};

const updateLiveSession = async (id, data) => {
  const liveSession = await LiveSession.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!liveSession) throw new Error("liveSession not found.");
  return liveSession;
};

const deleteLiveSession = async (id) => {
  return await LiveSession.findByIdAndDelete(id);
};

const registerUserForSessions = async (sessionIds, email, userId) => {
  if (!Array.isArray(sessionIds) || sessionIds.length === 0) {
    throw new Error("No sessions provided for registration.");
  }
  const sessions = await LiveSession.find({ _id: { $in: sessionIds } });
  if (!sessions.length) {
    throw new Error("No valid sessions found.");
  }
  const unregisteredSessions = sessions.filter(
    (session) => !session.registeredUsers.includes(userId)
  );
  if (unregisteredSessions.length === 0) {
    throw new Error("You are already registered for all selected sessions.");
  }
  const sessionUpdates = unregisteredSessions.map(async (session) => {
    session.registeredUsers.push(userId);
    await session.save();
    if (session?.sessionType === "live") {
      sendMeetingLink(email, session);
    }
    return session;
  });
  const registeredSessions = await Promise.all(sessionUpdates);
  return registeredSessions;
};

const sendMeetingLink = (email, session) => {
  const data = {
    from: "PM Teach <no-reply@pmteach.com>",
    to: email,
    subject: `You are registered for ${session?.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #333;">📅 You’re Registered!</h2>
        <p style="font-size: 16px; color: #555;">Hello,</p>
        <p style="font-size: 16px; color: #555;">
          You have successfully registered for the session: <strong>${
            session?.title
          }</strong>.
        </p>
        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-top: 10px;">
          <p><strong>📆 Date:</strong> ${new Date(
            session?.date
          ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            weekday: "long",
          })} ${new Date(
      `1970-01-01T${session?.startTime}:00`
    ).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}</p>
          <p><strong>⏳ Duration:</strong> ${session?.duration}</p>
          <p><strong>🎙 Speaker:</strong> ${session?.speaker}</p>
          <p><strong>🔗 Meeting Link:</strong> <a href="${
            session.meetLink
          }" style="color: #007bff; text-decoration: none;">Join Session</a></p>
        </div>

        <!-- Add to Calendar Button -->
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            session.title
          )}&dates=${getGoogleCalendarDate(
      session?.date,
      session?.duration
    )}&details=${encodeURIComponent(
      session?.description
    )}&location=${encodeURIComponent(session?.meetLink)}"
          target="_blank" style="background-color: #28a745; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
            ➕ Add to Google Calendar
          </a>
        </div>

        <p style="font-size: 16px; color: #555; margin-top: 20px;">
          Thank you for registering!
        </p>
        <p style="font-size: 16px; color: #555;">Best regards,</p>
        <p style="font-size: 16px; font-weight: bold;">PM Teach Team</p>
      </div>
    `,
  };

  mg.messages().send(data, (error, body) => {
    if (error) console.error("Mail Error:", error);
    else console.log("Mail Sent:", body);
  });
};

// const sendMeetingLink = async (email, session, token) => {
//   const oAuth2Client = new OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.GOOGLE_REDIRECT_URI
//   );
//   oAuth2Client.setCredentials({ refresh_token: token });

//   try {
//     // Prepare the event details
//     const event = {
//       summary: session.title,
//       description: session.description,
//       start: {
//         dateTime: new Date(
//           `${session.date}T${session.startTime}:00`
//         ).toISOString(),
//         timeZone: "Asia/Kolkata",
//       },
//       end: {
//         dateTime: new Date(
//           `${session.date}T${session.endTime}:00`
//         ).toISOString(),
//         timeZone: "Asia/Kolkata",
//       },
//       attendees: [{ email: email }],
//       reminders: {
//         useDefault: false,
//         overrides: [{ method: "email", minutes: 10 }],
//       },
//       conferenceData: {
//         createRequest: {
//           requestId: "sample123",
//           conferenceSolutionKey: { type: "hangoutsMeet" },
//           status: { statusCode: "success" },
//         },
//       },
//     };
//     // Add event to calendar
//     const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
//     const response = await calendar.events.insert({
//       calendarId: "primary",
//       resource: event,
//       conferenceDataVersion: 1,
//       sendUpdates: "all",
//     });

//     console.log("Event created: %s", response.data.htmlLink);

//     // Send confirmation email
//     const data = {
//       from: "PM Teach <no-reply@pmteach.com>",
//       to: email,
//       subject: `You are registered for ${session.title}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
//           <h2 style="text-align: center; color: #333;">📅 You’re Registered!</h2>
//           <p style="font-size: 16px; color: #555;">Hello,</p>
//           <p style="font-size: 16px; color: #555;">
//             You have successfully registered for the session: <strong>${
//               session.title
//             }</strong>.
//           </p>
//           <p><strong>📆 Date:</strong> ${new Date(
//             session.date
//           ).toLocaleDateString("en-GB", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//             weekday: "long",
//           })} ${session.startTime}</p>
//           <p><strong>⏳ Duration:</strong> ${session.duration} minutes</p>
//           <p><strong>🎙 Speaker:</strong> ${session.speaker}</p>
//           <p><strong>🔗 Meeting Link:</strong> <a href="${
//             session.meetLink
//           }" style="color: #007bff; text-decoration: none;">Join Session</a></p>
//           <p><strong>🔔 Calendar Event:</strong> <a href="${
//             response.data.htmlLink
//           }" target="_blank" style="color: #28a745;">View in Calendar</a></p>
//           <p style="font-size: 16px; color: #555; margin-top: 20px;">Thank you for registering!</p>
//           <p style="font-size: 16px; color: #555;">Best regards,</p>
//           <p style="font-size: 16px; font-weight: bold;">PM Teach Team</p>
//         </div>
//       `,
//     };

//     mg.messages().send(data, (error, body) => {
//       if (error) console.error("Mail Error:", error);
//       else console.log("Mail Sent:", body);
//     });
//   } catch (error) {
//     console.error("Error creating calendar event:", error);
//   }
// };

const getGoogleCalendarDate = (date, duration) => {
  const eventStart = new Date(date);
  const eventEnd = new Date(eventStart.getTime() + parseDuration(duration));

  const formatDate = (d) =>
    d.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";

  return `${formatDate(eventStart)}/${formatDate(eventEnd)}`;
};

const parseDuration = (duration) => {
  return duration * 60 * 60 * 1000;
};

module.exports = {
  createLiveSession,
  getAllLiveSessions,
  getLiveSessionById,
  updateLiveSession,
  deleteLiveSession,
  registerUserForSessions,
  sendMeetingLink,
};
