import {
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react'
import { FaArrowRight } from 'react-icons/fa'
import { formatPrice } from './PriceTag'
import { useCart } from '../../utils/store'
import { useEffect, useState } from 'react'
import { packageType } from '../../utils/type'

type OrderSummaryItemProps = {
  label: string
  value?: string
  children?: React.ReactNode
}

const OrderSummaryItem = (props: OrderSummaryItemProps) => {
  const { label, value, children } = props
  return (
    <Flex justify="space-between" fontSize="sm">
      <Text fontWeight="medium" color={mode('gray.600', 'gray.400')}>
        {label}
      </Text>
      {value ? <Text fontWeight="medium">{value}</Text> : children}
    </Flex>
  )
}

interface CartOrderSummaryProps {
  onClick: () => void
}

export const CartOrderSummary = ({ onClick }: CartOrderSummaryProps) => {

  //@ts-ignore
  const cart = useCart((state) => state.products)

  const [total, setTotal] = useState(0)

  useEffect(() => {
    const totalPrice = cart.reduce((accumulator: any, item: packageType) => {
      return accumulator + item.leadPrice;
    }, 0);
    console.log(totalPrice)
    setTotal(totalPrice)
  }, [cart])

  return (
    <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
      <Heading size="md">Order Summary</Heading>

      <Stack spacing="6">
        <OrderSummaryItem label="Subtotal" value={formatPrice(total)} />
        <OrderSummaryItem label="Coupon Code">
          <Link href="#" textDecor="underline">
            Add coupon code
          </Link>
        </OrderSummaryItem>
        <Flex justify="space-between">
          <Text fontSize="lg" fontWeight="semibold">
            Total
          </Text>
          <Text fontSize="xl" fontWeight="extrabold">
            {formatPrice(total)}
          </Text>
        </Flex>
      </Stack>
      <Button colorScheme="blue" size="lg" fontSize="md" rightIcon={<FaArrowRight />}
        onClick={onClick}
      >
        Checkout
      </Button>
    </Stack>
  )
}