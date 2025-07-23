/**
 * ThemedButton.tsx
 *
 * Sample button component that uses useThemeColor to dynamically apply background and text color.
 * Uses nativewind utility classes for styling in React Native.
 */

import React from 'react';
import { Pressable, Text, PressableProps, ViewStyle, StyleProp } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

interface ThemedButtonProps extends PressableProps {
    title: string;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({ title, style, ...props }) => {
    const backgroundColor = useThemeColor({}, 'highlight');
    const textColor = useThemeColor({}, 'text');

    return (
        <Pressable
            className="px-4 py-2 rounded-lg"
            style={[{ backgroundColor } as ViewStyle, style as StyleProp<ViewStyle>]}
            {...props}
        >
            <Text className="font-semibold text-base" style={{ color: textColor }}>
                {title}
            </Text>
        </Pressable>
    );
}; 