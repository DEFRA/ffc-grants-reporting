const connectionDetails = {
  host: process.env.MESSAGE_QUEUE_HOST,
  password: process.env.MESSAGE_QUEUE_PASSWORD,
  username: process.env.MESSAGE_QUEUE_USER
}

module.exports = {
  applicationTopic: {
    address: process.env.APPLICATION_TOPIC_ADDRESS,
    subscription: process.env.APPLICATION_SUBSCRIPTION_ADDRESS,
    type: 'subscription',
    ...connectionDetails
  }
}
