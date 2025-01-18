import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import colors from '../config/colors';
import { useFonts } from 'expo-font';

function LoginScreen({ navigation }) {
    const [fontsLoaded] = useFonts({
        'Inter-Regular': require('../assets/fonts/Inter_18pt-Regular.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter_18pt-Bold.ttf'),
      });
    
      if (!fontsLoaded) {
        return (
          <SafeAreaView style={styles.container}>
            <ActivityIndicator size="large" color={colors.baseBlue} />
          </SafeAreaView>
        );
      }

    const [isLogin, setIsLogin] = useState(true);
    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../assets/lineupLogo.png')} style={styles.logo} />

            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, isLogin && styles.activeButton]}
                    onPress={() => setIsLogin(true)}
                >
                    <Text style={[styles.toggleText, isLogin && styles.activeText]}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, !isLogin && styles.activeButton]}
                    onPress={() => setIsLogin(false)}
                >
                    <Text style={[styles.toggleText, !isLogin && styles.activeText]}>Register</Text>
                </TouchableOpacity>
            </View>

            <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
            <TextInput placeholder="Password" style={styles.input} secureTextEntry />
            {!isLogin && (
                <TextInput placeholder="Confirm Password" style={styles.input} secureTextEntry />
            )}

            <TouchableOpacity
                style={styles.loginButton}
                onPress={() => {
                    if (isLogin) {
                        navigation.navigate('Home'); 
                    } else {
                        navigation.navigate('Home')
                    }
                }}
            >
                <Text style={styles.loginButtonText}>{isLogin ? 'Login' : 'Register'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.googleButton} onPress={() => {
                alert("no function yet")
            }}>
                <Image
                    source={require('../assets/googleIcon.png')}
                    style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>
                    {isLogin ? 'Login with Google' : 'Register with Google'}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        padding: 20,
    },
    logo: {
        width: 170,
        height: 70,
        marginBottom: 40,
        resizeMode: 'contain',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: colors.darkBlue,
        alignItems: 'center',
    },
    activeButton: {
        backgroundColor: colors.darkBlue,
    },
    toggleText: {
        fontSize: 16,
        color: colors.darkBlue,
    },
    activeText: {
        color: colors.white,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: colors.grayBorder,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: colors.darkBlue,
        width: '100%',
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    loginButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderColor: colors.grayBorder,
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        width: '100%',
        justifyContent: 'center',
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    googleButtonText: {
        color: "#414651",
        fontSize: 16,
        fontWeight: 600,
    },
});
