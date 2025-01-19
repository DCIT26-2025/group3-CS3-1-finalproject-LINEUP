import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, Modal, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import colors from '../config/colors';
import { supabase } from '../config/supabaseClient'
const ScheduleScreen = ({ navigation }) => {
    const swiperRef = useRef(null);
    const services = ['Licensing', 'Registration', 'LETAS'];
    const [specificServices, setspecificServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState(Array(7).fill(null));
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedDayIndex, setSelectedDayIndex] = useState(null);
    const [isViewModalVisible, setViewModalVisible] = useState(false);
    const [selectedSpecificService, setSelectedSpecificService] = useState(null); // New state to track selected specific service

    const selectServiceForDay = (dayIndex, service) => {
        const newSelectedServices = [...selectedServices];
        newSelectedServices[dayIndex] = service;
        setSelectedServices(newSelectedServices);
    };

    const handleSwiperIndexChange = (index) => {
        const newSelectedServices = [...selectedServices];
        newSelectedServices[index] = null;
        setSelectedServices(newSelectedServices);
    };

    const handleBackToToday = () => {
        const todayIndex = 0;
        if (swiperRef.current) {
            swiperRef.current.scrollTo(todayIndex, true);
            setSelectedDayIndex(todayIndex);
        } else {
            console.warn('Swiper is not yet initialized');
        }
    };

        const [mainservice, setServices] = useState([
          { id: 1, key: "Licensing", limit: "DriverLicenseLimit"},
          { id: 2, key: "Registration", limit: "VehicleRegistrationLimit"},
          { id: 3, key: "LETAS", limit: "LawEnforcementLimit"},
        ]);
      
        const [serviceCounts, setServiceCounts] = useState({});
        const [serviceLimits, setServiceLimits] = useState({});
        const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchQueue = async () => {
            
            const today = new Date();
            const utcDate = new Date(today.getTime() + today.getTimezoneOffset() * 60000); // Convert to UTC
            const manilaOffset = 16 * 60 * 60 * 1000; // Manila is UTC+8
            const manilaTime = new Date(utcDate.getTime() + manilaOffset);
            
            const dateRanges = Array.from({ length: 7 }, (_, i) => {
                const currentDay = new Date(manilaTime);
                currentDay.setDate(manilaTime.getDate() + i );
                const start = new Date(currentDay);
                start.setHours(0, 0, 0, 0);
                const end = new Date(currentDay);
                end.setHours(23, 59, 59, 999);
                return { start, end };
              });


            const { data: tickets, error: ticketError } = await supabase
            .from("tickets")
            .select("service_id, parent_service_id, queue_date");

            if (ticketError) {
                console.error("Error fetching tickets:", error);
                return;
            }

            // Process tickets locally
            const countsByService = {};
            mainservice.forEach((service) => {
            const counts = Array(7).fill(0);
            dateRanges.forEach((range, i) => {
                counts[i] = tickets.filter((ticket) => {
                const queueDate = new Date(ticket.queue_date);
                return (
                    (ticket.service_id === service.id ||
                    ticket.parent_service_id === service.id) &&
                    queueDate >= new Date(range.start) &&
                    queueDate <= new Date(range.end)
                );
                }).length;
            });
            countsByService[service.key] = counts;
            });

            setServiceCounts(countsByService);

            // Fetch Limits
            const { data: limits, error: limitError } = await supabase
            .from("queue_schedules")
            .select("date, service_name, limit");

            if (limitError) {
                console.error("Error fetching limits:", error);
            }

            // Process limits locally
            const now = new Date();
            const date = new Date(now);
            const year = date.getFullYear();
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const formattedQueueDate = `${year}-${month}-${day}`;
            const startDate = new Date(formattedQueueDate);
            const daysRange = 7; 

            const newLimits = {};
            mainservice.forEach((service) => {
                newLimits[service.limit] = new Array(daysRange).fill(0);
            
                limits
                    .filter((item) => item.service_name + "Limit" === service.limit)
                    .forEach((item) => {
                        const itemDate = new Date(item.date);
                        const dayIndex = Math.floor(
                            (itemDate - startDate) / (1000 * 60 * 60 * 24)
                        );
                        if (dayIndex >= 0 && dayIndex < daysRange) {
                            newLimits[service.limit][dayIndex] = item.limit;
                        }
                    });
            });
            setServiceLimits(newLimits);
        }
        fetchQueue()
    }, [])

    useEffect(() => {
        const fetchService = async () => {
            let parent_id;

            if (selectedServices[0] === "Licensing") {
              parent_id = 1;
            } else if (selectedServices[0] === "Registration") {
              parent_id = 2;
            } else if (selectedServices[0] === "LETAS") {
              parent_id = 3;
            }
            const { data, error } = await supabase
              .from("services")
              .select("service_name")
              .eq("parent_service_id", parent_id);

            setspecificServices(data.map(service => service.service_name));
        }
        fetchService()
    }, [selectedServices])


    async function insertTicket() {
        const {
            data: { session }
        } = await supabase.auth.getSession();

        const { data: checkUser } = await supabase
            .from("tickets")
            .select("email")
            .eq("email", session.user.email);
        
        if (checkUser.length !== 0) {
            alert("You already queued!")
            return
        }
        let service;
        let parent_service;
        let transaction;
        let queue_time;

        const today = new Date();
        const utcDate = new Date(today.getTime() + today.getTimezoneOffset() * 60000); // Convert to UTC
        const manilaOffset = 16 * 60 * 60 * 1000; // Manila is UTC+8
        const manilaTime = new Date(utcDate.getTime() + manilaOffset);
        
        const dateString = manilaTime.toISOString().split('T')[0]; 

        const { data, error: specificError } = await supabase
          .from("services")
          .select(
            "service_id, parent_service_id, service_name, transaction_time"
          )
          .eq("service_name",selectedSpecificService);

        parent_service = data[0].parent_service_id;
        service = data[0].service_id;
        transaction = data[0].service_name;
        queue_time = data[0].transaction_time;

        const { count, error: countError } = await supabase
          .from("tickets")
          .select("service_id", { count: "exact", head: true })
          .eq("parent_service_id", parent_service)
          .gte("queue_date", `${dateString} 00:00:00`)
          .lte("queue_date", `${dateString} 23:59:59`);

        const { error } = await supabase.from("tickets").insert({
          ticket_number: count + 1,
          service_id: service,
          parent_service_id: parent_service,
          email: session.user.email,
          queue_date: dateString,
          transaction: transaction,
          status: "Pending",
          queue_time: queue_time,
          reference_number: Math.floor(Math.random() * 900000) + 100000,
        })
        setModalVisible(false)
        setViewModalVisible(true)
    }

    const generateCardContent = (day, date, dayIndex) => (
        <View style={{ flex: 1 }}>
            <View style={styles.card}>
                <View style={styles.queue}>
                    <View style={styles.rowAlign}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dayText}>{day}</Text>
                            <Text style={styles.dateText}>{date}</Text>
                        </View>
                        <View style={styles.queueSection}>
                            <TouchableOpacity
                                style={[
                                    styles.queueButton,
                                    { backgroundColor: selectedServices[dayIndex] ? colors.baseBlue : '#D3D3D3' },
                                ]}
                                disabled={!selectedServices[dayIndex]}
                                onPress={() => {
                                    if (selectedServices[dayIndex]) {
                                        setSelectedDayIndex(dayIndex);
                                        setModalVisible(true);
                                    }
                                }}
                            >
                                <Text style={styles.queueButtonText}>Queue Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={handleBackToToday}>
                        <Text style={styles.backText}>Back to Today</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.line}></View>
                <View style={styles.servicesArea}>
                    {mainservice.map((service, index) => {
                        const serviceKey = service.key;
                        const limitKey = service.limit;
                        const queueNumber = serviceCounts[serviceKey]?.[dayIndex] || 0;
                        const queueLimit = serviceLimits[limitKey]?.[dayIndex] || 100; // Default limit to 100 if undefined
                        const queueColor = queueNumber < queueLimit * 0.5 ? 'green' : queueNumber < queueLimit * 0.9 ? 'orange' : 'red';
                        const isSelected = selectedServices[dayIndex] === serviceKey;
    
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.serviceBox,
                                    { backgroundColor: isSelected ? colors.darkBlue : colors.lightBlue }
                                ]}
                                onPress={() => selectServiceForDay(dayIndex, serviceKey)}
                            >
                                <Text style={styles.serviceName}>{serviceKey}</Text>
                                <View style={styles.queueInfo}>
                                    <Text style={[styles.queueNumber, { color: queueColor }]}>{queueNumber}</Text>
                                    <Text style={[styles.queueNumber, { color: queueColor }]}>/{queueLimit}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
            <View style={{ flex: 1 }}></View>
        </View>
    );
    

    const handleSpecificServiceSelect = (specificService) => {
        setSelectedSpecificService(specificService); // Set selected specific service
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Image source={require('../assets/lightLineupLogo.png')} />
                <Image source={require('../assets/menu.png')} />
            </View>
            <View style={styles.body}>
                <Text style={styles.title}>Schedule</Text>

                <View style={{ flex: 1 }}>
                    <Swiper
                        ref={swiperRef}
                        loop={false}
                        showsPagination={true}
                        onIndexChanged={handleSwiperIndexChange}
                    >
                        {Array.from({ length: 7 }).map((_, index) => {
                            const date = new Date();
                            date.setDate(date.getDate() + index);
                            const formattedDate = date.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'numeric',
                                day: 'numeric',
                            });
                            const [day, numDate] = formattedDate.split(', ');

                            return (
                                <View key={index} style={styles.slide}>
                                    {generateCardContent(day, numDate, index)}
                                </View>
                            );
                        })}
                    </Swiper>
                </View>

            </View>

            <Modal
                visible={isModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalText}>Select a Service</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                <Image source={require('../assets/x.png')} style={styles.closeIcon} />
                            </TouchableOpacity>

                        </View>
                        <View style={styles.modalLine}></View>
                        <View style={styles.modalBody}>
                            <View style={styles.serviceList}>
                                {specificServices.map((service, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.serviceItem,
                                            { backgroundColor: selectedSpecificService === service ? colors.darkBlue : colors.white }
                                        ]}
                                        onPress={() => handleSpecificServiceSelect(service)} // Handle specific service select
                                    >
                                        <Text style={[
                                            styles.serviceItemText,
                                            { color: selectedSpecificService === service ? colors.white : colors.baseText }
                                        ]}>
                                            {service}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <View style={styles.modalLine}></View>
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.modalFooterCancel}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalFooterButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalFooterNext}
                                onPress={insertTicket}
                            >
                                <Text style={styles.modalFooterButtonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal>

            <Modal
                visible={isViewModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setViewModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.viewModalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalText}>Queue Ticket Confirmation</Text>
                            <TouchableOpacity onPress={() => setViewModalVisible(false)} style={styles.closeButton}>
                                <Image source={require('../assets/x.png')} style={styles.closeIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalLine}></View>
                        <View style={styles.viewModalBody}>
                            <Text style={styles.viewTicketText}>You have successfully queued your ticket. View your ticket with the button below.</Text>
                        </View>
                        <View style={styles.modalLine}></View>
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.modalFooterCancel}
                                onPress={() => setViewModalVisible(false)}
                            >
                                <Text style={styles.modalFooterButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalFooterNext}
                                onPress={() => navigation.navigate('Ticket')}
                            >
                                <Text style={styles.modalFooterButtonText}>View Ticket</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </Modal>
            <View style={styles.footer} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundGray,
    },
    rowAlign: {
        flexDirection: 'row',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: colors.baseBlue,
    },
    body: {
        flex: 1,

    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        textAlign: 'center',
        marginVertical: 20,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 15,
        flex: 10,
        width: 370,
    },
    queue: {
        padding: 20,
        borderColor: colors.grayBorder,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 20,
    },
    dateContainer: {
        flex: 1,
    },
    dayText: {
        fontSize: 35,
        fontWeight: '800',
        color: colors.graytext,
    },
    dateText: {
        fontSize: 40,
        fontWeight: '800',
        color: colors.graytext,
        marginTop: -10,
    },
    queueSection: {
        flex: 1.3,
        justifyContent: 'center',
    },
    queueButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    queueButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
    backText: {
        fontSize: 15,
        color: colors.graytext,
        margin: 17,
        textDecorationLine: 'underline',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
    },
    line: {
        borderWidth: 1,
        height: 1,
        borderColor: colors.grayButton,
        width: '100%'
    },
    servicesArea: {
        flex: 2,
    },
    serviceBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        marginTop: 22,
        borderRadius: 10,
    },
    serviceName: {
        fontSize: 30,
        fontWeight: '800',
        color: '#343A40',
    },
    queueInfo: {
        flexDirection: 'row',
        marginLeft: 5,
        backgroundColor: '#EBE5FC',
        borderRadius: 10,
        padding: 4,
    },
    queueNumber: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    selectText: {
        fontSize: 14,
        color: colors.graytext,
        textDecorationLine: 'underline',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 10,
        width: 350,
        height: 320,
    },
    viewModalContent: {
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 10,
        width: 350,
        height: 220,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        flex: 1,
    },
    modalText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
    },
    closeButton: {
        padding: 10,
    },
    modalBody: {
        flex: 4,
        justifyContent: 'center'
    },
    viewModalBody: {
        flex: 2,
        justifyContent: 'center'
    },
    serviceItem: {
        backgroundColor: colors.white,
        padding: 10,
        borderWidth: 1,
        borderRadius: 1,
        borderColor: colors.grayBorder,
        marginTop: -1
    },
    serviceItemText: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalFooter: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    modalFooterCancel: {
        backgroundColor: colors.grayButton,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginLeft: 10,
    },
    modalFooterNext: {
        backgroundColor: colors.baseBlue,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginLeft: 10,
    },
    modalFooterButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 600
    },
    modalLine: {
        borderWidth: 1,
        height: 1,
        borderColor: colors.grayBorder,
        width: '100%'
    },
    footer: {
        backgroundColor: colors.baseBlue,
        padding: 30,
    },
});

export default ScheduleScreen;
