module.exports = function (RED) {
  'use strict'

  const { create } = require('sulla')

  function WhatsappClient (config) {
    RED.nodes.createNode(this, config)
    const node = this

    var client = null

    async function startClient () {
      client = await create(config.session, {
        headless: config.headless,
        devtools: config.devtools
      })

      client.onStateChange((state) => {
        if (state === 'UNLAUNCHED') {
          client.useHere()
        }

        node.emit('stateChange', state)
      })
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
          .then(() => {
            node.emit('ready', client)
          })
          .catch((err) => {
            node.error('Error while starting Whatsapp client "' + config.session + '": ' + err.message)
          })
      }
    }
  }

  RED.nodes.registerType('whatsapp-client', WhatsappClient)
}
