module.exports = function (RED) {
  'use strict'

  const { ev, create } = require('@open-wa/wa-automate')

  const patch = require('./patch')

  const RETRY_TIMEOUT = 10000

  const EVENTS = [
    'onMessage',
    'onAck',
    'onAddedToGroup'
  ]

  const noop = () => {}

  function WhatsappClient (config) {
    RED.nodes.createNode(this, config)
    const node = this

    var client = null

    function registerEvents () {
      for (const event of EVENTS) {
        client[event](onEvent.bind(node, event))
      }
    }

    function onEvent (eventName, ...args) {
      node.emit('clientEvent', eventName, ...args)
    }

    function onQrCode (qrCode) {
      node.emit('qrCode', qrCode)
    }

    async function startClient () {
      ev.on(`qr.${config.session}`, onQrCode)

      client = await create({
        sessionId: config.session,
        headless: config.headless,
        devtools: config.devtools,
        inDocker: config.inDocker,
        useChrome: config.useChrome
      })

      // support for sendMessageToId
      patch(client)

      client.onStateChanged((state) => {
        if (state === 'CONFLICT') {
          client.forceRefocus()
        }
        node.emit('stateChange', state)
      })

      registerEvents()
      node.emit('ready', client)
    }

    function closeClient (done) {
      done = done || noop
      if (client) {
        ev.removeAllListeners()
        client.kill
          .catch((err) => {
            node.error('Error while closing Whatsapp client "' + config.session + '": ' + err.message)
          }).finally(() => {
            node.log('Session closed')
            done()
          })
      } else {
        done()
      }
    }

    node.on('close', closeClient)

    process.on('SIGINT', function () {
      closeClient()
    })

    // check for registered nodes using configuration
    node.registeredNodeList = {}

    // trick used to not start client if there are not nodes using this client
    node.register = function (nodeToRegister) {
      node.registeredNodeList[nodeToRegister.id] = nodeToRegister
      if (Object.keys(node.registeredNodeList).length === 1) {
        startClient()
          .catch((err) => {
            node.error('Error while starting Whatsapp client "' + config.session + '": ' + err.message)
            // retry
            setTimeout(node.register.bind(node, nodeToRegister), RETRY_TIMEOUT)
          })
      }
    }

    node.restart = async function () {
      if (client) {
        await client.kill()
        await startClient()
      }
    }
  }

  RED.nodes.registerType('whatsapp-client', WhatsappClient)
}
