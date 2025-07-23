import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import '@/globals.css';
import { ThemedText } from '@/components/ThemedText';
import { ThemedStack } from '@/components/ThemedStack';

SplashScreen.preventAutoHideAsync();

function Logo() {
    return (
        <View className="flex-row items-center px-2">
            <ThemedText type='subtitle'>Logo</ThemedText>
        </View>
    );
}

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
        <ThemedStack
            screenOptions={{
                headerLeft: () => <Logo />,
                headerTitle: '',
            }}
        />
    );
}
