const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = async (email, name) => {
    sgMail.send({
        to: email,
        from: 'krisjasti@gmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the Task manager App, ${name}. Let me know how you get along with the app`
    })
}

const sendCancellationEmail = async (email, name) => {
    sgMail.send({
        to: email,
        from: 'krisjasti@gmail.com',
        subject: 'Sorry to see you go',
        text: `Good bye, ${name}. I hope to see you back soon.`
    })
}

module.exports = {sendWelcomeEmail, sendCancellationEmail}