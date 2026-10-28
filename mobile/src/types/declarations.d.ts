declare module 'react-native' {
  export const View: any;
  export const Text: any;
  export const TextInput: any;
  export const TouchableOpacity: any;
  export const ScrollView: any;
  export const FlatList: any;
  export const SafeAreaView: any;
  export const StatusBar: any;
  export const StyleSheet: any;
  export const Alert: any;
  export const BackHandler: any;
  export const ActivityIndicator: any;
  export const RefreshControl: any;
  export const Modal: any;
  export const TouchableWithoutFeedback: any;
  export const Dimensions: any;
  export const ToastAndroid: any;
  export const Platform: any;
  export const Image: any;
  export const ImageBackground: any;
  export const Linking: any;
  export const AppState: any;
  export type AppStateStatus = any;
  export type TextInputProps = any;
  export type ViewStyle = any;
  export type TextStyle = any;
}

declare module 'expo-location' {
  export enum Accuracy {
    Lowest = 1,
    Low = 2,
    Balanced = 3,
    High = 4,
    Highest = 5,
    BestForNavigation = 6,
  }
  export interface LocationObject {
    coords: {
      latitude: number;
      longitude: number;
      accuracy: number | null;
      speed: number | null;
    };
    timestamp: number;
    mocked?: boolean;
  }
  export function requestForegroundPermissionsAsync(): Promise<{ status: string }>;
  export function requestBackgroundPermissionsAsync(): Promise<{ status: string }>;
  export function getCurrentPositionAsync(options?: any): Promise<LocationObject>;
  export function startLocationUpdatesAsync(taskName: string, options?: any): Promise<void>;
  export function stopLocationUpdatesAsync(taskName: string): Promise<void>;
}

declare module 'expo-task-manager' {
  export function defineTask(taskName: string, taskExecutor: (body: any) => Promise<void> | void): void;
  export function isTaskRegisteredAsync(taskName: string): Promise<boolean>;
}

declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
  };
  export default AsyncStorage;
}
