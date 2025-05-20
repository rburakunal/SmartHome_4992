const mqtt = require('mqtt');

// MQTT Topics
const TOPICS = {
  SENSORS: {
    TEMPERATURE: 'home/sensors/temperature',
    HUMIDITY: 'home/sensors/humidity',
    GAS: 'home/sensors/gas',
    MOTION: 'home/sensors/motion',
    LIGHT: 'home/sensors/light'
  },
  CONTROLS: {
    DOOR: 'home/controls/door',
    FAN: 'home/controls/fan',
    GARAGE: 'home/controls/garage',
    CURTAIN: 'home/controls/curtain'
  },
  STATUS: {
    DOOR: 'home/status/door',
    FAN: 'home/status/fan',
    GARAGE: 'home/status/garage',
    CURTAIN: 'home/status/curtain'
  }
};

// HiveMQ Cloud configuration
const config = {
  broker: 'mqtt://59ddde3344f04254b883625d2e7736e4.s1.eu.hivemq.cloud',
  options: {
    port: 8883,
    protocol: 'mqtts',
    username: 'alexdesouza',
    password: 'Alikocistifa123456',
    rejectUnauthorized: false // For testing only
  }
};

// Create MQTT client
const client = mqtt.connect(config.broker, config.options);

// Handle connection
client.on('connect', () => {
  console.log('Connected to HiveMQ Cloud');

  // Subscribe to all home topics
  client.subscribe('home/#', (err) => {
    if (!err) {
      console.log('Subscribed to all home/# topics');
    } else {
      console.error('Subscription error:', err);
    }
  });
});

// Handle incoming messages
client.on('message', (topic, message) => {
  const messageStr = message.toString();
  console.log(`Received on ${topic}: ${messageStr}`);

  // Log sensor data
  switch (topic) {
    case TOPICS.SENSORS.TEMPERATURE:
      console.log(`Temperature: ${messageStr}°C`);
      break;
    case TOPICS.SENSORS.HUMIDITY:
      console.log(`Humidity: ${messageStr}%`);
      break;
    case TOPICS.SENSORS.GAS:
      console.log(`Gas Status: ${messageStr}`);
      break;
    case TOPICS.SENSORS.MOTION:
      console.log(`Motion Status: ${messageStr}`);
      break;
  }

  // Log control actions
  switch (topic) {
    case TOPICS.CONTROLS.DOOR:
      console.log(`Door Control: ${messageStr}`);
      break;
    case TOPICS.CONTROLS.FAN:
      console.log(`Fan Control: ${messageStr}`);
      break;
    case TOPICS.CONTROLS.GARAGE:
      console.log(`Garage Control: ${messageStr}`);
      break;
    case TOPICS.CONTROLS.CURTAIN:
      console.log(`Curtain Control: ${messageStr}`);
      break;
  }

  // Log status updates
  switch (topic) {
    case TOPICS.STATUS.DOOR:
      console.log(`Door Status: ${messageStr}`);
      break;
    case TOPICS.STATUS.FAN:
      console.log(`Fan Status: ${messageStr}`);
      break;
    case TOPICS.STATUS.GARAGE:
      console.log(`Garage Status: ${messageStr}`);
      break;
    case TOPICS.STATUS.CURTAIN:
      console.log(`Curtain Status: ${messageStr}`);
      break;
  }
});

// Handle errors
client.on('error', (err) => {
  console.error('Connection error:', err);
});

// Handle close
client.on('close', () => {
  console.log('Connection to HiveMQ Cloud closed');
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Closing MQTT connection...');
  client.end();
  process.exit();
});

