const mqtt = require('mqtt');
const readline = require('readline');

// HiveMQ Cloud configuration
const config = {
    broker: 'mqtt://59ddde3344f04254b883625d2e7736e4.s1.eu.hivemq.cloud',
    options: {
        port: 8883,
        protocol: 'mqtts',
        username: 'alexdesouza',
        password: 'Alikocistifa123456',
        rejectUnauthorized: false
    }
};

// Sensor topics
const SENSOR_TOPICS = {
    TEMPERATURE: 'home/sensors/temperature',
    HUMIDITY: 'home/sensors/humidity',
    GAS: 'home/sensors/gas',
    MOTION: 'home/sensors/motion',
    LIGHT: 'home/sensors/light'
};

// Current sensor values
let sensorValues = {
    temperature: 'N/A',
    humidity: 'N/A',
    gas: 'N/A',
    motion: 'N/A',
    light: 'N/A'
};

// Create MQTT client
const client = mqtt.connect(config.broker, config.options);

// Create readline interface
let rl;

// Handle connection event
client.on('connect', () => {
    console.log('Connected to HiveMQ Cloud');
    
    // Subscribe to all sensor topics
    client.subscribe(Object.values(SENSOR_TOPICS), (err) => {
        if (!err) {
            console.log('Subscribed to all sensor topics');
            showHelp();
            createInterface();
        }
    });
});

// Handle incoming messages
client.on('message', (topic, message) => {
    const value = message.toString();
    
    switch (topic) {
        case SENSOR_TOPICS.TEMPERATURE:
            sensorValues.temperature = value + '°C';
            break;
        case SENSOR_TOPICS.HUMIDITY:
            sensorValues.humidity = value + '%';
            break;
        case SENSOR_TOPICS.GAS:
            sensorValues.gas = value;
            break;
        case SENSOR_TOPICS.MOTION:
            sensorValues.motion = value;
            break;
        case SENSOR_TOPICS.LIGHT:
            sensorValues.light = value + ' lux';
            break;
    }

    console.log('\nSensor Update:');
    displaySensorValues();
    promptUser();
});

// Handle errors
client.on('error', (err) => {
    console.error('Connection error:', err);
});

// Show help menu
function showHelp() {
    console.log('\nSensor Monitor Commands:');
    console.log('1. show - Display current sensor values');
    console.log('2. simulate - Send simulated sensor values');
    console.log('3. help - Show this help menu');
    console.log('4. exit - Close the connection\n');
}

// Display sensor values
function displaySensorValues() {
    console.log('Temperature:', sensorValues.temperature);
    console.log('Humidity:', sensorValues.humidity);
    console.log('Gas Status:', sensorValues.gas);
    console.log('Motion:', sensorValues.motion);
    console.log('Light Level:', sensorValues.light);
}

// Create readline interface
function createInterface() {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    promptUser();
}

// Simulate sensor values
function simulateSensorValues() {
    client.publish(SENSOR_TOPICS.TEMPERATURE, '25.5');
    client.publish(SENSOR_TOPICS.HUMIDITY, '60');
    client.publish(SENSOR_TOPICS.GAS, 'SAFE');
    client.publish(SENSOR_TOPICS.MOTION, 'CLEAR');
    client.publish(SENSOR_TOPICS.LIGHT, '800');
    console.log('Simulated sensor values sent');
}

// Handle user input
function handleCommand(input) {
    const command = input.toLowerCase().trim();

    switch (command) {
        case 'show':
            console.log('\nCurrent Sensor Values:');
            displaySensorValues();
            promptUser();
            break;
        case 'simulate':
            simulateSensorValues();
            break;
        case 'help':
            showHelp();
            promptUser();
            break;
        case 'exit':
            console.log('Closing connection...');
            client.end();
            rl.close();
            process.exit(0);
            break;
        default:
            console.log('Invalid command. Type "help" for available commands.');
            promptUser();
    }
}

// Prompt for user input
function promptUser() {
    rl.question('Enter sensor command: ', (answer) => {
        handleCommand(answer);
    });
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\nClosing connection...');
    client.end();
    rl.close();
    process.exit(0);
});
