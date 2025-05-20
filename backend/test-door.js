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
    
    // Subscribe to door-related topics
    client.subscribe(['home/controls/door', 'home/status/door'], (err) => {
        if (!err) {
            console.log('Subscribed to door topics');
            showHelp();
            createInterface();
        }
    });
});

// Handle incoming messages
client.on('message', (topic, message) => {
    const status = message.toString();
    if (topic === 'home/status/door') {
        console.log(`\nDoor Status Update: ${status}`);
    } else {
        console.log(`\nDoor Command Sent: ${status}`);
    }
    promptUser();
});

// Handle errors
client.on('error', (err) => {
    console.error('Connection error:', err);
});

// Show help menu
function showHelp() {
    console.log('\nDoor Control Commands:');
    console.log('1. open - Open the door');
    console.log('2. close - Close the door');
    console.log('3. status - Get current door status');
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
        case 'open':
            client.publish('home/controls/door', 'OPEN');
            break;
        case 'close':
            client.publish('home/controls/door', 'CLOSE');
            break;
        case 'status':
            console.log('Requesting door status...');
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
    rl.question('Enter door command: ', (answer) => {
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
