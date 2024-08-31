'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Stack,
  Button,
  useColorModeValue,
  useToast,
  Text,
  Center
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import api from '../../components/fectcher'
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Navigation from '../../components/navbar';


const NAV_ITEMS = [

  {
    label: 'Home',
    href: '../',
  },
  {
    label: 'Pricing',
    href: '../#pricing',
  },
  {
    label: 'Packages',
    href: '../listing/search',
  },
  {
    label: 'Cart',
    href: '../cart',
  },
]


export default function ProfileCard() {
  const [me, setMe] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
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
      } else {
        console.log(status, message)
        if (message == 'Session Expired') {
          removeCookie('token', '')
          navigate('/')
        }
      }
    } else {
      navigate('/')
    }
  }

  const onChange = (e: any) => {
    setMe({ ...me, [e.target.name]: e.target.value })
  }
  const onSubmit = async () => {

    if (me.firstName.length == 0 || me.firstName.length < 4) {
      showMessage('Invalid Field', 'First Name minimum requirement 4 length', 'warning')
      return;
    }
    if (me.lastName.length == 0 || me.lastName.length < 4) {
      showMessage('Invalid Field', 'Last Name minimum requirement 4 length', 'warning')
      return;
    }
    if (me.phoneNumber.length == 0 || me.phoneNumber.length < 4) {
      showMessage('Invalid Field', 'Phone Number is Too Short', 'warning')
      return;
    }
    const { data } = await api.put('/user/update', { firstName: me.firstName, lastName: me.lastName, phoneNumber: me.phoneNumber });
    if (data.status) {
      showMessage('Updated', 'Profile Info Updated', 'success')
    } else {
      showMessage('Update Failed', data.message, 'success')
    }

  }

  const showMessage = (title = '', description = '', status: "success" | "info" | "warning" | "error" | "loading" | undefined) => {
    toast({
      title,
      description,
      status,
      duration: 4000,
      position: 'top-right'
    })
  }

  return (
    <Flex

      justify={'center'}
      minH={'100vh'}
      flexDir={"column"}
    >
      <Navigation NAV_ITEMS={NAV_ITEMS} icon='../' />
      <Stack spacing={4} mt={20} mx={'auto'} maxW={'lg'} height={'80vh'} justify={'center'}  >
        <Center>

          <Text fontSize={'3xl'}  >Edit Profile</Text>
        </Center>

        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          p={{ base: 4, lg: 8 }}

        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input type="text" value={me?.firstName} name='firstName' onChange={onChange} />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName">
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" value={me?.lastName} name='lastName' onChange={onChange} />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={me.email} name='email' onChange={onChange} readOnly />
            </FormControl>
            <FormControl id="phone" isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input type="number" value={me.phoneNumber} name='phoneNumber' onChange={onChange} />
            </FormControl>
            <HStack spacing={10} pt={2}>
              <Button
                onClick={() => window.history.back()}
              >
                Back
              </Button>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={'app.mdark'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={onSubmit}
              >
                Update
              </Button>
            </HStack>
          </Stack>
        </Box>
      </Stack>
      <Footer />
    </Flex>
  )
}