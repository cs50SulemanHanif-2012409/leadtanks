import { Box, Stack, Flex, Avatar, Text, Card, useToast } from "@chakra-ui/react";
import Footer from "../../components/Footer";
import { FiShoppingCart, FiPackage } from "react-icons/fi";
import { MdAccountBox } from "react-icons/md";
import { MdHistory } from "react-icons/md";
import { FaSearchengin } from "react-icons/fa";


import { useState, useEffect } from 'react'
import api from '../../components/fectcher'
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';


export default function UserHome() {

    const [me, setMe] = useState({
        firstName: '',
        lastName: '',
        email: ''
    })
    const [cookies, removeCookie] = useCookies();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        getMe();
    }, [])

    const getMe = async () => {
        if (cookies?.token) {
            const { data } = await api.get('/user/me')
            const { status, user, message } = data;
            if (status) {
                console.log(user)
                setMe(user)
                if(user.isBanned){
                    toast({
                        title : 'Account Banned!!',
                        description : 'Your Account is Disabled. Please contact Support Team',
                        position : 'top-right',
                        duration : 4000,
                        status : 'error'
                    })
                 logOut()
                }
            } else {
                console.log(status, message)
                if (message == 'Session Expired') {
                    logOut()
                }
            }
        } else {
            navigate('/')
        }
    }
    const logOut = () => {
        removeCookie('token', '')
        navigate('/')
    }

    return <Stack>

        <Flex marginTop={20} padding={6} justify={'center'} flexDir={'column'} >

            <Box display={'flex'} flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
                <Avatar size={'2xl'} ></Avatar>
                <Text mt={5} fontSize={'lg'}  >{me.firstName + ' ' + me.lastName}</Text>
                <Text color={'gray.500'} fontSize={'xl'} >{me.email}</Text>
                <Text onClick={logOut} fontWeight={'bold'} textDecor={'underline'} color={'app.mdark'} textUnderlineOffset={'1'} _hover={{
                    cursor: 'pointer',
                    color: 'app.mlight'
                }} >LogOut</Text>
            </Box>

            <Flex justify={'center'} gap={5} my={4} flexWrap={'wrap'} >
                <Card w={'lg'}>
                    <Flex bg={'gray.200'} alignItems={'center'} p={3} roundedTop={6} >
                        <FiShoppingCart color="orange" fontSize={24} />
                        <Text ml={2} >Orders</Text>
                    </Flex>
                    <Flex p={3} >
                        <Text textDecor={'underline'} _hover={{ cursor: 'pointer' }} >Orders</Text>
                    </Flex>
                </Card>
                <Card w={'lg'}>
                    <Flex bg={'gray.200'} alignItems={'center'} p={3} roundedTop={6} >
                        <MdAccountBox color="orange" fontSize={24} />
                        <Text ml={2} >Account</Text>
                    </Flex>
                    <Flex p={3} >
                        <Text textDecor={'underline'} _hover={{ cursor: 'pointer' }} >Edit Profile</Text>
                    </Flex>
                    <Flex p={3} >
                        <Text textDecor={'underline'} _hover={{ cursor: 'pointer' }} >Forgot Password</Text>
                    </Flex>
                </Card>
                <Card w={'lg'}>
                    <Flex bg={'gray.200'} alignItems={'center'} p={3} roundedTop={6} >
                        <FiPackage color="orange" fontSize={24} />
                        <Text ml={2} >Packages</Text>
                    </Flex>
                    <Flex p={3} >
                        <Text textDecor={'underline'} _hover={{ cursor: 'pointer' }} >My Packages</Text>
                    </Flex>
                    <Flex p={3} >
                        <Text textDecor={'underline'} _hover={{ cursor: 'pointer' }} >Buy new Packages</Text>
                    </Flex>
                </Card>
                <Card w={'lg'}>
                    <Flex bg={'gray.200'} alignItems={'center'} p={3} roundedTop={6} >
                        <MdHistory color="orange" fontSize={24} />
                        <Text ml={2} >History</Text>
                    </Flex>
                    <Flex p={3} >
                        <Text textDecor={'underline'} _hover={{ cursor: 'pointer' }} >Order History</Text>
                    </Flex>
                    <Flex p={3} >
                        <Text textDecor={'underline'} _hover={{ cursor: 'pointer' }} >Payment Disputes</Text>
                    </Flex>
                </Card>
                <Card w={'lg'}>
                    <Flex bg={'gray.200'} alignItems={'center'} p={3} roundedTop={6} >
                        <FaSearchengin color="orange" fontSize={24} />
                        <Text ml={2} >Lead Engine</Text>
                    </Flex>
                    <Flex p={3} >
                        <Text textDecor={'underline'} _hover={{ cursor: 'pointer' }} >Lead Engine</Text>
                    </Flex>
                </Card>
            </Flex>

        </Flex>


        <Footer />
    </Stack>
}



{/* <Flex marginTop={20} padding={6} >
<Tabs variant='soft-rounded' colorScheme='green'  display={'flex'} flexWrap={{ base : 'wrap' , lg : 'nowrap' }} >
    <TabList flexDirection={{ base : 'row' , lg : 'column'}} flexWrap={{ base :'wrap' , lg : 'nowrap'}} minWidth={'150px'} >
        <Tab>Home</Tab>
        <Tab>Profile</Tab>
        <Tab>Packages</Tab>
        <Tab>Lead Engine</Tab>
        <Tab>Orders</Tab>
        <Tab>Settings</Tab>
    </TabList>
    <TabPanels>
        <TabPanel>
            <p>Home</p>
        </TabPanel>
        <TabPanel>
            <ProfileCard />
        </TabPanel>
        <TabPanel>
            <p>Packages</p>
        </TabPanel>
        <TabPanel>
            <p>Lead Engine</p>
        </TabPanel>
        <TabPanel>
            <p>Orders</p>
        </TabPanel>
        <TabPanel>
            <p>Settings</p>
        </TabPanel>
    </TabPanels>
</Tabs>
</Flex> */}