'use client'

import {
    Flex,
    Circle,
    Box,
    Image,
    Badge,
    useColorModeValue,
    Icon,
    chakra,
    Text,
    Tooltip,
} from '@chakra-ui/react'
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs'
import { FiShoppingCart } from 'react-icons/fi'

const data = {
    isNew: true,
    imageURL:
        '../user_animation.gif',
    name: 'C++ developer',
    price: 12.99,
    rating: 4.2,
    numReviews: 34,
}

interface RatingProps {
    rating: number
    numReviews: number
}

function Rating({ rating, numReviews }: RatingProps) {
    return (
        <Box display="flex" alignItems="center">
            {Array(5)
                .fill('')
                .map((_, i) => {
                    const roundedRating = Math.round(rating * 2) / 2
                    if (roundedRating - i >= 1) {
                        return (
                            <BsStarFill
                                key={i}
                                style={{ marginLeft: '1' }}
                                color={i < rating ? 'teal.500' : 'gray.300'}
                            />
                        )
                    }
                    if (roundedRating - i === 0.5) {
                        return <BsStarHalf key={i} style={{ marginLeft: '1' }} />
                    }
                    return <BsStar key={i} style={{ marginLeft: '1' }} />
                })}
            <Box as="span" ml="2" color="gray.600" fontSize="sm">
                {numReviews} review{numReviews > 1 && 's'}
            </Box>
        </Box>
    )
}

function ListingCard({ packageItem } : any  ) {
    return (
        <Flex m={2} alignItems="center" justifyContent="center" cursor={'pointer'}  >
            <Box
                bg={useColorModeValue('white', 'gray.800')}
                maxW="sm"
                borderWidth="1px"
                rounded="lg"
                shadow="lg"
                position="relative">
                {data.isNew && (
                    <Box display={'flex'} position="absolute" top={2} right={2}>
                        <Circle size="10px" bg="red.200" />
                        <Text fontWeight={'bold'} >New!</Text>
                    </Box>

                )}

                <Image src={data.imageURL} width={'100%'} alt={`Picture of ${data.name}`} roundedTop="lg" />

                <Box p="6">
                    <Box display="flex" alignItems="baseline">
                        {data.isNew && (
                            <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                                New
                            </Badge>
                        )}
                    </Box>
                    <Flex mt="1" justifyContent="space-between" alignContent="center">
                        <Box
                            fontSize="2xl"
                            fontWeight="semibold"
                            as="h4"
                            lineHeight="tight"
                            isTruncated>
                            {packageItem?.leadTitle}
                        </Box>
                        <Tooltip
                            label="Add to cart"
                            bg="white"
                            placement={'top'}
                            color={'gray.800'}
                            fontSize={'1.2em'}>
                            <chakra.a href={'#'} display={'flex'}>
                                <Icon as={FiShoppingCart} h={7} w={7} alignSelf={'center'} />
                            </chakra.a>
                        </Tooltip>
                    </Flex>

                    <Flex justifyContent="space-between" alignContent="center">
                        <Rating rating={data.rating} numReviews={data.numReviews} />
                        <Box fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>
                            <Box as="span" color={'gray.600'} fontSize="lg">
                                $
                            </Box>
                            {packageItem.leadPrice}
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    )
}

export default ListingCard;