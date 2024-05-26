import { CloseButton, Flex, Link, Select, SelectProps, useColorModeValue } from '@chakra-ui/react'
import { PriceTag } from './PriceTag'
import { CartProductMeta } from './CartProductMeta'
import { packageType } from '../../utils/type'

type CartItemProps = packageType & {
    _qty : number
  onChangeQuantity?: (quantity: number) => void
  onClickGiftWrapping?: () => void
  onClickDelete?: () => void
}

const QuantitySelect = (props: SelectProps) => {
  return (
    <Select
      maxW="64px"
      aria-label="Select quantity"
      focusBorderColor={useColorModeValue('blue.500', 'blue.200')}
      {...props}
    >
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
    </Select>
  )
}

export const CartItem = (props: CartItemProps) => {


  return (
    <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
      <CartProductMeta
        name={props.leadTitle}
        description={props.leadDescription}
        image={''}
        isGiftWrapping={false}
      />

      {/* Desktop */}
      <Flex width="full" justify="space-between" display={{ base: 'none', md: 'flex' }}>
       <Flex mx={10} ></Flex>
        <PriceTag price={props.leadPrice} currency={'USD'} />
        <CloseButton aria-label={`Delete ${props.leadTitle} from cart`} onClick={props.onClickDelete}  />
      </Flex>

      {/* Mobile */}
      <Flex
        mt="4"
        align="center"
        width="full"
        justify="space-between"
        display={{ base: 'flex', md: 'none' }}
      >
        <Link fontSize="sm" textDecor="underline">
          Delete
        </Link>
        <QuantitySelect
          value={props._qty}
          onChange={(e) => {
            // onChangeQuantity?.(+e.currentTarget.value)
          }}
        />
        <PriceTag price={props.leadPrice} currency={'USD'} />
      </Flex>
    </Flex>
  )
}