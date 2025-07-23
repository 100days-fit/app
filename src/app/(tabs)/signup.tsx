/**
 * SignupScreen.tsx
 *
 * A pixel-perfect signup screen matching the reference, using NativeWind and your custom theme.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { ThemedButton } from '../../components/ThemedButton';

export default function SignupScreen() {
    const [tab, setTab] = useState<'login' | 'register'>('login');
    const background = useThemeColor({}, 'background');
    const cardBg = '#fff';
    const highlight = useThemeColor({}, 'highlight');

    return (
        <View className="flex-1 justify-center items-center px-4" style={{ backgroundColor: background }}>
            {/* Card */}
            <View
                className="w-full max-w-md rounded-3xl shadow-lg px-6 pt-8 pb-6"
                style={{
                    backgroundColor: cardBg,
                    shadowColor: '#000',
                    shadowOpacity: 0.10,
                    shadowRadius: 16,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 8,
                }}
            >
                {/* Title */}
                <Text className="text-2xl font-bold mb-1" style={{ color: '#18181b' }}>
                    Go ahead and set up your account
                </Text>
                <Text className="text-base mb-6" style={{ color: '#6b7280' }}>
                    Sign in-up to enjoy the best managing experience
                </Text>

                {/* Tabs */}
                <View className="flex-row mb-6 bg-gray-100 rounded-full p-1">
                    <Pressable
                        className={`flex-1 py-2 rounded-full items-center ${tab === 'login' ? 'bg-background' : ''}`}
                        style={tab === 'login' ? { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 2 } : {}}
                        onPress={() => setTab('login')}
                    >
                        <Text className={`font-semibold ${tab === 'login' ? 'text-black' : 'text-gray-400'}`}>Login</Text>
                    </Pressable>
                    <Pressable
                        className={`flex-1 py-2 rounded-full items-center ${tab === 'register' ? 'bg-background' : ''}`}
                        style={tab === 'register' ? { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 2 } : {}}
                        onPress={() => setTab('register')}
                    >
                        <Text className={`font-semibold ${tab === 'register' ? 'text-black' : 'text-gray-400'}`}>Register</Text>
                    </Pressable>
                </View>

                {/* Email Input */}
                <View className="flex-row items-center border border-gray-200 rounded-xl px-3 mb-4 bg-white">
                    {/* <Image source={require('../../../assets/images/email.png')} className="w-5 h-5 mr-2" /> */}
                    <TextInput
                        className="flex-1 py-3 text-base text-gray-800"
                        placeholder="Email Address"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={{ fontFamily: 'System' }}
                    />
                </View>

                {/* Password Input */}
                <View className="flex-row items-center border border-gray-200 rounded-xl px-3 mb-2 bg-white">
                    {/* <Image source={require('../../../assets/images/lock.png')} className="w-5 h-5 mr-2" /> */}
                    <TextInput
                        className="flex-1 py-3 text-base text-gray-800"
                        placeholder="Password"
                        placeholderTextColor="#888"
                        secureTextEntry
                        style={{ fontFamily: 'System' }}
                    />
                    {/* <Image source={require('../../../assets/images/eye.png')} className="w-5 h-5 ml-2" /> */}
                </View>

                {/* Remember Me & Forgot Password */}
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                        <View className="w-4 h-4 border border-gray-400 rounded mr-2 bg-white" />
                        <Text className="text-xs text-gray-500">Remember me</Text>
                    </View>
                    <Pressable>
                        <Text className="text-xs" style={{ color: highlight }}>Forgot Password?</Text>
                    </Pressable>
                </View>

                {/* Login/Register Button */}
                <ThemedButton title={tab === 'login' ? 'Login' : 'Register'} style={{ borderRadius: 9999, marginBottom: 16 }} />

                {/* Divider */}
                <View className="flex-row items-center my-4">
                    <View className="flex-1 h-px bg-gray-200" />
                    <Text className="mx-2 text-xs text-gray-400">Or login with</Text>
                    <View className="flex-1 h-px bg-gray-200" />
                </View>

                {/* Social Buttons */}
                <View className="flex-row justify-center space-x-4">
                    <Pressable className="flex-row items-center px-4 py-2 border border-gray-200 rounded-full bg-white">
                        {/* <Image source={require('../../../assets/images/google.png')} className="w-5 h-5 mr-2" /> */}
                        <Text className="text-base text-gray-700">Google</Text>
                    </Pressable>
                    <Pressable className="flex-row items-center px-4 py-2 border border-gray-200 rounded-full bg-white">
                        {/* <Image source={require('../../../assets/images/facebook.png')} className="w-5 h-5 mr-2" /> */}
                        <Text className="text-base text-gray-700">Facebook</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
} 