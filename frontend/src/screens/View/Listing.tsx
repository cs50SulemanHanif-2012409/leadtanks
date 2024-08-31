import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import Footer from '../../components/Footer';

import {
    Box,
    chakra,
    Container,
    Stack,
    Text,
    Image,
    Flex,
    VStack,
    Button,
    Heading,
    SimpleGrid,
    StackDivider,
    useColorModeValue,
    VisuallyHidden,
    List,
    ListItem,
    useToast,
    Center,
} from '@chakra-ui/react'
import { MdLocalShipping } from 'react-icons/md'
import api from '../../components/fectcher';
import { useCart } from '../../utils/store';

type packageType = {
    _id : string,
    leadTitle : string,
    leadDescription : string,
    leadPrice : number,
    leadTags : [string],
    noleads : number,
    createdAt : string,
    updatedAt : string
}

export default function ViewListing() {
    const {  id } = useParams();
    //@ts-ignore
    const addToCart = useCart((state)=> state.addProduct)

    const toast = useToast()

    const [pkg , setPackage] = React.useState<packageType>();

    React.useEffect(()=>{
        fetchPackageInfo()
    },[])

    const fetchPackageInfo = async () =>{
          const { data } = await api.get('/package/info/'+id);
          if(data.status){
            setPackage(data.pkg)
          }
    }

    return <Box  >
        <Container maxW={'7xl'}>
            <SimpleGrid
                columns={{ base: 1, lg: 2 }}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 18, md: 24 }}>
                <Flex>
                    <Image
                        rounded={'md'}
                        alt={'product image'}
                        src={
                            '../../../service-img.png'
                        }
                        fit={'cover'}
                        align={'center'}
                        w={'100%'}
                        h={{ base: '100%', sm: '400px', lg: '500px' }}
                    />
                </Flex>
                <Stack spacing={{ base: 6, md: 10 }}>
                    <Box as={'header'}>
                        <Heading
                            lineHeight={1.1}
                            fontWeight={600}
                            fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                            {pkg?.leadTitle}
                        </Heading>
                        <Text
                            color={useColorModeValue('gray.900', 'gray.400')}
                            fontWeight={300}
                            fontSize={'2xl'}>
                            ${pkg?.leadPrice} USD
                        </Text>
                    </Box>

                    <Stack
                        spacing={{ base: 4, sm: 6 }}
                        direction={'column'}
                        divider={
                            <StackDivider borderColor={useColorModeValue('gray.200', 'gray.600')} />
                        }>
                        <VStack spacing={{ base: 4, sm: 6 }}>
                            <Text
                                color={useColorModeValue('gray.500', 'gray.400')}
                                fontSize={'2xl'}
                                fontWeight={'300'}>
                                {pkg?.leadDescription}
                            </Text>
                        </VStack>
                        <Box>
                            <Text
                                fontSize={{ base: '16px', lg: '18px' }}
                                color={useColorModeValue('yellow.500', 'yellow.300')}
                                fontWeight={'500'}
                                textTransform={'uppercase'}
                                mb={'4'}>
                                Features
                            </Text>

                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                                <List spacing={2}>
                                    {pkg?.leadTags.map( txt =>  <ListItem>{txt}</ListItem>)}
                                </List>
                            </SimpleGrid>
                        </Box>
                 
                    </Stack>

                    <Button
                        rounded={'none'}
                        w={'full'}
                        mt={8}
                        size={'lg'}
                        py={'7'}
                        bg={useColorModeValue('gray.900', 'gray.50')}
                        color={useColorModeValue('white', 'gray.900')}
                        textTransform={'uppercase'}
                        _hover={{
                            transform: 'translateY(2px)',
                            boxShadow: 'lg',
                        }}
                        onClick={()=>{
                            addToCart(pkg)
                            toast({
                                title : 'Added To Cart',
                                position : 'top-right',
                                status : 'info',
                                duration : 2500,
                                isClosable : true
                            })
                        }}
                        >
                        Add to cart
                    </Button>
                    <Center>
                        <Link to={'/cart'} style={{ textDecoration : 'underline' }} >View Cart</Link> <Text mx={8} >OR</Text> <Link to={'/'} style={{ textDecoration : 'underline' }}  >Back To home</Link>
                    </Center>

                    <Stack direction="row" alignItems="center" justifyContent={'center'}>
                        <MdLocalShipping />
                        <Text>delivery  direct in Mail & Dashboard</Text>
                    </Stack>
                </Stack>
            </SimpleGrid>
        </Container>

        <Footer />
    </Box>
}