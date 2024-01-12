// import { google } from 'googleapis';
// import dotenv from 'dotenv';
// import twilio from 'twilio';
const twilio = require('twilio') 
const axios = require('axios');

// dotenv.config();

// const {
//   SID: accountSid,
//   KEY: TwilloAuthToken,
//   APIKEY: googleApiKey,
//   CX: cx
// } = process.env;
const accountSid = "AC09a9a535462a99f7b2c432c3cb585258"
const TwilloAuthToken =  "a16ef63e41325fd76eba090ccef9ac0a"

twilio(accountSid, TwilloAuthToken);
const { MessagingResponse } = twilio.twiml;
// const customsearch = google.customsearch('v1');

/**
 * @class WhatsappBot
 * @description class will implement bot functionality
 */
class WhatsappBot {
  /**
   * @memberof WhatsappBot
   * @param {object} req - Request sent to the route
   * @param {object} res - Response sent from the controller
   * @param {object} next - Error handler
   * @returns {object} - object representing response message
   */
  static async googleSearch(req, res, next) {
    const twiml = new MessagingResponse();
    const q = req.body.Body;
    // const options = { cx, q, auth: googleApiKey };
    console.log("twilio req.body --------------------------",req.body);
    console.log("twilio req.query --------------------------",req.query);
    console.log("twilio input is here --------------------------",q);

    try {
      // const result = await customsearch.cse.list(options);
      // const firstResult = result.data.items[0];
      // const searchData = firstResult.snippet;
      // const link = firstResult.link;
      const sender = "oddy_"+new Date().getTime();
      const message = q;
      const doctorId = '9685800335';
  
      callRasaWebhook(sender, message, doctorId)
        .then(response => {
          // Handle the response from Rasa
          console.log('Handling Rasa API Response:', response);
          // res.send(respo nse)
          twiml.message(`${response[0].text}`);
          res.set('Content-Type', 'text/xml');
          return res.status(200).send(twiml.toString());
        })
        .catch(error => {
          // Handle errors
          console.error('Error in Rasa API Call:', error);
          res.send(error)
        });


      
    } catch (error) {
      return next(error);
    }
  }
}

async function callRasaWebhook(sender, message, doctorId) {
  const apiUrl = 'http://localhost:5005/webhooks/rest/webhook';

  // Data to send in the request body
  const requestData = {
    sender,
    message,
    metadata: {
      doctorId,
    },
  };

  // Headers to include in the request
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'charset': 'UTF-8',
  };

  try {
    // Make a POST request to Rasa webhook
    const response = await axios.post(apiUrl, requestData, { headers });

    // Log the response from Rasa
    console.log('Rasa API Response:', response.data);

    // Return the response data
    return response.data;
  } catch (error) {
    // Log and handle errors
    console.error('Error calling Rasa API:', error.message);
    throw error;
  }
}

module.exports = WhatsappBot
// export default WhatsappBot;
