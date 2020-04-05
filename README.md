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

Whatsapp Bot  🤖  for Node-Red based on [sulla](https://github.com/danielcardeenas/sulla)

**BETA: This is package is under development**

## Install

Run the following command in the root directory of your Node-RED install

    npm install node-red-contrib-whatsappbot --save

## Example

<p align="center">
<img src="./icons/dashboard.png" alt="Dashboard"/>
</p>

### Flow

This is the flow to generate that Dashboard

```json
[{"id":"a8f420e0.97d56","type":"tab","label":"Whatsapp Bot","disabled":false,"info":""},{"id":"bfa62c5c.9eb82","type":"whatsapp-bot","z":"a8f420e0.97d56","name":"MyBot","client":"252f59e4.ac4286","x":567,"y":194,"wires":[["e92bb4e.feb5b48"]]},{"id":"e92bb4e.feb5b48","type":"switch","z":"a8f420e0.97d56","name":"","property":"topic","propertyType":"msg","rules":[{"t":"eq","v":"qrCode","vt":"str"},{"t":"eq","v":"onMessage","vt":"str"},{"t":"eq","v":"sendText","vt":"str"}],"checkall":"true","repair":false,"outputs":3,"x":741,"y":194,"wires":[["77f067d4.07c848"],["dfbf19ce.ab3798"],["4f03b9c2.93d938"]]},{"id":"77f067d4.07c848","type":"ui_template","z":"a8f420e0.97d56","group":"81777301.fe6b5","name":"qrCode","order":0,"width":"6","height":"6","format":"<img id=\"qrCode\"></img>\n\n<script>\n(function(scope) {\n    scope.$watch('msg', function(data) {\n        document.getElementById('qrCode').src = data.payload[0]\n    });\n    \n})(scope);\n</script>","storeOutMessages":true,"fwdInMessages":true,"templateScope":"local","x":933,"y":194,"wires":[[]]},{"id":"75111269.f4341c","type":"status","z":"a8f420e0.97d56","name":"","scope":["bfa62c5c.9eb82"],"x":751,"y":132,"wires":[["134b9473.f931fc","ed556e32.42035"]]},{"id":"134b9473.f931fc","type":"ui_text","z":"a8f420e0.97d56","group":"81777301.fe6b5","order":12,"width":0,"height":0,"name":"","label":"Status","format":"{{msg.status.text}}","layout":"row-spread","x":919,"y":132,"wires":[]},{"id":"ed556e32.42035","type":"debug","z":"a8f420e0.97d56","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","x":920,"y":66,"wires":[]},{"id":"d07a8876.493ae8","type":"ui_table","z":"a8f420e0.97d56","group":"59e0dd1.9954d24","name":"messages","order":12,"width":0,"height":0,"columns":[{"field":"from","title":"From","width":"","align":"left","formatter":"plaintext","formatterParams":{"target":"_blank"}},{"field":"text","title":"Text","width":"","align":"left","formatter":"plaintext","formatterParams":{"target":"_blank"}}],"outputs":0,"cts":false,"x":1129,"y":264,"wires":[]},{"id":"dfbf19ce.ab3798","type":"function","z":"a8f420e0.97d56","name":"onMessage","func":"\nvar messages = flow.get('messages') || []\n\nif(msg.topic === 'init') {\n    messages = []\n} else {\n    var tmp = msg.payload[0]\n\n    tmp = {\n        from: tmp.from,\n        text: tmp.content\n    }\n    \n    messages.push(tmp)\n}\n\nflow.set('messages', messages)\n\nreturn {payload: messages};","outputs":1,"noerr":0,"x":949,"y":264,"wires":[["d07a8876.493ae8"]]},{"id":"a3009aa6.fb9ec8","type":"ui_form","z":"a8f420e0.97d56","name":"sendMessage","label":"Send Message","group":"3d882eae.376e82","order":0,"width":0,"height":0,"options":[{"label":"Contact Id","value":"number","type":"text","required":true,"rows":null},{"label":"Text","value":"text","type":"text","required":true,"rows":null}],"formValue":{"number":"","text":""},"payload":"","submit":"submit","cancel":"cancel","topic":"sendText","x":184,"y":195,"wires":[["42f0775e.a41008"]]},{"id":"42f0775e.a41008","type":"function","z":"a8f420e0.97d56","name":"","func":"node.send({topic: 'sendText', payload: [msg.payload.number, msg.payload.text]})","outputs":1,"noerr":0,"x":396,"y":195,"wires":[["bfa62c5c.9eb82"]]},{"id":"4f03b9c2.93d938","type":"function","z":"a8f420e0.97d56","name":"onDelivery","func":"var success = msg.payload[0].startsWith('true')\n\n\nnode.send({payload: success ? 'Message sent' : 'Error'})","outputs":1,"noerr":0,"x":955,"y":325,"wires":[["12856084.b28aef"]]},{"id":"12856084.b28aef","type":"ui_toast","z":"a8f420e0.97d56","position":"top right","displayTime":"3","highlight":"","sendall":true,"outputs":0,"ok":"OK","cancel":"","raw":false,"topic":"","name":"","x":1151,"y":325,"wires":[]},{"id":"c920caaa.0a1ba8","type":"inject","z":"a8f420e0.97d56","name":"clear","topic":"init","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":717,"y":265,"wires":[["dfbf19ce.ab3798"]]},{"id":"252f59e4.ac4286","type":"whatsapp-client","z":"","session":"session","headless":true,"devtools":false},{"id":"81777301.fe6b5","type":"ui_group","z":"","name":"Qr Code","tab":"fce3a44.ffd5658","disp":true,"width":"6","collapse":false},{"id":"59e0dd1.9954d24","type":"ui_group","z":"","name":"Messages","tab":"fce3a44.ffd5658","disp":true,"width":"6","collapse":false},{"id":"3d882eae.376e82","type":"ui_group","z":"","name":"New Message","tab":"fce3a44.ffd5658","disp":true,"width":"6","collapse":false},{"id":"fce3a44.ffd5658","type":"ui_tab","z":"","name":"Whatsapp","icon":"dashboard","disabled":false,"hidden":false}]
```