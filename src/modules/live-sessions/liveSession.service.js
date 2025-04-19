const LiveSession = require("./liveSession.model");
const paginate = require("../../utils/pagination");
const mailgun = require("mailgun-js");
const { default: mongoose } = require("mongoose");
const User = require("../users/user.model");

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

const getSuggestedSessions = async (excludeId) => {
  return await LiveSession.aggregate([
    { $match: { _id: { $ne: new mongoose.Types.ObjectId(excludeId) } } },
    { $sample: { size: 2 } },
  ]);
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

const registerUserForSessions = async (
  sessionIds,
  suggestedSessionIds,
  email,
  userId
) => {
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
      sendMeetingLink(email, session, suggestedSessionIds);
    }
    return session;
  });
  const registeredSessions = await Promise.all(sessionUpdates);
  return registeredSessions;
};

const sendMeetingLink = async (email, session, suggestedSessionIds = []) => {
  let suggestedSessions = [];

  if (suggestedSessionIds.length > 0) {
    suggestedSessions = await LiveSession.find({
      _id: { $in: suggestedSessionIds },
    }).lean();
  }

  const formatSessionDate = (date, time) => {
    return `${new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "long",
    })} ${new Date(`1970-01-01T${time}:00`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // Suggested sessions HTML
  const suggestedHTML =
    suggestedSessions.length > 0
      ? `
      <tr>
        <td style="padding: 40px 20px 20px;">
          <h3 style="margin: 0 0 20px; font-size: 20px; color: #2d3748; text-align: center;">🎓 You might also like</h3>
          <table width="100%" cellspacing="0" cellpadding="0">
            ${suggestedSessions
              .map(
                (s) => `
              <tr>
                <td style="padding-bottom: 20px;">
                  <table width="100%" cellspacing="0" cellpadding="0" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                    <tr>
                      <td width="30%" style="padding: 0;">
                        <img src="${s.img}" alt="${
                  s.title
                }" width="100%" style="display: block; max-width: 100%; height: auto; object-fit: cover; border-right: 1px solid #e2e8f0;" />
                      </td>
                      <td width="70%" style="padding: 15px;">
                        <h4 style="margin: 0 0 8px; font-size: 16px; color: #2d3748; font-weight: 600;">${
                          s.title
                        }</h4>
                        <p style="margin: 0 0 6px; font-size: 14px; color: #4a5568;"><strong>Speaker:</strong> ${
                          s.speaker
                        }</p>
                        ${
                          s.date
                            ? `<p style="margin: 0 0 6px; font-size: 14px; color: #4a5568;"><strong>Date:</strong> ${formatSessionDate(
                                s.date,
                                s.startTime
                              )}</p>`
                            : `<p></p>`
                        }
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding: 0;">
                        <a href="${
                          process.env.NEXT_PUBLIC_FRONTEND_URL
                        }pages/speaker-series/${
                  s._id
                }" style="display: block; width: 100%; padding: 12px 0; text-align: center; color: #4299e1; text-decoration: none; font-size: 14px; font-weight: 500; border-top: 1px solid #e2e8f0;">View Details →</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              `
              )
              .join("")}
          </table>
        </td>
      </tr>
      `
      : "";

  const data = {
    from: "PM Teach <no-reply@pmteach.com>",
    to: email,
    subject: `You're Registered for ${session?.title}`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Registration Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #f7fafc;">
      <!-- Main Container -->
      <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
          <td style="padding: 30px 20px; text-align: center; background-color: #ffffff;">
            <img src="https://www.pmteach.com/photos/pmteach-full.png" alt="PM Teach Logo" style="max-width: 180px;">
          </td>
        </tr>
        
        <!-- Confirmation Section -->
        <tr>
          <td style="padding: 40px 20px; background-color: #ffffff;">
            <table width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td style="text-align: center; padding-bottom: 30px;">
                  <div style="width: 80px; height: 80px; background-color: #48bb78; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="white"/>
                    </svg>
                  </div>
                  <h1 style="margin: 20px 0 10px; font-size: 24px; color: #2d3748; font-weight: 700;">You're Registered!</h1>
                  <p style="margin: 0; font-size: 16px; color: #4a5568;">Your spot is reserved for</p>
                  <p style="margin: 10px 0 0; font-size: 18px; color: #2d3748; font-weight: 600;">${
                    session?.title
                  }</p>
                </td>
              </tr>
              
              <!-- Session Card -->
              <tr>
                <td style="padding-bottom: 30px;">
                  <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <tr>
                      <td style="padding: 0;">
                        <img src="${session.img}" alt="${
      session.title
    }" width="100%" style="display: block; max-width: 100%; height: auto; object-fit: cover;">
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px;">
                        <table width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding-bottom: 12px;">
                              <div style="display: flex; align-items: flex-start;">
                                <div style="flex-shrink: 0; margin-right: 12px; color: #4299e1;">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                  </svg>
                                </div>
                                <div>
                                  <p style="margin: 0; font-size: 14px; color: #718096;">Date & Time</p>
                                  <p style="margin: 4px 0 0; font-size: 16px; color: #2d3748; font-weight: 500;">${formatSessionDate(
                                    session.date,
                                    session.startTime
                                  )}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 12px;">
                              <div style="display: flex; align-items: flex-start;">
                                <div style="flex-shrink: 0; margin-right: 12px; color: #4299e1;">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                  </svg>
                                </div>
                                <div>
                                  <p style="margin: 0; font-size: 14px; color: #718096;">Duration</p>
                                  <p style="margin: 4px 0 0; font-size: 16px; color: #2d3748; font-weight: 500;">${
                                    session.duration
                                  }</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 12px;">
                              <div style="display: flex; align-items: flex-start;">
                                <div style="flex-shrink: 0; margin-right: 12px; color: #4299e1;">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                  </svg>
                                </div>
                                <div>
                                  <p style="margin: 0; font-size: 14px; color: #718096;">Speaker</p>
                                  <p style="margin: 4px 0 0; font-size: 16px; color: #2d3748; font-weight: 500;">${
                                    session.speaker
                                  }</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div style="display: flex; align-items: flex-start;">
                                <div style="flex-shrink: 0; margin-right: 12px; color: #4299e1;">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 3H3C1.89543 3 1 3.89543 1 5V19C1 20.1046 1.89543 21 3 21H21C22.1046 21 23 20.1046 23 19V5C23 3.89543 22.1046 3 21 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M1 9H23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M7 15H7.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M11 15H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                  </svg>
                                </div>
                                <div>
                                  <p style="margin: 0; font-size: 14px; color: #718096;">Meeting Link</p>
                                  <a href="${
                                    session.meetLink
                                  }" style="display: inline-block; margin-top: 4px; color: #4299e1; text-decoration: none; font-size: 16px; font-weight: 500;">Click to join session</a>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- CTA Buttons -->
              <tr>
                <td style="padding-bottom: 30px;">
                  <table width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" style="padding-bottom: 15px;">
                        <a href="${
                          session.meetLink
                        }" style="display: inline-block; padding: 12px 24px; background-color: #4299e1; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Join Session</a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                          session.title
                        )}&dates=${getGoogleCalendarDate(
      session?.date,
      session?.duration
    )}&details=${encodeURIComponent(
      session?.description
    )}&location=${encodeURIComponent(
      session?.meetLink
    )}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #ffffff; color: #4299e1; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; border: 1px solid #4299e1;">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 8px;">
                            <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          Add to Google Calendar
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Suggested Sessions -->
        ${suggestedHTML}
        
        <!-- Footer -->
        <tr>
          <td style="padding: 30px 20px; text-align: center; background-color: #ffffff; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #718096;">Thank you for joining us!</p>
            <p style="margin: 0; font-size: 16px; font-weight: 600; color: #2d3748;">PM Teach Team</p>
            <p style="margin: 20px 0 0; font-size: 12px; color: #a0aec0;">© ${new Date().getFullYear()} PM Teach. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `,
  };

  mg.messages().send(data, (error, body) => {
    if (error) console.error("Mail Error:", error);
    else console.log("Mail Sent:", body);
  });
};

const sendSessionNotification = async (sessionIds) => {
  const sessions = await LiveSession.find({ _id: { $in: sessionIds } }).lean();
  const allUsers = await User.find({}).lean();

  const formatSessionDate = (date, time) => {
    return `${new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "long",
    })} ${new Date(`1970-01-01T${time}:00`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // Helper function to render session type badge
  const renderSessionBadge = (sessionType) => {
    const isLive = sessionType === "live";
    return `
      <button style="
        top: 0px;
        right: 10px;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        background-color: ${isLive ? "#16a34a" : "#9F7AEA"};
        color: white;
        z-index: 1;
        margin-left:20px;
        margin-bottom:15px;
        border: none;
      ">
        ${isLive ? "LIVE" : "ON DEMAND"}
      </button>
    `;
  };

  // Single session template
  const singleSessionTemplate = (session) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Session Notification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f7fafc;">
      <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
          <td style="padding: 30px 20px; text-align: center; background-color: #ffffff;">
            <img src="https://www.pmteach.com/photos/pmteach-full.png" alt="Logo" style="max-width: 180px;">
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding: 40px 20px; background-color: #ffffff;">
            <h1 style="margin: 0 0 20px; font-size: 24px; color: #2d3748; text-align: center;">
              New Session Alert! 🚀
            </h1>
            
            <div style="background-color: #f8fafc; border-radius: 8px; padding-bottom: 20px; margin-bottom: 30px; border: 1px solid #e2e8f0; position: relative;">
              <!-- Badge positioned absolutely within the card -->
              ${renderSessionBadge(session.sessionType)}
              <img src="${session.img}" alt="${
    session.title
  }" style="width: 100%; border-radius: 6px 6px 0 0; margin-bottom: 15px;">
              <div style="padding: 0 20px;">
                <h2 style="margin: 0 0 10px; font-size: 20px; color: #2d3748;">
                  ${session.title}
                </h2>
                ${
                  session.date
                    ? `<p style="margin: 0 0 8px; color: #4a5568;"><strong>📅 When:</strong> ${formatSessionDate(
                        session.date,
                        session.startTime
                      )}</p>`
                    : `<p></p>`
                }
                <p style="margin: 0 0 8px; color: #4a5568;"><strong>⏳ Duration:</strong> ${
                  session.duration
                } minutes</p>
                <p style="margin: 0 0 15px; color: #4a5568;"><strong>🎤 Speaker:</strong> ${
                  session.speaker
                }</p>
                <a href="${
                  process.env.NEXT_PUBLIC_FRONTEND_URL
                }pages/speaker-series/${
    session._id
  }" style="display: inline-block; padding: 10px 20px; background-color: ${
    session.sessionType === "live" ? "#4299e1" : "#9F7AEA"
  }; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
                  ${session.sessionType === "live" ? "Join Now" : "Watch Now"}
                </a>
              </div>
            </div>
            
            <p style="margin: 0; color: #4a5568; line-height: 1.5;">We're excited to have you ${
              session.sessionType === "live" ? "join us for" : "watch"
            } this session!</p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="padding: 20px; text-align: center; background-color: #ffffff; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #718096; font-size: 14px;">© ${new Date().getFullYear()} PM Teach. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Multiple sessions template
  const multipleSessionsTemplate = (sessions) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Sessions Notification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f7fafc;">
      <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
          <td style="padding: 30px 20px; text-align: center; background-color: #ffffff;">
            <img src="https://www.pmteach.com/photos/pmteach-full.png" alt="Logo" style="max-width: 180px;">
          </td>
        </tr>
        
        <!-- Content -->
        <tr>
          <td style="padding: 40px 20px; background-color: #ffffff;">
            <h1 style="margin: 0 0 20px; font-size: 24px; color: #2d3748; text-align: center;">New Sessions Alert! 🎉</h1>
            <p style="margin: 0 0 30px; color: #4a5568; text-align: center;">We've scheduled multiple new sessions you might be interested in:</p>
            
            ${sessions
              .map(
                (session) => `
              <div style="background-color: #f8fafc; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e2e8f0; ">
              
                <img src="${session.img}" alt="${
                  session.title
                }" style="width: 100%; border-radius: 6px 6px 0 0; margin-bottom: 15px; position: relative;">
                  ${renderSessionBadge(session.sessionType)}
                <div style="padding: 0 20px 20px;">
                  <h2 style="margin: 0 0 10px; font-size: 18px; color: #2d3748;">
                    ${session.title}
                  </h2>
                  ${
                    session.date
                      ? `<p style="margin: 0 0 8px; color: #4a5568;"><strong>📅 When:</strong> ${formatSessionDate(
                          session.date,
                          session.startTime
                        )}</p>`
                      : `<p></p>`
                  }
                  <p style="margin: 0 0 8px; color: #4a5568;"><strong>⏳ Duration:</strong> ${
                    session.duration
                  } minutes</p>
                  <p style="margin: 0 0 15px; color: #4a5568;"><strong>🎤 Speaker:</strong> ${
                    session.speaker
                  }</p>
                  <a href="${
                    process.env.NEXT_PUBLIC_FRONTEND_URL
                  }pages/speaker-series/${
                  session._id
                }" style="display: inline-block; padding: 10px 20px; background-color: ${
                  session.sessionType === "live" ? "#4299e1" : "#9F7AEA"
                }; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">
                    ${session.sessionType === "live" ? "Join Now" : "Watch Now"}
                  </a>
                </div>
              </div>
            `
              )
              .join("")}
            
            <p style="margin: 30px 0 0; color: #4a5568; line-height: 1.5;">We're excited to have you explore these ${
              sessions.some((s) => s.sessionType === "live")
                ? "live and on-demand"
                : "on-demand"
            } sessions!</p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="padding: 20px; text-align: center; background-color: #ffffff; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #718096; font-size: 14px;">© ${new Date().getFullYear()} PM Teach. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Rest of the function remains the same...
  // Determine which template to use
  const htmlContent =
    sessions.length === 1
      ? singleSessionTemplate(sessions[0])
      : multipleSessionsTemplate(sessions);

  const subject =
    sessions.length === 1
      ? `New ${
          sessions[0].sessionType === "live" ? "Live" : "On-Demand"
        } Session: ${sessions[0].title}`
      : `New Sessions Available (${sessions.length})`;

  // Send emails to all users
  const emailPromises = allUsers.map((user) => {
    const data = {
      from: "PM Teach <notifications@pmteach.com>",
      to: user.email,
      subject: subject,
      html: htmlContent,
    };

    return new Promise((resolve, reject) => {
      mg.messages().send(data, (error, body) => {
        if (error) {
          console.error(`Error sending to ${user.email}:`, error);
          reject(error);
        } else {
          console.log(`Sent to ${user.email}`);
          resolve(body);
        }
      });
    });
  });

  try {
    await Promise.all(emailPromises);
    console.log("All notifications sent successfully");
  } catch (error) {
    console.error("Error sending notifications:", error);
    throw error;
  }
};

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
  getSuggestedSessions,
  sendSessionNotification,
};
