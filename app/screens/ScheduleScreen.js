import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import colors from '../config/colors';
function ScheduleScreen() {
    const [day] = useState('Saturday');
    const [date] = useState('1/18')
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#DEE2E6' }}>
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <Image
                        source={require('../assets/lightLineupLogo.png')}
                    />
                    <Image
                        source={require('../assets/menu.png')}
                    />
                </View>
            </View>

            <View style={styles.body}>
                <Text style={styles.headText}>
                    Schedule
                </Text>
                <View style={styles.card}>
                    <View style={{ flex: 1, borderRadius: 10, }}>
                        <View style={styles.queue}>
                            <View style={styles.rowAlign}>
                                <View style={styles.date}>
                                    <Text style={styles.dateText}>{day}</Text>
                                    <Text style={styles.dateText}>{date}</Text>
                                </View>
                                <View style={styles.queueButtonField}>
                                    <View style={styles.queueButton}>
                                        <Text style={styles.queueButtonText}>
                                            Queue now
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.back}>
                            <Text style={styles.backText}>
                                Back to Today
                            </Text>
                        </View>
                        <View style={styles.line}></View>
                    </View>
                    <View style={{ flex: 1.5 }}>

                    </View>
                </View>
                <View style={styles.navBar}>

                </View>
            </View>

            <View style={styles.footer} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        zIndex: 10,
    },
    header: {
        backgroundColor: colors.baseBlue,
        padding: 15,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    body: {
        flex: 1,
        padding: 20,
    },
    rowAlign: {
        flexDirection: 'row',
        flex: 1,
    },
    headText: {
        fontSize: 36,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 25,
    },
    card: {
        flex: 8,
        backgroundColor: colors.white,
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    queue: {
        flex: 2,
        marginTop: 35,
        marginHorizontal: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.grayBorder,
    },
    date: {
        flex: 1,
        paddingLeft: 30,
        paddingTop: 20,
    },
    dateText: {
        fontSize: 32,
        fontWeight: 800,
        color: colors.graytext,
    },
    queueButtonField: {
        flex: 1,
        justifyContent: 'center',
    },
    queueButton: {
        backgroundColor: colors.darkBlue,
        width: '85%',
        height: 45,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    queueButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 600,
    },
    back: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backText: {
        fontSize: 16,
        color: colors.graytext,
        fontWeight: 600,
        textDecorationLine: 'underline',
    },
    line: {
        borderWidth: 1,
        height: 3,
        borderColor: colors.grayButton,
    },
    services: {
        flex: 2,
    },
    navBar: {
        flex: 1,
    },
    footer: {
        backgroundColor: colors.baseBlue,
        padding: 30,
    },
});

export default ScheduleScreen;
