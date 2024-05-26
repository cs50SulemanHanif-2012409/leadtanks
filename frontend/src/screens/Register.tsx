//@ts-nocheck
import React from 'react'
import { useNavigate } from 'react-router-dom';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,Image
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import api from '../components/fectcher';

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false)
  const [cshowPassword, setCShowPassword] = useState(false)
  const navigate = useNavigate();
  const [firstName, setfirstName] = React.useState('')
  const [lastName, setlastName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [cpassword, setCPassword] = React.useState('')
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const toast = useToast()
  const onSubmit = async () => {

    if (firstName.length === 0 || !isNameValid(firstName)) {
      toast({
        title: 'Name Feild Invalid',
        description: 'FirstName is Required Or FirstName is Invalid',
        status: 'error',
        position: 'top',
        duration: 2000
      })
      return;
    }
    if (email.length === 0 || !isEmailValid(email)) {
      toast({
        title: 'Email Error',
        description: 'Email is Required Or Email is Invalid',
        status: 'error',
        position: 'top',
        duration: 2000
      })
      return;
    }
    if (password.length === 0 || !isPasswordValid(password)) {
      toast({
        title: 'Password Error',
        description: 'Password is Required Or Password Invalid . Password Should Be atleast of length 5 and contain one Character',
        status: 'error',
        position: 'top',
        duration: 2000
      })
      return;
    }
    if (phoneNumber.length === 0 || !isPhoneNumberValid(phoneNumber)) {
      toast({
        title: 'PhoneNumber Error',
        description: 'PhoneNumber is Required Or Invalid Phone Number',
        status: 'error',
        position: 'top',
        duration: 2000
      })
      return;
    }
    if (lastName.length === 0 || !isNameValid(lastName)) {
      toast({
        title: 'LastName Error',
        description: 'LastName is Required Or Invalid LastName',
        status: 'error',
        position: 'top',
        duration: 2000
      })
      return;
    }
    if (password !== cpassword) {
      toast({
        title: 'Password Error',
        description: 'Password And Confirm Password Does not Match',
        status: 'error',
        position: 'top',
        duration: 2000
      })
      return;
    }

    try {

      const { data } = await api.post('/user/register', {
        firstName,
        lastName,
        email,
        password,
        phoneNumber
      })
      const { success, message } = data;
      if (success) {
        navigate("/");
      } else {
        toast({
          title: 'Error',
          description: message,
          position: 'top',
          duration: 4000,
          status: 'error'
        })
        console.log('error', message)
      }

    } catch (error) {
      toast({
        title: 'Error',
        description: error?.message,
        position: 'top',
        duration: 4000,
        status: 'error'
      })
      console.log(error)
      return;
    }
  }

  const isEmailValid = (_leadtanks) => new RegExp(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm).test(_leadtanks)
  const isPhoneNumberValid = (_leadtanks) => new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).test(_leadtanks)
  const isNameValid = (_leadtanks) => new RegExp(/^((?=\S*?[A-Za-z0-9])(?=\S*?[a-z]).{3,})\S$/).test(_leadtanks)
  const isPasswordValid = (_leadtanks) => new RegExp(/^((?=\S*?[A-Za-z0-9])(?=\S*?[a-z])(?=\S*?[0-9]).{5,})\S$/gm).test(_leadtanks)

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <HStack justify={'center'}  align={'center'}>
          <Image src="./logo/logo 9.png" width={200} />
        </HStack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>FirstName</FormLabel>
                  <Input type="text" value={firstName} onChange={(e) => setfirstName(e.target.value)} />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>LastName</FormLabel>
                  <Input type="text" value={lastName} onChange={(e) => setlastName(e.target.value)} />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="phoneNumber" isRequired >
              <FormLabel>Phone Number</FormLabel>
              <Input type="number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input type={cshowPassword ? 'text' : 'password'} value={cpassword} onChange={(e) => setCPassword(e.target.value)} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setCShowPassword((showPassword) => !showPassword)}>
                    {cshowPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
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
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link color={'app.mdark'} href='/signin' >Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}