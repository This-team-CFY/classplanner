const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
];

const auth = new google.auth.JWT({
  subject: "classplanner@class-planner-405420.iam.gserviceaccount.com", // specify subject (user whose context you want to operate in)
  keyFile: process.env.CALENDAR_FILE,
  scopes: SCOPES,
});

const calendar = google.calendar({ version: "v3", auth: auth });

module.exports = {calendar}
