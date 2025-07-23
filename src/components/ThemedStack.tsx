import React from 'react';
import type { ComponentProps } from 'react';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';

export type ThemedStackProps = ComponentProps<typeof Stack>;

export function ThemedStack(props: ThemedStackProps) {
    const colorScheme = useColorScheme() || 'light';
    const backgroundColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;

    let screenOptions = props.screenOptions;
    if (screenOptions && typeof screenOptions === 'object') {
        screenOptions = {
            ...screenOptions,
            headerStyle: [
                { backgroundColor },
                ...(screenOptions.headerStyle ? [screenOptions.headerStyle] : []),
            ],
        };
    }

    return (
        <Stack
            {...props}
            screenOptions={screenOptions}
        />
    );
} 