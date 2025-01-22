import React, { useState, useEffect, } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import { supabase } from '../config/supabaseClient'

function Ticket({ navigation }) {
    const [hasTicket, setHasTicket] = useState(true); // Change to `false` to simulate no ticket
    const [queueNumber, setQueueNumber] = useState('');
    const [transaction, setTransaction] = useState("");
    const [estimatedWaitTime, setEstimatedWaitTime] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [status, setStatus] = useState('');

    async function convertMinutes(minutes, transaction, ticket_number) {
        const now = new Date();
        const date = new Date(now);
        const year = date.getFullYear();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const formattedQueueDate = `${year}-${month}-${day}`;

        const { data: transactions, error: transactionError } = await supabase
          .from("tickets")
          .select("parent_service_id")
          .eq("transaction", transaction)
        
        const parent_id = transactions[0].parent_service_id;
        
        const { data, error } = await supabase
          .from("tickets")
          .select("queue_time, ticket_number")
          .eq("parent_service_id", parent_id)
          .gte("queue_date", `${formattedQueueDate} 00:00:00`)
          .lte("queue_date", `${formattedQueueDate} 23:59:59`)
          .neq("status", "Reject")
          .neq("status", "Complete")

        const filteredData = data.filter(
          (item) => item.ticket_number < ticket_number
        );
    
        const totalRemainingTime = Math.ceil((filteredData.length) / 10);
        
        
        const totalMinutes = minutes + (totalRemainingTime * 60)
        const hours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;

        if (hours === 0) {
          if (remainingMinutes === 1) return `${remainingMinutes} minute`
          return `${remainingMinutes} minutes`;
        } else if (remainingMinutes === 0) {
          if (hours === 1) return `${hours} hour`
          return `${hours} hours`;
        } else {
          return `${hours} hours and ${remainingMinutes} minutes`;
        }
    }
    useEffect (() => {
        const fetchTicket = async () => {
            const {data: { session }} = await supabase.auth.getSession();

            if (session) {
                const { data, error } = await supabase
                .from("tickets")
                .select(
                    "email, ticket_number, transaction, queue_time, reference_number, status, time_generated, queue_date"
                )
                .eq("email", session.user.email);
                
                if (data && data.length > 0) {
                        setQueueNumber(String(data[0].ticket_number).padStart(3, "0"))
                        setTransaction(data[0].transaction)
                        setEstimatedWaitTime(await convertMinutes(data[0].queue_time, data[0].transaction,
                            data[0].ticket_number))
                        setReferenceNumber(data[0].reference_number)
                        setStatus( data[0].status)
                } else {
                    setHasTicket(false);
                }
            }
        }
        fetchTicket()
    }, [])

    async function findRef() {
        const { data, error } = await supabase
        .from("tickets")
        .select(
          "ticket_number, transaction, queue_time, reference_number, status, queue_date"
        )
        .eq("reference_number", referenceNumber);

      if (data && data.length > 0) {
        setQueueNumber(String(data[0].ticket_number).padStart(3, "0"));
        setTransaction(data[0].transaction)
        setEstimatedWaitTime(await convertMinutes(data[0].queue_time, data[0].transaction,
            data[0].ticket_number))
        setReferenceNumber(data[0].reference_number)
        setStatus( data[0].status)
      }
      setHasTicket(true);
    }
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
                                    <Text style={styles.value}>{queueNumber}</Text>
                                </View>
                                <View style={styles.ticketDetail}>
                                    <Text style={styles.label}>Transaction:</Text>
                                    <Text style={styles.value}>{transaction}</Text>
                                </View>
                                <View style={styles.ticketDetail}>
                                    <Text style={styles.label}>Estimated Waiting Time:</Text>
                                    <Text style={styles.value}>{estimatedWaitTime}</Text>
                                </View>
                                <View style={styles.ticketDetail}>
                                    <Text style={styles.label}>Reference Number:</Text>
                                    <Text style={styles.value}>{referenceNumber}</Text>
                                </View>
                                <View style={styles.ticketDetail}>
                                    <Text style={styles.label}>Status:</Text>
                                    <Text style={styles.value}>{status}</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity onPress={findRef}>
                            <Image source={require('../assets/refresh.png')} style={styles.refreshButton} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    // Enter Reference Number UI
                    <View style={styles.ticketContainer}>
                        <View style={styles.ticket}>
                            <View style={styles.ticketBorder}>
                                <Text style={styles.ticketText}>Enter Reference Number</Text>
                                <TextInput
                                    placeholder="Reference Number"
                                    style={styles.input}
                                    onChangeText={(referenceNumber) => setReferenceNumber(referenceNumber)}
                                    value={referenceNumber}
                                    keyboardType="decimal-pad"
                                />
                                <TouchableOpacity style={styles.ticketButtonContainer}>
                                    <Text style={styles.ticketButton}
                                     onPress={findRef}>Confirm</Text>
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
                                    <Text style={styles.ticketButton}
                                    onPress={() => navigation.navigate('Schedule')}>Queue Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={findRef}>
                            <Image source={require('../assets/refresh.png')} style={styles.refreshButton} />
                        </TouchableOpacity>
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
