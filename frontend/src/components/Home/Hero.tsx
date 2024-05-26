'use client'

import { Stack, Flex, Button, Text, VStack, useBreakpointValue , Center , Box } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()
  return (
    <Flex
      w={'full'}
      h={{ base : '80svh' , lg : '100svh'}}
      backgroundImage={
        'url(https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)'
      }
      backgroundSize={'cover'}
      backgroundPosition={'center center'}
      flexWrap={{ base : 'wrap' , lg: 'nowrap'}}
      justifyContent={'center'}
      alignItems={{ lg : 'center'}}
      >
      <VStack
        w={'full'}
        justify={'center'}
        px={useBreakpointValue({ base: 4, md: 8 })}
        >
        <Stack maxW={'2xl'} align={'flex-start'} spacing={6} bg={'rgba(0,0,0,0.5)'} rounded={'xl'} p={4} >
          <Text
            color={'white'}
            fontWeight={700}
            lineHeight={1.2}
            fontSize={useBreakpointValue({ base: '3xl', md: '4xl' })}>
           Find New Clients and Close More Deals  with World’s First AI Powered Lead Finder
          </Text>

          <Stack width={'full'} direction={'row'} justifyContent={'center'} alignItems={'center'} >
            <Button

              bg={'app.mdark'}
              rounded={'full'}
              color={'white'}
              _hover={{ bg: 'gray.300' }}
              
              onClick={()=>{
                navigate('/listing/search')
              }}
              >
              Buy Package
            </Button>
            <Button
              bg={'whiteAlpha.300'}
              rounded={'full'}
              color={'white'}
              _hover={{ bg: 'whiteAlpha.500' }}>
              Demo
            </Button>
          </Stack>
        </Stack>
        

      </VStack>
    </Flex>
  )
}