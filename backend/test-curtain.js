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
    
    // Subscribe to curtain-related topics
    client.subscribe(['home/controls/curtain', 'home/status/curtain'], (err) => {
        if (!err) {
            console.log('Subscribed to curtain topics');
            showHelp();
            createInterface();
        }
    });
});

// Handle incoming messages
client.on('message', (topic, message) => {
    const status = message.toString();
    if (topic === 'home/status/curtain') {
        console.log(`\nCurtain Status Update: ${status}`);
    } else {
        console.log(`\nCurtain Command Sent: ${status}`);
    }
    promptUser();
});

// Handle errors
client.on('error', (err) => {
    console.error('Connection error:', err);
});

// Show help menu
function showHelp() {
    console.log('\nCurtain Control Commands:');
    console.log('1. open - Open the curtain');
    console.log('2. close - Close the curtain');
    console.log('3. status - Get current curtain status');
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
            client.publish('home/controls/curtain', 'OPEN');
            break;
        case 'close':
            client.publish('home/controls/curtain', 'CLOSE');
            break;
        case 'status':
            console.log('Requesting curtain status...');
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
    rl.question('Enter curtain command: ', (answer) => {
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
