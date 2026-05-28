import twilio from "twilio";

const client =
  twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH
  );

export const sendWhatsApp =
async (
  phone,
  message
) => {

  try {

    await client.messages.create({

      from:
        process.env.TWILIO_WHATSAPP,

      to:
        `whatsapp:+${phone}`,

      body:
        message,
    });

    console.log(
      "WhatsApp Sent"
    );

  } catch (err) {

    console.log(err);
  }
};