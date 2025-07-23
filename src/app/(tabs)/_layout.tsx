import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import '@/globals.css';
import { ThemedStack } from '@/components/ThemedStack';
import { View } from 'react-native';

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('@assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <View />
    );
}
