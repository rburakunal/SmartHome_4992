#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <DHT.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <ESP32Servo.h>

const char* root_ca = \
"-----BEGIN CERTIFICATE-----\n" \
"MIIDrzCCApegAwIBAgIQCDvgVpBCRrGhdWrJWZHHSjANBgkqhkiG9w0BAQUFADBh\n" \
"MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\n" \
"d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBD\n" \
"QTAeFw0wNjExMTAwMDAwMDBaFw0zMTExMTAwMDAwMDBaMGExCzAJBgNVBAYTAlVT\n" \
"MRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j\n" \
"b20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IENBMIIBIjANBgkqhkiG\n" \
"9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4jvhEXLeqKTTo1eqUKKPC3eQyaKl7hLOllsB\n" \
"CSDMAZOnTjC3U/dDxGkAV53ijSLdhwZAAIEJzs4bg7/fzTtxRuLWZscFs3YnFo97\n" \
"nh6Vfe63SKMI2tavegw5BmV/Sl0fvBf4q77uKNd0f3p4mVmFaG5cIzJLv07A6Fpt\n" \
"43C/dxC//AH2hdmoRBBYMql1GNXRor5H4idq9Joz+EkIYIvUX7Q6hL+hqkpMfT7P\n" \
"T19sdl6gSzeRntwi5m3OFBqOasv+zbMUZBfHWymeMr/y7vrTC0LUq7dBMtoM1O/4\n" \
"gdW7jVg/tRvoSSiicNoxBN33shbyTApOB6jtSj1etX+jkMOvJwIDAQABo2MwYTAO\n" \
"BgNVHQ8BAf8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUA95QNVbR\n" \
"TLtm8KPiGxvDl7I90VUwHwYDVR0jBBgwFoAUA95QNVbRTLtm8KPiGxvDl7I90VUw\n" \
"DQYJKoZIhvcNAQEFBQADggEBAMucN6pIExIK+t1EnE9SsPTfrgT1eXkIoyQY/Esr\n" \
"hMAtudXH/vTBH1jLuG2cenTnmCmrEbXjcKChzUyImZOMkXDiqw8cvpOp/2PV5Adg\n" \
"06O/nVsJ8dWO41P0jmP6P6fbtGbfYmbW0W5BjfIttep3Sp+dWOIrWcBAI+0tKIJF\n" \
"PnlUkiaY4IBIqDfv8NZ5YBberOgOzW6sRBc4L0na4UU+Krk2U886UAb3LujEV0ls\n" \
"YSEY1QSteDwsOoBrp+uvFRTp2InBuThs4pFsiv9kuXclVzDAGySj4dzp30d8tbQk\n" \
"CAUw7C29C79Fv1C5qfPrmAESrciIxpg0X40KPMbp1ZWVbd4=\n" \
"-----END CERTIFICATE-----";

const char *ssid = "FiberHGW_ZTEX3Z_2.4GHz";
const char *password = "3hCgqTPJjf";

const char* mqtt_server = "59ddde3344f04254b883625d2e7736e4.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_username = "alexdesouza";
const char* mqtt_password = "Alikocistifa123456";

const char* topic_temperature = "home/sensors/temperature";
const char* topic_humidity = "home/sensors/humidity";
const char* topic_gas = "home/sensors/gas";
const char* topic_motion = "home/sensors/motion";
const char* topic_light = "home/sensors/light";
const char* topic_door = "home/controls/door";
const char* topic_fan = "home/controls/fan";
const char* topic_garage_door = "home/controls/garage";
const char* topic_curtain = "home/controls/curtain";          // NEW
const char* topic_curtain_status = "home/status/curtain";     // NEW

WebServer server(80);
WiFiClientSecure espClient;
PubSubClient client(espClient);

#define DHTPIN 26
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#define GAS_PIN 34
#define PIR_PIN 33
#define BUZZER_PIN 14
#define PIR2_PIN 32
#define LED_PIN 25 
#define FAN_RELAY_PIN 18
#define LED2_PIN 16
#define LED3_PIN 17  
#define LED4_PIN 19

LiquidCrystal_I2C lcd(0x27, 16, 2);
Servo doorServo;
Servo garageDoorServo;
Servo curtainServo;

int servoPin = 13; 
int garageServoPin = 4;
int curtainPin = 23;

const int openAngle = 160;
const int closeAngle = 20;

bool doorOpen = false;
bool garageOpen = false;
bool curtainOpen = false;

unsigned long lastMsg = 0;
const long interval = 5000;

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
 Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  Serial.println(message);

  if (String(topic) == topic_door) {
    if (message == "OPEN") {
      doorServo.write(90);
      client.publish("home/status/door", "OPENED");
    } else if (message == "CLOSE") {
      doorServo.write(0);
      client.publish("home/status/door", "CLOSED");
    }
  } else if (String(topic) == topic_fan) {
    if (message == "ON") {
      digitalWrite(FAN_RELAY_PIN, HIGH);
      client.publish("home/status/fan", "ON");
    } else if (message == "OFF") {
      digitalWrite(FAN_RELAY_PIN, LOW);
      client.publish("home/status/fan", "OFF");
    }
  } else if (String(topic) == topic_garage_door) {
    if (message == "OPEN") {
      openGarageDoor();
      client.publish("home/status/garage", "OPENED");
    } else if (message == "CLOSE") {
      closeGarageDoor();
      client.publish("home/status/garage", "CLOSED");
    }
  } else if (String(topic) == topic_curtain) { // NEW
    if (message == "OPEN") {
      openCurtain();
      curtainOpen = true;
      client.publish(topic_curtain_status, "OPENED");
    } else if (message == "CLOSE") {
      closeCurtain();
      curtainOpen = false;
      client.publish(topic_curtain_status, "CLOSED");
    }
  }
}

void reconnect() {
  while (!client.connected()) {
    String clientId = "ESP32Client-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      client.subscribe(topic_door);
      client.subscribe(topic_fan);
      client.subscribe(topic_garage_door);
      client.subscribe(topic_curtain); // NEW
    } else {
      delay(5000);
    }
  }
}

void publishSensorData() {
  float temp = readDHTTemperature();
  float humi = readDHTHumidity();
  int gas = digitalRead(GAS_PIN);
  int motion = digitalRead(PIR_PIN);

  if (!isnan(temp)) client.publish(topic_temperature, String(temp).c_str());
  if (!isnan(humi)) client.publish(topic_humidity, String(humi).c_str());

  client.publish(topic_gas, gas == LOW ? "DETECTED" : "SAFE");
  client.publish(topic_motion, motion == HIGH ? "DETECTED" : "CLEAR");
}

void setup_wifi() {
 delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  espClient.setCACert(root_ca);
  espClient.setInsecure(); // Only for testing, remove in production
}


void setup(void) {
  Serial.begin(115200);
  dht.begin();

  pinMode(FAN_RELAY_PIN, OUTPUT); 
  digitalWrite(FAN_RELAY_PIN, HIGH);
  pinMode(GAS_PIN, INPUT);
  pinMode(PIR_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(PIR2_PIN, INPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(LED3_PIN, OUTPUT);
  pinMode(LED4_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(LED2_PIN, HIGH);
  digitalWrite(LED3_PIN, HIGH);
  digitalWrite(LED4_PIN, HIGH);

  Wire.begin(21, 22);
  lcd.begin(16, 2); 
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("System Starting...");
  delay(2000);
  lcd.clear();

  doorServo.attach(servoPin); 
  doorServo.write(0);
  garageDoorServo.setPeriodHertz(50);
  garageDoorServo.attach(garageServoPin, 500, 2500);

  curtainServo.setPeriodHertz(50);
  curtainServo.attach(curtainPin, 500, 2400);
  closeCurtain();

  Serial.println("Use 'og'/'cg' for garage, 'o'/'c' for curtain");

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);

  if (MDNS.begin("esp32"))
  Serial.println("MDNS responder started");

  server.on("/", handleRoot);
  server.on("/toggle", handleToggle);
  server.begin();
}

void loop(void) {
  server.handleClient();
  delay(2);

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long currentMillis = millis();
  if (currentMillis - lastMsg > interval) {
    lastMsg = currentMillis;
    publishSensorData();
  }

  float temp = readDHTTemperature();
  float humi = readDHTHumidity();
  int gas = digitalRead(GAS_PIN);
  int motion2 = digitalRead(PIR2_PIN);
   if (motion2 == HIGH) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }


  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("T:");
  lcd.print(temp);
  lcd.print("C H:");
  lcd.print(humi); 
  lcd.print("%");

  lcd.setCursor(0, 1);
  if (gas == LOW) {
    lcd.print("Gas: DANGER!");
    digitalWrite(FAN_RELAY_PIN, LOW);
  } else {
    lcd.print("Gas: Safe");
    digitalWrite(FAN_RELAY_PIN, HIGH);
  }

  int motion = digitalRead(PIR_PIN);
  if (motion == HIGH) {
    lcd.print(" Motion!");
    digitalWrite(BUZZER_PIN, HIGH);
  } else {
    lcd.print(" Clear");
    digitalWrite(BUZZER_PIN, LOW);
  }

  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    input.trim();
    input.toLowerCase();

    if (input == "og") 
    openGarageDoor();
    else if (input == "cg")
    closeGarageDoor();
    else if (input == "o") {
      openCurtain();
      curtainOpen = true;
    }
    else if (input == "c") {
      closeCurtain();
      curtainOpen = false;
    }
  }

  delay(2000);
}

void handleRoot() {
  char msg[1000];
  snprintf(msg, 1000,
    "<html><head><meta name='viewport' content='width=device-width, initial-scale=1'>"
    "<title>ESP32</title></head><body>"
    "<h2>ESP32 Environment Monitor</h2>"
    "<p>Temperature: %.2f &deg;C</p>"
    "<p>Humidity: %.2f %%</p>"
    "<p>Gas Status: %s</p>"
    "<p>Motion Status: %s</p>"
    "<form action=\"/toggle\"><button type=\"submit\">Toggle Door</button></form></body></html>",
    readDHTTemperature(), readDHTHumidity(),
    readGasStatus().c_str(), readMotionStatus().c_str());
  server.send(200, "text/html", msg);
}

float readDHTTemperature() {
  float t = dht.readTemperature();
   if (isnan(t)) {
    Serial.println("Failed to read temperature from DHT!");
    return -1;
}  Serial.print("Temperature: ");
  Serial.print(t);
  Serial.println(" °C");
  return t;
}


float readDHTHumidity() {
  float h = dht.readHumidity();
  if (isnan(h)) {
    Serial.println("Failed to read humidity from DHT!");
    return -1;
  }
  Serial.print("Humidity: ");
  Serial.print(h);
  Serial.println(" %");
  return h;
}
String readGasStatus() {
  int gasValue = digitalRead(GAS_PIN);
  if (gasValue == LOW) {
    return "<span class='danger'>⚠ GAS DETECTED!</span>";
  } else {
    return "✅ Safe";
  }
}
String readMotionStatus() {
  int motionvalue = digitalRead(PIR_PIN);
  if (motionvalue == HIGH) {
    return "<span class='danger'>⚠ MOTION DETECTED!</span>";
  } else {
    return "✅ No Motion";
  }
}

void handleToggle() {
  if (doorOpen) {
    doorServo.write(0);
    client.publish(topic_door, "CLOSED");
  } else {
    doorServo.write(90);
    client.publish(topic_door, "OPENED");
  }
  doorOpen = !doorOpen;
  server.sendHeader("Location", "/");
  server.send(303);
}


void openGarageDoor() {
  garageDoorServo.write(180);  // fully open angle
  Serial.println("Garage Door: OPENING...");
  delay(7000);  // keep it rotating 7 seconds
  garageDoorServo.write(90);  // stop signal (neutral)
  Serial.println("Garage Door: OPENED");
  garageOpen = true;
}

void closeGarageDoor() {
  garageDoorServo.write(20);  // fully close angle
  Serial.println("Garage Door: CLOSING...");
  delay(7000);  // keep it rotating 7 seconds
  garageDoorServo.write(90);  // stop signal (neutral)
  Serial.println("Garage Door: CLOSED");
  garageOpen = false;
}

void openCurtain() {
  for (int angle = closeAngle; angle <= openAngle; angle++) {
    curtainServo.write(angle);
    delay(15);
  }
  curtainServo.write(openAngle);
  Serial.println("Curtain: OPENED");
}

void closeCurtain() {
  for (int angle = openAngle; angle >= closeAngle; angle--) {
    curtainServo.write(angle);
    delay(15);
  }
  curtainServo.write(closeAngle);
  Serial.println("Curtain: CLOSED");
}