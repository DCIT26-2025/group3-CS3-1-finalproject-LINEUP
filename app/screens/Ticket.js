import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import colors from '../config/colors';

function Ticket() {
    const [hasTicket, setHasTicket] = useState(true); // Change to `false` to simulate no ticket
    const ticketDetails = {
        queueNumber: '001',
        transaction: "Student Driver's Permit",
        estimatedWaitTime: '01 hours 50 minutes 00 seconds',
        referenceNumber: '2024231102001',
        status: 'Pending',
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <Image source={require('../assets/lightLineupLogo.png')} />
                    <Image source={require('../assets/menu.png')} />
                </View>
            </View>

            {/* Body */}
            <View style={styles.body}>
                <Text style={styles.title}>Ticket</Text>
                <View style={styles.line}></View>

                {hasTicket ? (
                    // Ticket Details UI
                    <View style={styles.ticketDetailsContainer}>
                        <View style={styles.ticket}>
                            <View style={styles.ticketBorder}>
                                <View style={styles.ticketDetail}>
                                    <Text style={styles.label}>Queue Number:</Text>
                                    <Text style={styles.value}>{ticketDetails.queueNumber}</Text>
                                </View>
                                <View style={styles.ticketDetail}>
                                    <Text style={styles.label}>Transaction:</Text>
                                    <Text style={styles.value}>{ticketDetails.transaction}</Text>
                                </View>
                                <View style={styles.ticketDetail}>
                                    <Text style={styles.label}>Estimated Waiting Time:</Text>
                                    <Text style={styles.value}>{ticketDetails.estimatedWaitTime}</Text>
                                </View>
                                <View style={styles.ticketDetail}>
                                    <Text style={styles.label}>Reference Number:</Text>
                                    <Text style={styles.value}>{ticketDetails.referenceNumber}</Text>
                                </View>
                                <View style={styles.ticketDetail}>
                                    <Text style={styles.label}>Status:</Text>
                                    <Text style={styles.value}>{ticketDetails.status}</Text>
                                </View>
                            </View>
                        </View>
                        <Image source={require('../assets/refresh.png')} onPress={() => console.log('Refresh Ticket')} style={styles.refreshButton} />
                    </View>
                ) : (
                    // Enter Reference Number UI
                    <View style={styles.ticketContainer}>
                        <View style={styles.ticket}>
                            <View style={styles.ticketBorder}>
                                <Text style={styles.ticketText}>Enter Reference Number</Text>
                                <TextInput
                                    placeholder="732987329732"
                                    style={styles.input}
                                    keyboardType="decimal-pad"
                                />
                                <TouchableOpacity style={styles.ticketButtonContainer}>
                                    <Text style={styles.ticketButton}>Confirm</Text>
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        color: colors.graytext,
                                        fontWeight: '600',
                                        fontSize: 17,
                                        marginVertical: 30,
                                    }}
                                >
                                    ---------- or ----------
                                </Text>
                                <TouchableOpacity style={styles.ticketButtonContainer}>
                                    <Text style={styles.ticketButton}>Queue Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Image source={require('../assets/refresh.png')} onPress={() => console.log('Refresh Ticket')} style={styles.refreshButton} />
                    </View>
                )}
            </View>

            {/* Footer */}
            <View style={styles.footer} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundGray,
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
        padding: 25,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        textAlign: 'center',
        marginVertical: 20,
    },
    line: {
        borderWidth: 2,
        height: 1,
        borderColor: colors.grayButton,
        width: '100%',
    },
    ticketContainer: {
        flex: 1,
        alignItems: 'center',
    },
    ticket: {
        backgroundColor: colors.white,
        width: '90%',
        borderRadius: 10,
        padding: 10,
    },
    ticketBorder: {
        borderRadius: 10,
        borderWidth: 5,
        borderColor: 'black',
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ticketText: {
        color: colors.graytext,
        fontWeight: '800',
        fontSize: 17,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: colors.grayBorder,
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 20,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    ticketButtonContainer: {
        marginVertical: 10,
    },
    ticketButton: {
        backgroundColor: colors.baseBlue,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    ticketDetailsContainer: {
        flex: 1,
        alignItems: 'center',
    },
    ticketDetail: {
        width: '90%',
        marginBottom: 10,
        alignItems: 'center',
        borderColor: colors.grayBorder,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.graytext,
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.baseBlue,
    },
    refreshButton: {
        marginTop: 30,
        alignItems: 'center',
    },
    footer: {
        backgroundColor: colors.baseBlue,
        padding: 30,
    },
});

export default Ticket;
