const axios = require('axios'); // Used to make HTTP requests

/**
 * Sends a given text message to a Slack channel using an Incoming Webhook.
 * @param {string} text - The message content to send to Slack.
 * @returns {Promise<void>} - A promise that resolves when the message is sent.
 * @throws {Error} - Throws an error if the Slack webhook URL is not configured or the request fails.
 */
async function sendToSlack(text) {
  // Check if the Slack Webhook URL is configured
  if (!process.env.SLACK_WEBHOOK_URL) {
    console.error('SLACK_WEBHOOK_URL is not defined in .env file.');
    throw new Error('Slack webhook URL is not configured.');
  }

  try {
    // Make a POST request to the Slack Incoming Webhook URL
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: text, // The 'text' property is what Slack expects for the message content
    });
    console.log('Summary successfully sent to Slack!');
  } catch (error) {
    console.error('Error sending message to Slack:', error.response ? error.response.data : error.message);
    // Re-throw the error so the calling function (summarize.js) can handle it
    throw new Error('Failed to send summary to Slack.');
  }
}

module.exports = sendToSlack; // Export the function