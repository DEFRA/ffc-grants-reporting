const auth = require('@azure/ms-rest-nodeauth')
const MessageReceiver = require('./messaging/message-receiver')
const config = require('../config').messaging

const receivedApplications = []

process.on('SIGTERM', async () => {
  await messageService.closeConnections()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await messageService.closeConnections()
  process.exit(0)
})

class MessageService {
  constructor (credentials) {
    this.closeConnections = this.closeConnections.bind(this)

    const receiveApplicationAction = async message => {
      const messageObj = JSON.parse(message)
      receivedApplications.push({
        id: messageObj.confirmationId,
        received: new Date().toISOString()
      })

      console.log('\n#####\nEOI submitted message received')
      console.log(`\nThere have been ${receivedApplications.length} applications in total:`)

      receivedApplications.forEach(application => {
        const date = application.received.split('T')[0]
        const time = application.received.split('T')[1].split('.')[0]
        console.log(`${application.id} on ${date} at ${time}`)
      })
    }

    this.applicationReceiver = new MessageReceiver('application-topic-receiver', config.applicationTopic, credentials, receiveApplicationAction)
  }

  async closeConnections () {
    await this.eligibilityReceiver.closeConnection()
  }
}

let messageService

config.isProd = process.env.NODE_ENV === 'production'

module.exports = (async function createConnections () {
  const credentials = config.isProd ? await auth.loginWithVmMSI({ resource: 'https://servicebus.azure.net' }) : undefined
  messageService = new MessageService(credentials)
  return messageService
}())
