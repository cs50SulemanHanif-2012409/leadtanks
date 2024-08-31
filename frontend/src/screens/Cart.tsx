import { Button, Stack, useToast } from "@chakra-ui/react";
import Navigation from "../components/navbar";
import {
    Box,
    Flex,
    Heading,
    HStack,
    useColorModeValue as mode,
} from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react'

import { CartItem } from '../components/cart/CartItem'
import { CartOrderSummary } from '../components/cart/CartOrderSummary'


import { useCart } from "../utils/store";
import { packageType } from "../utils/type";
import CheckoutForm from "./CheckoutFormStripe/Checkout";
import { Link } from "react-router-dom";
import api from "../components/fectcher";

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
];

export default function Cart() {

    //@ts-ignore
    const cart = useCart((state) => state.products)
    //@ts-ignore
    const removeItem = useCart((state) => state.remove)

    const { isOpen, onOpen, onClose } = useDisclosure()


    const toast = useToast()

    const onsubmit = async (data: {
        cardNumber: string,
        expirationDate: string,
        cvc: string
    }) => {

        try {
            const { data } = await api.post('/order/', {
                    packages: cart.map((item: packageType) => item._id),
                    total: cart.reduce((accumulator: any, item: packageType) => {
                        return accumulator + item.leadPrice;
                    }, 0)
            })
            console.log(data)
  
            if (data.status) {
                toast({
                    title: 'Order placed successfully.',
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                    position :'top'
                })
                onClose()
                setTimeout(()=> window.location.href = '/dashboard/orders' , 2000)
            } else {
                console.log('Order failed')
                toast({
                    title: 'Order failed.',
                    description : data.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position :'top'
                })
            }

        } catch (error) {
            toast({
                title: 'Order failed.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position : 'top'
            })
        }
    }

    return <Stack>
        <Navigation NAV_ITEMS={NAV_ITEMS} icon="./" />
        <Box
            width={'90%'}
            mx="auto"
            px={{ base: '4', md: '8', lg: '12' }}
            py={{ base: '6', md: '8', lg: '12' }}
            mt={{ base: '15%', lg: '10%' }}
        >
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                align={{ lg: 'flex-start' }}
                spacing={{ base: '8', md: '16' }}
            >
                <Stack spacing={{ base: '8', md: '10' }} flex="2">
                    <Heading fontSize="2xl" fontWeight="extrabold">
                        Shopping Cart ({cart.length} items)
                    </Heading>

                    <Stack spacing="6">
                        {cart.map((item: packageType) => (
                            <CartItem key={item._id} {...item} _qty={1} onClickDelete={() => removeItem(item)} />
                        ))}
                    </Stack>
                </Stack>

                <Flex direction="column" align="center" flex="1">
                    <CartOrderSummary onClick={onOpen} />
                    <HStack mt="6" fontWeight="semibold">
                        <p>or</p>
                        <Link color={mode('blue.500', 'blue.200')} to="/" >Continue shopping</Link>
                    </HStack>
                </Flex>
            </Stack>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Order Payment</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <CheckoutForm onSubmit={onsubmit} />
                </ModalBody>
            </ModalContent>
        </Modal>
    </Stack>
}