"use client"

import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const screens = [
    {
        id: 1,
        headline: "Compete with Friends. Stay Active.",
        subtext: "Join step, distance, or active minute challenges with your friends and groups.",
        buttonText: "Next →",
    },
    {
        id: 2,
        headline: "We Track It for You.",
        subtext: "MilesAhead syncs your daily steps, distance, and active minutes from your phone — no input needed.",
        buttonText: "Next →",
    },
    {
        id: 3,
        headline: "Chase the Leader. Or Be One.",
        subtext: "Get real-time updates and daily nudges when someone passes you in the rankings.",
        buttonText: "Let's Go 🚀",
    },
]

export default function IntroWalkthrough() {
    const [currentScreen, setCurrentScreen] = useState(0)
    const insets = useSafeAreaInsets()
    const screenWidth = Dimensions.get("window").width
    const translateX = new Animated.Value(currentScreen * -screenWidth)

    const handleNext = () => {
        if (currentScreen < screens.length - 1) {
            Animated.timing(translateX, {
                toValue: (currentScreen + 1) * -screenWidth,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                setCurrentScreen(currentScreen + 1)
            })
        } else {
            // Handle final CTA - navigate to challenge join/create flow
            // TODO: Implement navigation
        }
    }

    const handleSkip = () => {
        // TODO: Implement skip functionality (e.g., navigate to main app)
    }

    const goToScreen = (index: number) => {
        if (index !== currentScreen) {
            Animated.timing(translateX, {
                toValue: index * -screenWidth,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                setCurrentScreen(index)
            })
        }
    }

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            {/* Main Content */}
            <View style={styles.contentContainer}>
                {/* Illustration */}
                <View style={styles.illustrationContainer}>
                    {currentScreen === 0 && (
                        <View style={styles.illustrationCenter}>
                            <Text style={styles.emoji}>🏃‍♂️🏃‍♀️👥</Text>
                            <View style={styles.leaderboardTag}>
                                <Text style={styles.leaderboardText}>Leaderboard</Text>
                            </View>
                        </View>
                    )}
                    {currentScreen === 1 && (
                        <View style={styles.illustrationCenter}>
                            <Text style={styles.emoji}>📱</Text>
                            <View style={styles.statsBox}><Text style={styles.statsText}>7,824 steps</Text></View>
                            <View style={styles.statsBox}><Text style={styles.statsText}>4.3 km</Text></View>
                            <View style={styles.statsBox}><Text style={styles.statsText}>42 active mins</Text></View>
                        </View>
                    )}
                    {currentScreen === 2 && (
                        <View style={styles.illustrationCenter}>
                            <Text style={styles.emoji}>🏆</Text>
                            <View style={styles.rankingRow}>
                                <View style={[styles.rankCircle, { backgroundColor: "#5CF2FF" }]}><Text style={styles.rankText}>1</Text></View>
                                <Text>Alex</Text>
                            </View>
                            <View style={styles.rankingRow}>
                                <View style={[styles.rankCircle, { backgroundColor: "#A1A1AA" }]}><Text style={styles.rankText}>2</Text></View>
                                <Text>You</Text>
                                <Text style={styles.rankUpText}>+2 today! 🔥</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Headline */}
                <Text style={styles.headline}>{screens[currentScreen].headline}</Text>
                {/* Subtext */}
                <Text style={styles.subtext}>{screens[currentScreen].subtext}</Text>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    {screens.map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => goToScreen(index)}
                            style={[
                                styles.progressDot,
                                index === currentScreen && styles.progressDotActive,
                            ]}
                            accessibilityLabel={`Go to screen ${index + 1}`}
                            accessibilityState={{ selected: index === currentScreen }}
                        />
                    ))}
                </View>

                {/* Next Button */}
                <TouchableOpacity
                    onPress={handleNext}
                    style={styles.nextButton}
                    accessibilityLabel={screens[currentScreen].buttonText}
                >
                    <Text style={styles.nextButtonText}>{screens[currentScreen].buttonText}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },
    skipContainer: {
        alignItems: "flex-end",
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    illustrationContainer: {
        width: "100%",
        maxWidth: 320,
        marginBottom: 32,
        aspectRatio: 1,
        backgroundColor: "#5CF2FF20",
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    illustrationCenter: {
        alignItems: "center",
        justifyContent: "center",
    },
    emoji: {
        fontSize: 48,
        marginBottom: 12,
        textAlign: "center",
    },
    leaderboardTag: {
        backgroundColor: "#FFFFFFCC",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginTop: 4,
    },
    leaderboardText: {
        color: "#52525B",
        fontSize: 14,
    },
    statsBox: {
        backgroundColor: "#FFFFFFE6",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginVertical: 2,
        marginBottom: 2,
    },
    statsText: {
        color: "#5CF2FF",
        fontWeight: "600",
        fontSize: 16,
    },
    rankingRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFFE6",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginVertical: 2,
        marginBottom: 2,
        gap: 8,
    },
    rankCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 6,
    },
    rankText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
    },
    rankUpText: {
        color: "#5CF2FF",
        fontSize: 12,
        marginLeft: 6,
    },
    headline: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#18181B",
        textAlign: "center",
        marginBottom: 8,
        marginTop: 8,
        paddingHorizontal: 8,
    },
    subtext: {
        fontSize: 16,
        color: "#52525B",
        textAlign: "center",
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    progressContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 24,
        gap: 8,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#D1D5DB",
        marginHorizontal: 4,
    },
    progressDotActive: {
        backgroundColor: "#5CF2FF",
        width: 24,
    },
    nextButton: {
        width: "100%",
        backgroundColor: "#5CF2FF",
        borderRadius: 999,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 8,
        shadowColor: "#5CF2FF",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    nextButtonText: {
        color: "#18181B",
        fontWeight: "600",
        fontSize: 16,
    },
})
