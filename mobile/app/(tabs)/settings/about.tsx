import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';

export default function AboutHelp() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.title}>Smart Home Automation System</Text>
          <Text style={styles.subtitle}>Capstone Project</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Project</Text>
          <Text style={styles.text}>
            Our Smart Home Automation System is designed to make daily life easier, safer, and more energy-efficient. 
            The system combines various sensors, actuators, and an ESP32 microcontroller to control features like lighting, 
            temperature, air quality, and security through this mobile application.
          </Text>
          <Text style={styles.text}>
            All devices are connected via Wi-Fi and communicate using the MQTT protocol for real-time updates, 
            allowing users to control and monitor their homes remotely and in real-time using their phones.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <Text style={styles.text}>• Motion Detection</Text>
          <Text style={styles.text}>• Gas and Smoke Alerts</Text>
          <Text style={styles.text}>• Door and Window Control</Text>
          <Text style={styles.text}>• Automated Lighting System</Text>
          <Text style={styles.text}>• Temperature-based Fan System</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Software Engineering Team</Text>
          <Text style={styles.text}>• Bünyamin Cüci - Mobile App Developer</Text>
          <Text style={styles.text}>• Emiralp Güngör - Mobile App Developer</Text>
          <Text style={styles.text}>• Yaser Dural - Backend Developer & System Integration</Text>
          <Text style={styles.text}>• Rıdvan Burak Ünal - Backend Developer</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mechatronics Engineering Team</Text>
          <Text style={styles.text}>• Waad Ahmed Elyas Hamed - System Design & Hardware</Text>
          <Text style={styles.text}>• Tamarh Al Khayat - System Design & Hardware</Text>
          <Text style={styles.text}>• Musa Coşkun - Physical Model Designer</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Advisors</Text>
          <Text style={styles.text}>• Ph.D. Hassan İMANİ - Software Engineering</Text>
          <Text style={styles.text}>• Assist. Prof Amir NAVIDFAR - Mechatronics Engineering</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.footer}>May 2025</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    marginBottom: 8,
  },
  footer: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 16,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#666',
    marginVertical: 16,
    marginBottom: 48
  },
}); 