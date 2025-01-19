import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Image, SafeAreaView, Text, TouchableOpacity, ScrollView, StatusBar, FlatList, Dimensions } from 'react-native';
import colors from '../config/colors';


function HomeScreen({ navigation }) {
    const scrollX = useRef(new Animated.Value(0)).current;

    const phoneImages = [
        { id: 1, source: require('../assets/phone1.png') },
        { id: 2, source: require('../assets/phone2.png') },
        { id: 3, source: require('../assets/phone3.png') },
        { id: 4, source: require('../assets/phone4.png') },
        { id: 5, source: require('../assets/phone5.png') },
        { id: 6, source: require('../assets/phone6.png') },
        { id: 7, source: require('../assets/phone7.png') },
        { id: 8, source: require('../assets/phone8.png') },
        { id: 9, source: require('../assets/phone9.png') },
    ];

    const { width } = Dimensions.get('window');
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        Animated.loop(
            Animated.timing(scrollX, {
                toValue: 1,
                duration: 25000,
                useNativeDriver: true,
            })
        ).start();
    }, [scrollX]);

    const imageWidth = 170;
    const totalWidth = imageWidth * 5;

    const [queueCount] = useState(0);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />
            <ScrollView contentContainerStyle={styles.scrollContainer} stickyHeaderIndices={[0]}>

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
                        Queue at the comfort of your home.
                    </Text>
                    <Animated.View
                        style={[
                            styles.logosWrapper,
                            {
                                transform: [
                                    {
                                        translateX: scrollX.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -totalWidth],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <View style={styles.logosSlide}>
                            <Image source={require('../assets/prcLogo.png')} style={styles.logo} />
                            <Image source={require('../assets/dfaLogo.png')} style={styles.logo} />
                            <Image source={require('../assets/ltoLogo.png')} style={styles.logo} />
                            <Image source={require('../assets/birLogo.png')} style={styles.logo} />
                            <Image source={require('../assets/psaLogo.png')} style={styles.logo} />
                        </View>

                        <View style={styles.logosSlide}>
                            <Image source={require('../assets/prcLogo.png')} style={styles.logo} />
                            <Image source={require('../assets/dfaLogo.png')} style={styles.logo} />
                            <Image source={require('../assets/ltoLogo.png')} style={styles.logo} />
                            <Image source={require('../assets/birLogo.png')} style={styles.logo} />
                            <Image source={require('../assets/psaLogo.png')} style={styles.logo} />
                        </View>
                    </Animated.View>
                    <View style={styles.rowAlign}>
                        <Text style={styles.h2textDynamic}>
                            {queueCount}
                        </Text>
                        <Text style={styles.h2text}>
                            in queue today
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.queueButton}
                        onPress={() => navigation.navigate('Schedule')}>
                        <Text style={styles.whiteText}>Queue Now</Text>
                    </TouchableOpacity>
                    <View style={styles.section}>
                        <View style={styles.rowAlign}>
                            <Text style={styles.headText}>
                                What is
                            </Text>
                            <Image source={require('../assets/homeLogo.png')} style={styles.homeLogo}></Image>
                            <Text style={styles.headText}>
                                ?
                            </Text>
                        </View>
                        <View style={styles.card}>
                            <View style={styles.cardContent}>
                                <Image
                                    source={require('../assets/cardImage1.png')}
                                    style={styles.cardImage}
                                    resizeMode="cover"
                                />
                            </View>
                            <View style={styles.cardContent}>
                                <View style={styles.cardDescription}>
                                    <Text style={styles.cardHeader}>
                                        Two-Way Queueing System
                                    </Text>
                                    <Text style={styles.cardText}>
                                        This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <View style={styles.cardContent}>
                                <Image
                                    source={require('../assets/cardImage2.png')}
                                    style={styles.cardImage}
                                    resizeMode="cover"
                                />
                            </View>
                            <View style={styles.cardContent}>
                                <View style={styles.cardDescription}>
                                    <Text style={styles.cardHeader}>
                                        ESP32-Based Device
                                    </Text>
                                    <Text style={styles.cardText}>
                                        An efficient ESP32-powered device delivering real-time updates and reliable performance.
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <View style={styles.cardContent}>
                                <Image
                                    source={require('../assets/cardImage3.png')}
                                    style={styles.cardImage}
                                    resizeMode="cover"
                                />
                            </View>
                            <View style={styles.cardContent}>
                                <View style={styles.cardDescription}>
                                    <Text style={styles.cardHeader}>
                                        Cross-Platform Web application
                                    </Text>
                                    <Text style={styles.cardText}>
                                        Access the queueing system effortlessly on desktops, tablets, and mobile devices.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.rowAlign}>
                            <Text style={styles.headText}>Queueing with</Text>
                            <Image source={require('../assets/homeLogo.png')} style={styles.homeLogo} />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20, }}>
                            <FlatList
                                data={phoneImages}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                pagingEnabled
                                snapToAlignment="center"
                                snapToInterval={Dimensions.get('window').width}
                                decelerationRate="fast"
                                keyExtractor={(item) => item.id.toString()}
                                contentContainerStyle={{
                                    alignItems: 'center',
                                }}
                                renderItem={({ item }) => (
                                    <View style={styles.carouselItem}>
                                        <Image source={item.source} style={styles.phoneImage} />
                                    </View>
                                )}
                                onScroll={(event) => {
                                    const contentOffsetX = event.nativeEvent.contentOffset.x;
                                    const index = Math.round(contentOffsetX / Dimensions.get('window').width);
                                    setCurrentPage(index);
                                }}
                                scrollEventThrottle={16}
                            />
                        </View>
                        <View style={styles.pagination}>
                            {phoneImages.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.paginationDot,
                                        index === currentPage ? styles.paginationDotActive : null,
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.rowAlign}>
                            <Text style={styles.headText}>Minds behind</Text>
                            <Image source={require('../assets/homeLogo.png')} style={styles.homeLogo} />
                        </View>
                        <View style={styles.profile}>
                            <Image source={require('../assets/nicky.png')} />
                            <Text style={styles.name}>Nicky Ronald Y. Cadalig Jr.</Text>
                            <Text style={styles.role}>Frontend Developer</Text>
                            <View style={styles.socials}>
                                <Image source={require('../assets/in.png')} style={{ marginRight: 10, }} />
                                <Image source={require('../assets/github.png')} />
                            </View>
                        </View>
                        <View style={styles.profile}>
                            <Image source={require('../assets/gem.png')} />
                            <Text style={styles.name}>Gabriel Mark A. Capalad</Text>
                            <Text style={styles.role}>UI/UX Designer</Text>
                            <View style={styles.socials}>
                                <Image source={require('../assets/in.png')} style={{ marginRight: 10, }} />
                                <Image source={require('../assets/github.png')} />
                            </View>
                        </View>
                        <View style={styles.profile}>
                            <Image source={require('../assets/alvir.png')} />
                            <Text style={styles.name}>Peter Alvir M. Gonzales</Text>
                            <Text style={styles.role}>Backend Developer</Text>
                            <View style={styles.socials}>
                                <Image source={require('../assets/in.png')} style={{ marginRight: 10, }} />
                                <Image source={require('../assets/github.png')} />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.footer} />
            </ScrollView>
        </SafeAreaView>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
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
    headText: {
        fontSize: 36,
        fontWeight: '800',
        textAlign: 'center',
    },
    menuContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    body: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginTop: 100,
    },
    logosWrapper: {
        flexDirection: 'row',
        marginTop: 20,
    },
    logosSlide: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginHorizontal: 10,
    },
    rowAlign: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 15,
    },
    h2text: {
        fontSize: 20,
        fontWeight: 600,
        paddingLeft: 5,
    },
    h2textDynamic: {
        fontSize: 20,
        fontWeight: 600,
        paddingLeft: 5,
        color: colors.baseBlue,
    },
    queueButton: {
        backgroundColor: colors.baseBlue,
        width: '100%',
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    whiteText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    homeLogo: {
        marginLeft: 10,
        marginTop: 1,
        marginRight: 10,
    },
    card: {
        marginTop: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.grayBorder,
        width: '100%',
        height: 400,
    },
    cardContent: {
        flex: 1,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    cardHeader: {
        fontSize: 20,
    },
    cardText: {
        fontSize: 15,
        color: colors.graytext,
        marginTop: 10,
        letterSpacing: 1,
        lineHeight: 23,
    },
    cardDescription: {
        padding: 20,
    },
    profile: {
        alignItems: 'center',
        margin: 10,
    },
    name: {
        fontSize: 26,
        fontWeight: 800,
    },
    role: {
        fontSize: 22,
        fontWeight: 600,
    },
    socials: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
    },
    carouselItem: {
        width: Dimensions.get('window').width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    phoneImage: {
        width: Dimensions.get('window').width * 0.7,
        height: Dimensions.get('window').width * 1.4,
        resizeMode: 'contain',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#d3d3d3',
        marginHorizontal: 5,
    },
    paginationDotActive: {
        backgroundColor: colors.baseBlue,
    },
    footer: {
        backgroundColor: colors.baseBlue,
        padding: 30,
        flex: 1
    },
});
