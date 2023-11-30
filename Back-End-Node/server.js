const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
const {calendar} = require("./calendarconfig");
const http = require("http");
const fs = require("fs");
const https = require("https");
const { WebClient } = require("@slack/web-api");
const cors = require("cors");
const {google} = require("googleapis");
const { Console } = require("console");
const secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const backendUrl = process.env.BACK_END_URL;

app.use(cors());
app.use(express.json());
require("dotenv").config();

const client_id = process.env.VITE_SLACK_CLIENT_ID;
const client_secret = process.env.SLACK_CLIENT_SECRET;
const redirect_uri = `${process.env.BACK_END_URL_SLACK}/auth/redirect`;

const client = new WebClient();

const createToken = (userId) => {
  const token = jwt.sign({ id: userId, roles: [`student`] }, secret, {
    expiresIn: 86400, // expires in 24 hours
  });

  return token;
};

app.get("/auth/redirect", async (req, res) => {
 try {
    const { code } = req.query;

    // Exchange the code for an OAuth token
    const result = await client.oauth.v2.access({
      code,
      client_id,
      client_secret,
      redirect_uri,
    });

    console.log("OAuth Response", result);

    // Use the token to get user information
    const userIdentity = await client.users.identity({
      user: result.authed_user.id,
      token: result.authed_user.access_token,
    });

    const userProfile = await client.users.profile.get({
      user: result.authed_user.id,
      token: result.authed_user.access_token,
    });

    console.log("neded", userIdentity, userProfile);
    // console.log("User Data", userDataResponse);
    const existingUser = await pool.query(
      "SELECT * FROM public.user WHERE email = $1",
      [userIdentity["user"]["email"]]
    );
    let jwtToken = "";
    if (existingUser.rows.length > 0) {
      console.log(existingUser);
      //Login Bussiness
      jwtToken = createToken(existingUser.rows[0]["id"]);
    } else {
      // Insert the new user into the database
      var insertResult = await pool.query(
        "INSERT INTO public.user (created_at, password, homecity, default_role, email, first_name, last_name) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
        [
          new Date(),
          null,
          "London",
          userProfile["profile"]["title"],
          userIdentity["user"]["email"],
          userProfile["profile"]["first_name"],
          userProfile["profile"]["last_name"],
        ]
      );

      //login bussiness
      jwtToken = createToken(insertResult.rows[0]["id"]);
    }

    res.redirect(`${backendUrl}/oauthdone?code=${jwtToken}`);
  } catch (error) {
    console.error("Error during OAuth process:", error);
    res.status(500).send("Something went wrong!");
  }
});

if (process.env.LOCAL_DEVELOPMENT) {
  // Slack requires https for OAuth, but locally we want to use http
  // to avoid having to maintain our own certificates
  const options = {
    key: fs.readFileSync("client-key.pem"),
    cert: fs.readFileSync("client-cert.pem"),
  };
  https.createServer(options, app).listen(443);
  http.createServer(app).listen(10000);
} else {
  console.log("PRODUCT");
  // when we deploy on Vercel, Vercel adds HTTPS for us, so we can just use one port
  const options = {
    key: fs.readFileSync("client-key.pem"),
    cert: fs.readFileSync("client-cert.pem"),
  };
  https.createServer(options, app).listen(443);
  // when we deploy on Vercel, Vercel adds HTTPS for us, so we can just use one port
}



const port = process.env.PORT || 10000;

////sign up
// app.post("/api/signup", async (req, res) => {
//   try {
//     const { first_name, last_name, email, password, city, role } = req.body;

//     // Check if the user already exists
//     const existingUser = await pool.query(
//       "SELECT * FROM users WHERE email = $1",
//       [email]
//     );

//     if (existingUser.rows.length > 0) {
//       return res
//         .status(400)
//         .json({ error: "User with this email already exists." });
//     }

//     // Hash the password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Insert the new user into the database
//     const insertResult = await pool.query(
//       "INSERT INTO public.user (first_name, last_name, email, password, homecity, default_role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
//       [first_name, last_name, email, hashedPassword, city, role]
//     );
//     const jwtToken = createToken(insertResult.rows[0]["id"]);

//     res
//       .status(201)
//       .json({ message: "User registered successfully.", token: jwtToken });
//   } catch (error) {
//     console.error("Error during user registration:", error);
//     res.status(500).json({ error: "Something went wrong." });
//   }
// });



//cities
app.get("/api/cities", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM public.city");
    res.send(result.rows);
  } catch (error) {
    res.status(500).send("Error fetching city data");
    console.error("Error executing query:", error);
  }
});

app.get("/create-event", async (req, res) => {
  console.log(calendar)
  let newEvent = {
    summary: "hello world",
    location: "London, UK",
    startDateTime: "2023-12-02T10:00:00",
    endDateTime: "2023-12-02T17:00:00",
  };
 
  await calendar.events.insert({
    // auth: oauth2Client,
    calendarId:
      "4c572a675834bb44f3c7a1cd40456214e4a2a75fa67a890e40212effcd7d9989@group.calendar.google.com",
    requestBody: {
      summary: newEvent.summary,
      location: newEvent.location,
      // attendees: [
      //   {
      //     email: "jonathanzheng8888@gmail.com",
      //   },
      // ],
      colorId: "7",
      start: {
        dateTime: new Date(newEvent.startDateTime),
      },
      end: {
        dateTime: new Date(newEvent.endDateTime),
      },
    },
  });

  res.send("at least something")
})

app.get("/events", async (req, res) => {
  try {
    const calendarResponse = await calendar.events.list({
      calendarId:
        "4c572a675834bb44f3c7a1cd40456214e4a2a75fa67a890e40212effcd7d9989@group.calendar.google.com",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = calendarResponse.data.items;
    if (!events || events.length === 0) {
      console.log("No upcoming events found.");
      res.status(404).send("No upcoming events found.");
      return;
    }

    console.log("Upcoming 10 events:");
    events.forEach((event, i) => {
      const start = event.start.dateTime || event.start.date;
      console.log(`${start} - ${event.summary}`);
    });

    res.status(200).json(events); // Or return these events in the response
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send("Error fetching events");
  }
});


//fetching only saturdays events
// const currentDate = new Date();
// const today = currentDate.getDay(); // Get the current day of the week

// // Calculate the date for the first upcoming Saturday
// const firstSaturday = new Date(currentDate.getTime());
// const daysUntilSaturday = 6 - today; // Days until the next Saturday
// firstSaturday.setDate(firstSaturday.getDate() + daysUntilSaturday);

// // Array to store start and end dates for three Saturdays
// const saturdays = [];
// for (let i = 0; i < 3; i++) {
//   const startDate = new Date(firstSaturday.getTime());
//   startDate.setDate(startDate.getDate() + i * 7); // Increment by a week for each Saturday

//   const endDate = new Date(startDate.getTime());
//   endDate.setDate(endDate.getDate() + 1); // One day after the start date (i.e., Sunday)

//   saturdays.push({ startDate, endDate });
// }

// // Retrieve events for each of the three Saturdays
// saturdays.forEach(({ startDate, endDate }) => {
//   calendar.events.list(
//     {
//       calendarId: "primary",
//       timeMin: startDate.toISOString(),
//       timeMax: endDate.toISOString(),
//       singleEvents: true,
//       orderBy: "startTime",
//     },
//     (err, res) => {
//       if (err) {
//         console.error("Error fetching events:", err);
//         return;
//       }
//       const events = res.data.items;
//       if (events.length) {
//         console.log(
//           `Events on ${startDate.toLocaleDateString("en-US", {
//             weekday: "long",
//           })}:`
//         );
//         events.forEach((event) => {
//           console.log(`${event.summary} - ${event.start.dateTime}`);
//         });
//       } else {
//         console.log(
//           `No events found on ${startDate.toLocaleDateString("en-US", {
//             weekday: "long",
//           })}.`
//         );
//       }
//     }
//   );
// });

