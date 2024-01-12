var express = require('express');
var router = express.Router();
const axios = require('axios');

const apiUrl = 'http://localhost:5005/webhooks/rest/webhook';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({'Status': "Ok",'message:': "server is running "});
});

router.get('/talkUs', function(req, res, next) {
  // Data to send in the request body
  // console.log("req --------------------------",req.body);
  // console.log("req --------------------------",req.query);
 // Example usage
    const sender = 'virus';
    const message = 'Book an appointment';
    const doctorId = '9685800335';

    callRasaWebhook(sender, message, doctorId)
      .then(response => {
        // Handle the response from Rasa
        console.log('Handling Rasa API Response:', response);
        res.send(response)
      })
      .catch(error => {
        // Handle errors
        console.error('Error in Rasa API Call:', error);
        res.send(error)
      });
 // 
});

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

module.exports = router;
