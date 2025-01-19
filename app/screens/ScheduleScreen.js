import React, { useState, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, Modal, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import colors from '../config/colors';

const ScheduleScreen = ({ navigation }) => {
    const swiperRef = useRef(null);
    const services = ['Licensing', 'Registration', 'LETAS'];
    const queueNumbers = ['40', '70', '95'];
    const specificServices = ["student-Driver's Permit", "New Driver's License (Non-professional)", "Conductor's License"];

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
                    {services.map((service, index) => {
                        const queueNumber = parseInt(queueNumbers[index], 10);
                        const queueColor = queueNumber < 50 ? 'green' : queueNumber < 90 ? 'orange' : 'red';
                        const isSelected = selectedServices[dayIndex] === service;

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.serviceBox,
                                    { backgroundColor: isSelected ? colors.darkBlue : colors.lightBlue }
                                ]}
                                onPress={() => selectServiceForDay(dayIndex, service)}
                            >
                                <Text style={styles.serviceName}>{service}</Text>
                                <View style={styles.queueInfo}>
                                    <Text style={[styles.queueNumber, { color: queueColor }]}>{queueNumbers[index]}</Text>
                                    <Text style={[styles.queueNumber, { color: queueColor }]}>/100</Text>
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
                                onPress={() => [setViewModalVisible(true), setModalVisible(false)]}
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
