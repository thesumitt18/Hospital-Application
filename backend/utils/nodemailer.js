const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sumitsdd24@gmail.com", 
    pass: "lffl qddt evoa mugb", 
  },
});




// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(to, subject, template) {
  try{
  const info = await transporter.sendMail({
    from: 'sumitsdd24@gmail.com',
    to, 
    subject, 
    html: template, 
  });

  console.log("Message sent: %s", info.messageId);
}
catch(err){
  console.log(err);
}}

module.exports = sendEmail;