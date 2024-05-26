'use client'
import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Image,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react'
import axios from 'axios';
import api from '../components/fectcher';

export default function Signin() {
  
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')


  const onSubmit = async () => {
    const { data } = await api.post('/user/signin', {
      email,
      password
    })
    const { success, message } = data;
    if (success) {

      toast({
        title: 'Logged In',
        description: 'User Logged In Successfully',
        position: 'top',
        duration: 4000,
        status: 'success'
      })
      navigate("/");
    } else {
      toast({
        title: 'Error',
        description: message,
        position: 'top',
        duration: 3000
      })
      console.log('error', message)
    }
  }


  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Image src="../logo/logo 9.png" width={200} />
          <Heading>Signin To your Account</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Remember me</Checkbox>
                <Text color={'app.mdark'}>Forgot password?</Text>
              </Stack>
              <Button
                bg={'app.mdark'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={onSubmit}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}