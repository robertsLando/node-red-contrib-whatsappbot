
module.exports = function (client) {
  /**
 * Sends message to unknown number
 * @param {string} id
 * @param {string} message
 */
  client.sendMessageToId = async function (id, message) {
    return client.getPage().evaluate(
      async ({ id, message }) => {
        try {
          var contact = await Store.WapQuery.queryExist(id)
          if (contact.status === 404) {
            return true
          } else {
            try {
              var chat = await Store.Chat.find(contact.jid)
              await chat.sendMessage(message)
              return true
            } catch (error) {
              if (WAPI.sendMessage(id, message)) {
                return true
              } else {
                return false
              }
            }
          }
        } catch (e) {
          if (window.Store.Chat.length === 0) return false

          var firstChat = Store.Chat.models[0]
          var originalID = firstChat.id
          firstChat.id =
                      typeof originalID === 'string'
                        ? id
                        : new window.Store.UserConstructor(id, {
                          intentionallyUsePrivateConstructor: true
                        })

          await firstChat.sendMessage(message)
          firstChat.id = originalID
          return true
        }
      },
      { id, message }
    )
  }
}
