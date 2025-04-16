const aedes = require('aedes')();
const net = require('net');

const server = net.createServer(aedes.handle);
const port = 1883;

server.listen(port, "0.0.0.0", function () {
  console.log(`🚀 Aedes MQTT broker çalışıyor (port ${port})`);
});
