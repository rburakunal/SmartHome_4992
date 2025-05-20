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

// Create MQTT client
const client = mqtt.connect(config.broker, config.options);

// Create readline interface
let rl;

// Handle connection event
client.on('connect', () => {
    console.log('Connected to HiveMQ Cloud');
    
    // Subscribe to fan-related topics
    client.subscribe(['home/controls/fan', 'home/status/fan'], (err) => {
        if (!err) {
            console.log('Subscribed to fan topics');
            showHelp();
            createInterface();
        }
    });
});

// Handle incoming messages
client.on('message', (topic, message) => {
    const status = message.toString();
    if (topic === 'home/status/fan') {
        console.log(`\nFan Status Update: ${status}`);
    } else {
        console.log(`\nFan Command Sent: ${status}`);
    }
    promptUser();
});

// Handle errors
client.on('error', (err) => {
    console.error('Connection error:', err);
});

// Show help menu
function showHelp() {
    console.log('\nFan Control Commands:');
    console.log('1. on - Turn on the fan');
    console.log('2. off - Turn off the fan');
    console.log('3. status - Get current fan status');
    console.log('4. help - Show this help menu');
    console.log('5. exit - Close the connection\n');
}

// Create readline interface
function createInterface() {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    promptUser();
}

// Handle user input
function handleCommand(input) {
    const command = input.toLowerCase().trim();

    switch (command) {
        case 'on':
            client.publish('home/controls/fan', 'ON');
            break;
        case 'off':
            client.publish('home/controls/fan', 'OFF');
            break;
        case 'status':
            console.log('Requesting fan status...');
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
    rl.question('Enter fan command: ', (answer) => {
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
