'use client'

import {
    Heading,
    Avatar,
    Box,
    Center,
    Image,
    Flex,
    Text,
    Stack,
    Button,
    useColorModeValue,
} from '@chakra-ui/react'
import { packageType } from '../../utils/type'
import { Link } from 'react-router-dom'


interface MyPackageProps {
    item: packageType
}

const getLink = (record: packageType) => `/dashboard/packages/${record._id}`
export default function MyPackage({ item }: MyPackageProps) {
    return (
        <Center py={6}>
            <Box
                maxW={'270px'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={'2xl'}
                rounded={'md'}
                overflow={'hidden'}
                minH={'300px'}
            >
                <Image
                    h={'120px'}
                    w={'full'}
                    src={
                        'https://cdn.pixabay.com/photo/2021/12/27/08/37/package-6896557_640.jpg'
                    }
                    objectFit="cover"
                    alt="#"
                />

                <Box p={6}>
                    <Stack spacing={0} align={'center'} mb={0}>
                        <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                            {item.leadTitle}
                        </Heading>
                        <Text color={'gray.500'}>{item.leadDescription}</Text>
                    </Stack>

                    <Link to={getLink(item)} >
                        <Button
                            w={'full'}
                            mt={8}
                            bg={useColorModeValue('#151f21', 'gray.900')}
                            color={'white'}
                            rounded={'md'}
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg',
                            }}

                        >
                            View
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Center>
    )
}