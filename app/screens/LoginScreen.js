import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import colors from '../config/colors';
import { useFonts } from 'expo-font';
import { supabase } from '../config/supabaseClient'
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
    const [fontsLoaded] = useFonts({
        'Inter-Regular': require('../assets/fonts/Inter_18pt-Regular.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter_18pt-Bold.ttf'),
      });
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmPassword] = useState('')

    async function signInWithEmail() {
        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
        })

        if (error) {
            alert(error.message)
            return
        }
        navigation.navigate('Home')
    }

    async function signUpWithEmail() {
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) {
            alert(error.message) 
            return
        }
        if (password == confirmpassword) {
            if (!session) {
                alert('You are now registered!') 
                navigation.navigate('Home')
            }
        }
    }

    const googleSignIn = async () => {
        try {
          // Generate the redirect URL specific to your environment
          const redirectUrl = Linking.createURL('auth/callback');
          
          // Start the OAuth sign-in process
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: redirectUrl, // Ensure this matches your Supabase redirect URL
            },
          });
      
          if (error) {
            console.error('Error during sign-in:', error.message);
            return;
          }
      
          // Open the OAuth URL in the system browser
          const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      
          if (result.type === 'success' && result.url) {
            // Retrieve the active session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
            if (sessionError) {
              console.error('Error retrieving session:', sessionError.message);
              return;
            }
      
            if (session) {
              console.log('Sign-in successful:', session);
              alert(`Welcome, ${session.user.email}`);
              navigation.navigate('Home'); // Navigate to the Home screen
            } else {
              console.error('No active session found after sign-in.');
            }
          } else {
            console.log('User cancelled the sign-in process.');
          }
        } catch (error) {
          console.error('Unexpected error during Google sign-in:', error.message);
        }
      };  
      
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

            <TextInput 
                placeholder="Email" 
                style={styles.input} 
                keyboardType="email-address"
                onChangeText={(text) => setEmail(text)}
                value={email}
                autoCapitalize={'none'}
                 />
            <TextInput 
                placeholder="Password" 
                style={styles.input} secureTextEntry
                onChangeText={(text) => setPassword(text)}
                value={password}
                autoCapitalize={'none'}
                 />
            {!isLogin && (
                <TextInput 
                placeholder="Confirm Password" 
                style={styles.input} secureTextEntry 
                onChangeText={(text) => setConfirmPassword(text)}
                value={confirmpassword}
                autoCapitalize={'none'}
                />
            )}

            <TouchableOpacity
                style={styles.loginButton}
                onPress={isLogin ? signInWithEmail : signUpWithEmail}
            >
                <Text style={styles.loginButtonText}>{isLogin ? 'Login' : 'Register'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.googleButton} onPress={googleSignIn}>
                <Image
                    source={require('../assets/googleIcon.png')}
                    style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>
                    {isLogin ? 'Login with Google' : 'Login with Google'}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

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
        width: '45%',
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
        width: '90%',
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
        width: '90%',
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
        width: '90%',
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
