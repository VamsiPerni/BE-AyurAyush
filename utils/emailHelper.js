const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_MAILER_API_KEY);

const sendEmail = async (toEmail, subject, htmlText) => {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.SENDER_EMAIL,
            to: toEmail,
            subject: subject,
            html: htmlText,
        });

        if (error) {
            throw new Error(error.message);
        }

        console.log("🟡 : resp:", data);
        console.log("----------- ✅ Message sent -----------------", data);
    } catch (err) {
        console.log("----------- ❌ Error while sending mail ------------");
        console.log(err.message);
        console.log("----------- --------------------------- ------------");
        throw new Error("Email not sent");
    }
};

const sendOtpEmail = async (toEmail, otp) => {
    console.log("... Sending OTP Email to ", toEmail);
    await sendEmail(
        toEmail,
        "OTP Verification for AyurAyush HealthCare App",
        `
            <html>
            <head>
                <style>
                    div{
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                        align-items: center;
                        justify-content: center;
                        padding: 5rem;
                    }
                    h2{
                        color: darkblue;
                    }
                    h1{
                        color: chocolate;
                    }
                </style>
            </head>
            <body>
                <div>
                    <h2>Your OTP for verifying the email is: </h2>
                    <h1>${otp}</h1>
                </div>
            </body>
            </html>
        
        `,
    );
};

module.exports = { sendOtpEmail };
