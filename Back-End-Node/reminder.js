const nodemailer = require('nodemailer');
const { pool } = require('./dbConfig');

// Create a nodemailer transporter with your email service provider's SMTP configuration
console.log(process.env.REMINDER_EMAIL_PASSWORD)
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'thisteamcyf@hotmail.com',
        pass: process.env.REMINDER_EMAIL_PASSWORD
    },
});

const getUserData = async (userId) => {
    //console.log("USERID:: ", userId)
    try {
        const result = await pool.query('SELECT * FROM person WHERE id = $1', [userId]);
        //console.log("RESULT::: ", result.rows[0])
        return result.rows; // Assuming user data is stored in the first row of the result
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

const getSessionData = async (sessionId) => {
    try {
        const result = await pool.query('SELECT session.*, lesson_content.* FROM session JOIN lesson_content ON session.lesson_content_id = lesson_content.id WHERE session.id = $1', [sessionId]);
        //console.log(result)
        return result.rows; // Assuming user data is stored in the first row of the result
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};


const reminderEmail = async (userId, sessionId) => {
    try {
        const userData = await getUserData(userId);
        //console.log("user infos::: ", userData[0].slack_email)


        const sessionData = await getSessionData(sessionId); 
        //console.log("sessionData FROM GET::: ", userData)

        const emailSubject = 'Class Reminder';
        const emailText = `Hi ${userData[0].slack_firstname}, this is a reminder for your upcoming class.`;
        const emailHTML = `
      <div style="text-align: center;">
        <img src="https://your-domain.com/path/to/your/image.jpg" alt="CodeYourFuture Logo" style="max-width: 100%;" />
      </div>
      <p>Hi ${userData[0].slack_firstname},</p>
      <p>I hope this email finds you well. I wanted to confirm that we've received your registration for the upcoming CodeYourFuture class scheduled for ${sessionData[0].date}.</p>
      <p>We're thrilled to have you on board!</p>
      <h2>Class Details:</h2>
      <p><strong>Date:</strong> ${sessionData[0].date}</p>
      <p><strong>Time:</strong> ${sessionData[0].time_start} - ${sessionData[0].time_end}</p>
      <p><strong>Class Leader:</strong> Add session.who_leading to the session table </p>
      <p><strong>Module and Week:</strong> ${sessionData[0].module} - ${sessionData[0].week_no}</p>
      <p><strong>Content Link:</strong> <a href="${sessionData[0].syllabus_link}">${sessionData[0].syllabus_link}</a></p>
      <p>Your commitment to participating in our classes is greatly appreciated, and we look forward to an engaging and enriching learning experience.</p>
      <p>If you have any questions or if there are any changes to your availability, please don't hesitate to reach out. Thank you for being a part of CodeYourFuture!</p>
      <p>Best regards,</p>
      <p>CYF Team.</p>
      <div style="text-align: center;">
        <a href="https://your-domain.com/path/to/your/link">Click here for more information</a>
      </div>
    `;

        await transporter.sendMail({
            from: 'thisteamcyf@hotmail.com',
            to: userData[0].slack_email,
            subject: emailSubject,
            text: emailText,
            html: emailHTML,
        }); 

/*         await transporter.sendMail({
            from: 'thisteamcyf@hotmail.com',
            to: "nsaimkorkmaz1@gmail.com",
            subject: "test email",
            text: "email is testing",
            html: "<div>hello</div>"
        }); */

        console.log('Reminder email sent successfully.');
    } catch (error) {
        console.error('Error sending reminder email:', error);
    }
};

module.exports = reminderEmail