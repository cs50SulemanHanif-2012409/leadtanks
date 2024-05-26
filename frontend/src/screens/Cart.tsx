import { Stack } from "@chakra-ui/react";
import Navigation from "../components/navbar";
import {
    Box,
    Flex,
    Heading,
    HStack,
    Link,
    useColorModeValue as mode,
} from '@chakra-ui/react'


import { CartItem } from '../components/cart/CartItem'
import { CartOrderSummary } from '../components/cart/CartOrderSummary'
import { cartData } from '../components/cart/_data'

import { useCart } from "../utils/store";
import { packageType } from "../utils/type";

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
    const cart = useCart((state)=> state.products)
    //@ts-ignore
    const removeItem = useCart((state)=> state.remove)

    return <Stack>
        <Navigation NAV_ITEMS={NAV_ITEMS} icon="./" />
        <Box
           width={'90%'}
            mx="auto"
            px={{ base: '4', md: '8', lg: '12' }}
            py={{ base: '6', md: '8', lg: '12' }}
            mt={{ base : '15%' , lg : '10%'}}
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
                        {cart.map((item : packageType) => (
                            <CartItem key={item._id} {...item} _qty={1} onClickDelete={()=> removeItem(item)} />
                        ))}
                    </Stack>
                </Stack>

                <Flex direction="column" align="center" flex="1">
                    <CartOrderSummary />
                    <HStack mt="6" fontWeight="semibold">
                        <p>or</p>
                        <Link color={mode('blue.500', 'blue.200')}>Continue shopping</Link>
                    </HStack>
                </Flex>
            </Stack>
        </Box>
    </Stack>
}