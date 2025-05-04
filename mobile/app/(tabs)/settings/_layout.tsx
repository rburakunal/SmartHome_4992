import { Stack } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface CustomHeaderProps {
  title: string;
  back?: boolean;
}

// Custom header component that matches the main Header component's height
function CustomHeader({ title, back = false }: CustomHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  return (
    <View style={[
      styles.headerContainer, 
      { paddingTop: insets.top }
    ]}>
      <View style={styles.container}>
        {back ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={Colors.light.tint} />
          </TouchableOpacity>
        ) : (
          // Add placeholder for the index screen to ensure consistent title centering
          <View style={styles.rightPlaceholder} />
        )}
        <Text style={styles.title}>{title}</Text>
        <View style={styles.rightPlaceholder} />
      </View>
    </View>
  );
}

interface HeaderOptions {
  title?: string;
  [key: string]: any;
}

interface RouteInfo {
  name: string;
  [key: string]: any;
}

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({ route, options }: { route: RouteInfo; options: HeaderOptions }) => {
          return <CustomHeader title={options.title || route.name} back={route.name !== 'index'} />;
        },
        contentStyle: {
          backgroundColor: '#F2F2F7',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: 'Account',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notifications',
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: 'About / Help',
        }}
      />
      <Stack.Screen
        name="pin"
        options={{
          title: 'Change PIN',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 60, // Match the custom header height
  },
  backButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.tint,
    flex: 1,
    textAlign: 'center',
  },
  rightPlaceholder: {
    width: 24, // To balance the back button
  }
}); 