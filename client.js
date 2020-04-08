module.exports = function (RED) {
  'use strict'

  const { create } = require('sulla')

  const RETRY_TIMEOUT = 10000

  const EVENTS = [
    'onMessage',
    'onAck',
    'onAddedToGroup'
  ]

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
      client = await create(config.session, onQrCode, {
        headless: config.headless,
        devtools: config.devtools
      })

      client.onStateChange((state) => {
        if (state === 'UNLAUNCHED') {
          client.useHere()
        }

        node.emit('stateChange', state)
      })

      registerEvents()
      node.emit('ready', client)
    }

    node.on('close', function (done) {
      if (client) {
        client.close
          .then(() => done())
          .catch((err) => {
            node.error('Error while closing Whatsapp client "' + config.session + '": ' + err.message)
            done()
          })
      } else {
        done()
      }
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
        await client.close()
        await startClient()
      }
    }
  }

  RED.nodes.registerType('whatsapp-client', WhatsappClient)
}
