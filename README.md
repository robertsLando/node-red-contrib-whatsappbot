# node-red-contrib-whatsappbot

[![NPM version](http://img.shields.io/npm/v/node-red-contrib-whatsappbot.svg)](https://www.npmjs.com/package/node-red-contrib-whatsappbot)
[![Downloads](https://img.shields.io/npm/dm/node-red-contrib-whatsappbot.svg)](https://www.npmjs.com/package/node-red-contrib-whatsappbot)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.png?v=103)](https://opensource.org/licenses/mit-license.php)

[![NPM](https://nodei.co/npm/node-red-contrib-whatsappbot.png?downloads=true)](https://nodei.co/npm/node-red-contrib-whatsappbot/)

<a href="https://www.buymeacoffee.com/MVg9wc2HE" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

<p align="center">
<img src="./icons/logo.png" alt="Logo"/>
</p>

Whatsapp Bot  🤖  for Node-Red based on [open-wa/wa-automate-nodejs](https://github.com/open-wa/wa-automate-nodejs)

## Install

Run the following command in the root directory of your Node-RED install

    npm install node-red-contrib-whatsappbot --save

## APIs

In order to send a message to an Unknown number use the api `sendMessageToId(to, text)` where `ŧo` is the number of the receiver (with prefix) and `@c.us` at the end.

To all other APIs check: [here](https://open-wa.github.io/wa-automate-nodejs/classes/client.html)

## Example

<p align="center">
<img src="./icons/dashboard.png" alt="Dashboard"/>
</p>

## Flow

This is the flow to generate that Dashboard

```json
[{"id":"d8c44ad8.5e2e68","type":"tab","label":"Whatsapp Bot","disabled":false,"info":""},{"id":"b5198939.2be368","type":"switch","z":"d8c44ad8.5e2e68","name":"","property":"topic","propertyType":"msg","rules":[{"t":"eq","v":"qrCode","vt":"str"},{"t":"eq","v":"onMessage","vt":"str"},{"t":"eq","v":"sendText","vt":"str"},{"t":"eq","v":"onAck","vt":"str"}],"checkall":"true","repair":false,"outputs":4,"x":741,"y":194,"wires":[["1cd45d74.c16253"],["b498693e.8eed3"],["8f74e8e0.d07fe8"],["6dc09d27.2a8384"]]},{"id":"1cd45d74.c16253","type":"ui_template","z":"d8c44ad8.5e2e68","group":"4b48944c.79a3ec","name":"qrCode","order":0,"width":"6","height":"6","format":"<img id=\"qrCode\"></img>\n\n<script>\n(function(scope) {\n    scope.$watch('msg', function(data) {\n        document.getElementById('qrCode').src = data.payload[0]\n    });\n    \n})(scope);\n</script>","storeOutMessages":true,"fwdInMessages":true,"templateScope":"local","x":933,"y":194,"wires":[["9294921f.4deca"]]},{"id":"1e58501.4d5dc3","type":"status","z":"d8c44ad8.5e2e68","name":"","scope":["b794ce6.780623"],"x":751,"y":132,"wires":[["9eb349b0.386e2","1be9b3d5.eb54c4"]]},{"id":"9eb349b0.386e2","type":"ui_text","z":"d8c44ad8.5e2e68","group":"4b48944c.79a3ec","order":12,"width":"3","height":"3","name":"","label":"Status","format":"{{msg.status.text}}","layout":"row-spread","x":919,"y":132,"wires":[]},{"id":"1be9b3d5.eb54c4","type":"debug","z":"d8c44ad8.5e2e68","name":"","active":false,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","x":920,"y":66,"wires":[]},{"id":"92c3a9e9.b50b48","type":"ui_table","z":"d8c44ad8.5e2e68","group":"d41cc36a.f46ce8","name":"messages","order":12,"width":"7","height":"6","columns":[{"field":"from","title":"From","width":"","align":"center","formatter":"plaintext","formatterParams":{"target":"_blank"}},{"field":"text","title":"Text","width":"","align":"center","formatter":"plaintext","formatterParams":{"target":"_blank"}}],"outputs":0,"cts":false,"x":1129,"y":264,"wires":[]},{"id":"b498693e.8eed3","type":"function","z":"d8c44ad8.5e2e68","name":"onMessage","func":"\nvar messages = flow.get('messages') || []\n\nif(msg.topic === 'init') {\n    messages = []\n} else {\n    var tmp = msg.payload[0]\n\n    tmp = {\n        from: tmp.from,\n        text: tmp.body\n//        text: tmp.content\n    }\n    \n    messages.push(tmp)\n}\n\nflow.set('messages', messages)\n\nreturn {payload: messages};","outputs":1,"noerr":0,"x":949,"y":264,"wires":[["92c3a9e9.b50b48"]]},{"id":"2a869748.8859f","type":"ui_form","z":"d8c44ad8.5e2e68","name":"sendMessage","label":"Send Message","group":"12e54b9f.dd1214","order":0,"width":"0","height":"0","options":[{"label":"Contact Id","value":"number","type":"text","required":true,"rows":null},{"label":"Text","value":"text","type":"text","required":true,"rows":null}],"formValue":{"number":"","text":""},"payload":"","submit":"submit","cancel":"cancel","topic":"sendText","x":184,"y":195,"wires":[["15304ff8.cd58c"]]},{"id":"15304ff8.cd58c","type":"function","z":"d8c44ad8.5e2e68","name":"","func":"node.send({topic: 'sendMessageToId', payload: [msg.payload.number, msg.payload.text]})\n//sendText","outputs":1,"noerr":0,"x":370,"y":200,"wires":[["1be9b3d5.eb54c4","2fdea1c1.c396ce"]]},{"id":"8f74e8e0.d07fe8","type":"function","z":"d8c44ad8.5e2e68","name":"onDelivery","func":"var success = msg.payload[0].startsWith('true')\n\n\nnode.send({payload: success ? 'Message sent' : 'Error'})","outputs":1,"noerr":0,"x":955,"y":325,"wires":[["7d941d5b.f458ac"]]},{"id":"7d941d5b.f458ac","type":"ui_toast","z":"d8c44ad8.5e2e68","position":"top right","displayTime":"3","highlight":"","sendall":true,"outputs":0,"ok":"OK","cancel":"","raw":false,"topic":"","name":"","x":1151,"y":325,"wires":[]},{"id":"7d323fa0.885de","type":"inject","z":"d8c44ad8.5e2e68","name":"clear","topic":"init","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":717,"y":265,"wires":[["b498693e.8eed3","6dc09d27.2a8384"]]},{"id":"9294921f.4deca","type":"debug","z":"d8c44ad8.5e2e68","name":"","active":false,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","x":1150,"y":200,"wires":[]},{"id":"df7f5251.016888","type":"debug","z":"d8c44ad8.5e2e68","name":"","active":false,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","x":1110,"y":120,"wires":[]},{"id":"5bc299d3.3c5ab8","type":"ui_table","z":"d8c44ad8.5e2e68","group":"d249ed7e.23e2b8","name":"messages out","order":12,"width":"7","height":"6","columns":[{"field":"from","title":"From","width":"","align":"center","formatter":"plaintext","formatterParams":{"target":"_blank"}},{"field":"text","title":"Text","width":"","align":"center","formatter":"plaintext","formatterParams":{"target":"_blank"}}],"outputs":0,"cts":false,"x":1140,"y":380,"wires":[]},{"id":"6dc09d27.2a8384","type":"function","z":"d8c44ad8.5e2e68","name":"onMessage","func":"\nvar messages = flow.get('messages') || []\n\nif(msg.topic === 'init') {\n    messages = []\n} else {\n    var tmp = msg.payload[0]\n\n    tmp = {\n        from: tmp.from,\n        text: tmp.body\n//        text: tmp.content\n    }\n    \n    messages.push(tmp)\n}\n\nflow.set('messages', messages)\n\nreturn {payload: messages};","outputs":1,"noerr":0,"x":950,"y":380,"wires":[["5bc299d3.3c5ab8","df7f5251.016888"]]},{"id":"2fdea1c1.c396ce","type":"whatsapp-bot","z":"d8c44ad8.5e2e68","name":"","client":"c89debd1.711d18","x":560,"y":200,"wires":[["b5198939.2be368"]]},{"id":"4b48944c.79a3ec","type":"ui_group","z":"","name":"Qr Code","tab":"f3aebebb.221c18","order":1,"disp":true,"width":"7","collapse":false},{"id":"d41cc36a.f46ce8","type":"ui_group","z":"","name":"Messages","tab":"f3aebebb.221c18","order":2,"disp":true,"width":"8","collapse":false},{"id":"12e54b9f.dd1214","type":"ui_group","z":"","name":"New Message","tab":"f3aebebb.221c18","order":3,"disp":true,"width":"6","collapse":false},{"id":"d249ed7e.23e2b8","type":"ui_group","z":"","name":"Mesage out","tab":"f3aebebb.221c18","order":4,"disp":true,"width":"8","collapse":false},{"id":"c89debd1.711d18","type":"whatsapp-client","z":"","session":"session","headless":true,"devtools":false},{"id":"f3aebebb.221c18","type":"ui_tab","z":"","name":"Whatsapp","icon":"dashboard","disabled":false,"hidden":false}]
```