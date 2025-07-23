import React from 'react';
// import { Text, TouchableOpacity, View } from 'react-native';
// import { Link } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function HomePage() {
    return (
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ThemedText type='title'>MilesAhead</ThemedText>
        </ThemedView>
    );
} 