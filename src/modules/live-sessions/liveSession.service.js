const LiveSession = require("./liveSession.model");
const paginate = require("../../utils/pagination");
const mailgun = require("mailgun-js");

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

const registerUserForSession = async (sessionId, email, userId) => {
  const session = await LiveSession.findById(sessionId);
  if (!session) throw new Error("Session not found");
  if (session.registeredUsers.includes(userId))
    throw new Error("User already registered");
  session.registeredUsers.push(userId);
  await session.save();
  sendMeetingLink(email, session);
  return session;
};

const sendMeetingLink = (email, session) => {
  const data = {
    from: "PM Teach <no-reply@pmteach.com>",
    to: email,
    subject: `You are registered for ${session.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #333;">📅 You’re Registered!</h2>
        <p style="font-size: 16px; color: #555;">Hello,</p>
        <p style="font-size: 16px; color: #555;">
          You have successfully registered for the session: <strong>${
            session.title
          }</strong>.
        </p>
        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin-top: 10px;">
          <p><strong>📆 Date:</strong> ${new Date(
            session.date
          ).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            weekday: "long",
          })} ${new Date(session.startTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}</p>
          <p><strong>⏳ Duration:</strong> ${session.duration}</p>
          <p><strong>🎙 Speaker:</strong> ${session.speaker}</p>
          <p><strong>🔗 Meeting Link:</strong> <a href="${
            session.meetLink
          }" style="color: #007bff; text-decoration: none;">Join Session</a></p>
        </div>

        <!-- Add to Calendar Button -->
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            session.title
          )}&dates=${getGoogleCalendarDate(
      session.date,
      session.duration
    )}&details=${encodeURIComponent(
      session.description
    )}&location=${encodeURIComponent(session.meetLink)}" 
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

const getGoogleCalendarDate = (date, duration) => {
  const eventStart = new Date(date);
  const eventEnd = new Date(eventStart.getTime() + parseDuration(duration));

  const formatDate = (d) =>
    d.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";

  return `${formatDate(eventStart)}/${formatDate(eventEnd)}`;
};

const parseDuration = (duration) => {
  const [value, unit] = duration.split(" ");
  if (unit.startsWith("min")) return value * 60 * 1000;
  return value * 60 * 60 * 1000;
};

module.exports = {
  createLiveSession,
  getAllLiveSessions,
  getLiveSessionById,
  updateLiveSession,
  deleteLiveSession,
  registerUserForSession,
  sendMeetingLink,
};
