import { Box, Text, Stack, Image, HStack, Center, useColorModeValue, Button, useBreakpointValue, UnorderedList, ListItem } from "@chakra-ui/react";
import Navigation from "../components/navbar";
import ProfileLead from "../components/Home/ProfileLead";
import OurClients from "../components/Home/OurClients";
import AboutCompany from "../components/Home/AboutCompany";
import PricingPlan from "../components/Home/PricingPlan";
import Footer from "../components/Footer";
import Hero from "../components/Home/Hero";
import ReactPlayer from 'react-player'
import { useEffect } from "react";

const NAV_ITEMS = [

    {
        label: 'Home',
        href: './',
    },
    {
        label: 'Pricing',
        href: '#pricing',
    },
    {
        label: 'Packages',
        href: './listing/search',
    },
    {
        label: 'Cart',
        href: './cart',
    },
]
export default () => {


    useEffect(() => {

        //@ts-ignore
        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        (function () {
            var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/669cf32732dca6db2cb306f7/1i3ahblbp';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            //@ts-ignore
            s0.parentNode.insertBefore(s1, s0);
        })();

    }, [])

    return <Box >
        <Navigation NAV_ITEMS={NAV_ITEMS} icon="./" />



        <Hero />


        <Center p={2} >
            <Box borderRadius={8}  >
                <ReactPlayer light={<img src='./thumbnail_video.png' alt={'LeadTanks Thumbnail'} />} url="./leadtanks_promo.mp4" width={useBreakpointValue({ base: 300, md: 400, lg: 640 })} height={useBreakpointValue({ base: 220, md: 200, lg: 360 })} autoPlay={true} controls={true} />
            </Box>
        </Center>



        <Stack bg={'#f6f5fc'} padding={{ base: 2, lg: 8 }} borderRadius={8} margin={8} >
            <HStack flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
                <Center width={{ base: '100%', lg: '50%' }} padding={8}>
                    <Text fontSize={{ base: 16, lg: 22 }} >{`We never wish ill will on anyone and their business. Furthermore, we never want or advise anyone to take advantage of anyone else when they're down.

However, the current climate has birthed an amazing opportunity if you're a marketing agency, local marketer, or entrepreneur.

See, most local businesses are too tied up in the day to day. They know they need to take advantage of all the new tools and digital opportunities for their business. But because of burnout and busyness…it just gets neglected.

And as a result, they continue to suffer and struggle. But that's where you can help them. You can provide the services they need, help them thrive, while building a successful business for yourself at the same time!`}</Text>
                </Center>
                <Center width={{ base: '100%', lg: '50%' }} >
                    <Image src="./service-img.png" alt="service image" borderRadius={8} />
                </Center>
            </HStack>
            <Text textAlign={'center'} fontSize={28} color={'app.mdark'} fontWeight={'bolder'} marginY={8} >HERE'S JUST A SNIPPET OF THE TYPES OF SERVICES THESE BUSINESSES ARE LOOKING FOR:</Text>
            <HStack>
                <Stack width={{ base: '100%', lg: '50%' }} >
                    <UnorderedList>

                        <ListItem>Google Business Profile Optimization</ListItem>
                        <ListItem>Search Engine Optimization</ListItem>
                        <ListItem>Graphic Design & Brand Creation</ListItem>
                        <ListItem>Website Creation</ListItem>
                    </UnorderedList>
                </Stack>
                <Stack width={{ base: '100%', lg: '50%' }}>
                    <UnorderedList>
                        <ListItem>Facebook and Google Ads Creation and Management</ListItem>
                        <ListItem>Video Marketing</ListItem>
                        <ListItem>Video Creation</ListItem>
                        <ListItem>Local Marketing, Social Media, Reputation Management</ListItem>
                    </UnorderedList>
                </Stack>
            </HStack>
        </Stack>

        <HStack borderRadius={8} margin={{ base: 2, lg: 8 }} bg={'gray.100'} padding={2} flexWrap={{ base: 'wrap', lg: 'nowrap' }} >
            <Center>
                <img src="./bannerbg.png" alt="img" />
            </Center>
            <Center flexDirection={'column'} padding={8}>
                <Text fontWeight={'bold'} fontSize={24} color={'app.mdark'} >LeadTanks</Text>
                <Text fontWeight={'bold'} fontSize={30} textAlign={'center'} color={'app.mdark'} >45% DISCOUNT - Full Edition</Text>
                <Text fontWeight={'bolder'} fontSize={48} textAlign={'center'} color={'yellow.500'} >ONLY $50</Text>
                <Text fontSize={22} textAlign={'center'} color={'gray.600'} >2,000+ Members can't be wrong.</Text>
                <Button bg={'app.mdark'} color={'white'} margin={8} >GET INSTANT ACCESS</Button>
            </Center>
        </HStack>
        <HStack py={10} flexWrap={useBreakpointValue({ base: 'wrap', lg: 'nowrap' })} >
            <Stack width={useBreakpointValue({ base: '100%', lg: '50%' })} display={'flex'} alignItems={'center'} >
                <Text color={useColorModeValue('app.mdark', 'gray.400')} fontSize={'3xl'} fontFamily={'cursive'} fontWeight={'bold'} >Here's The #1 Problem.</Text>
                <Text width={useBreakpointValue({ base: '80%', md: '70%', lg: '60%' })} >Those Struggling Businesses Are Looking For Your Help, But They Don't Know You Exist!</Text>
                <Button marginTop={4} minW={200} bgColor={'app.mdark'} color={'white'} >Explore</Button>
            </Stack>
            <Center width={useBreakpointValue({ base: '100%', lg: '50%' })}>
                <img src="./your-help.png" alt="data image" width={300} height={300} />
            </Center>
        </HStack>
        <HStack py={10} flexWrap={useBreakpointValue({ base: 'wrap', lg: 'nowrap' })} >
            <Center width={useBreakpointValue({ base: '100%', lg: '50%' })}>
                <img src="./search.png" alt="data image" width={300} height={300} />
            </Center>
            <Stack width={useBreakpointValue({ base: '100%', lg: '50%' })} display={'flex'} alignItems={'center'} >
                <Text width={useBreakpointValue({ base: '80%', md: '90%', lg: '100%' })} color={useColorModeValue('app.mdark', 'gray.400')} fontSize={useBreakpointValue({ base: '2xl', lg: '3xl' })} fontFamily={'cursive'} fontWeight={'bold'} paddingBottom={5} >Find excellent B2B leads with valid contact info & many more data points.</Text>
                <Text width={useBreakpointValue({ base: '80%', md: '70%', lg: '80%' })} >Find, preview, and share valid details of US-based B2B leads in seconds with our super user-friendly features & app interface.</Text>
            </Stack>
        </HStack>

        <Box marginTop={10} ></Box>
        <OurClients />
        <AboutCompany />
        <Box marginY={10} ></Box>
        <PricingPlan />
        <Footer />



    </Box>
}