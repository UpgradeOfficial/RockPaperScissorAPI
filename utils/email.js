const nodemailer = require("nodemailer")

const sendEmail = async (email, subject, text) => {
  console.log(process.env.EMAIL_HOST,process.env.EMAIL_PORT, process.env.EMAIL_USER, process.env.EMAIL_PASS)
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        //service: process.env.EMAIL_SERVICE,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls : { rejectUnauthorized: false }
      });
  
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: text,
        html: "<h1>this is it</h1>"
      });
      console.log("email sent sucessfully");
    } catch (error) {
      console.log("email not sent");
      console.log(error);
    }
  };
  
  module.exports = sendEmail;