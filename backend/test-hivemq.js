const mqtt = require('mqtt');

// HiveMQ Cloud configuration (matching ESP32 settings)
const broker = 'mqtt://59ddde3344f04254b883625d2e7736e4.s1.eu.hivemq.cloud';
const options = {
    port: 8883,
    protocol: 'mqtts',
    username: 'alexdesouza',
    password: 'Alikocistifa123456',
    rejectUnauthorized: false // For testing only
};

// Create MQTT client
const client = mqtt.connect(broker, options);

// Handle connection events
client.on('connect', () => {
    console.log('Connected to HiveMQ Cloud');

    // Subscribe to all home topics
    client.subscribe('home/#', (err) => {
        if (!err) {
            console.log('Subscribed to home/#');

            // Send test messages
            sendTestMessages();
        }
    });
});

// Handle incoming messages
client.on('message', (topic, message) => {
    console.log(`Received message on ${topic}: ${message.toString()}`);
});

// Handle errors
client.on('error', (err) => {
    console.error('Connection error:', err);
});

// Function to send test messages
function sendTestMessages() {
    console.log('Starting comprehensive MQTT test...');

    // Test all sensors
    console.log('\nTesting sensors...');
    client.publish('home/sensors/temperature', '25.5');
    client.publish('home/sensors/humidity', '60');
    client.publish('home/sensors/gas', 'SAFE');
    client.publish('home/sensors/motion', 'CLEAR');
    client.publish('home/sensors/light', '800');

    // Test all control commands
    setTimeout(() => {
        console.log('\nTesting controls...');
        client.publish('home/controls/door', 'OPEN');
        client.publish('home/controls/fan', 'ON');
        client.publish('home/controls/garage', 'OPEN');
        client.publish('home/controls/curtain', 'OPEN');
    }, 2000);

    // Test all status updates
    setTimeout(() => {
        console.log('\nTesting status updates...');
        client.publish('home/status/door', 'OPENED');
        client.publish('home/status/fan', 'RUNNING');
        client.publish('home/status/garage', 'OPENED');
        client.publish('home/status/curtain', 'OPENED');
    }, 4000);

    // Test opposite controls
    setTimeout(() => {
        console.log('\nTesting opposite controls...');
        client.publish('home/controls/door', 'CLOSE');
        client.publish('home/controls/fan', 'OFF');
        client.publish('home/controls/garage', 'CLOSE');
        client.publish('home/controls/curtain', 'CLOSE');
    }, 6000);

    // Test opposite status
    setTimeout(() => {
        console.log('\nTesting opposite status...');
        client.publish('home/status/door', 'CLOSED');
        client.publish('home/status/fan', 'STOPPED');
        client.publish('home/status/garage', 'CLOSED');
        client.publish('home/status/curtain', 'CLOSED');
    }, 8000);

    // Close the connection after all messages are sent
    setTimeout(() => {
        console.log('\nTest complete. Closing connection...');
        client.end();
    }, 10000);
}
