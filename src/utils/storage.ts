// Simple storage utility using AsyncStorage
// Note: AsyncStorage needs to be installed: npm install @react-native-async-storage/async-storage

let AsyncStorage: any;

try {
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
    console.warn('AsyncStorage not available');
}

export const storage = {
    async getItem(key: string): Promise<string | null> {
        if (!AsyncStorage) return null;
        try {
            return await AsyncStorage.getItem(key);
        } catch (e) {
            console.error('Storage getItem error:', e);
            return null;
        }
    },

    async setItem(key: string, value: string): Promise<void> {
        if (!AsyncStorage) return;
        try {
            await AsyncStorage.setItem(key, value);
        } catch (e) {
            console.error('Storage setItem error:', e);
        }
    },

    async removeItem(key: string): Promise<void> {
        if (!AsyncStorage) return;
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.error('Storage removeItem error:', e);
        }
    },
};
