import { Center, Stack, Td, Text, Tr, Badge } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import api from "../../components/fectcher"
import JTable from "../../components/Table"
import { packageType } from "../../utils/type"
import Navigation from "../../components/navbar"

interface OrderType {
    createdAt: string
    packages: [packageType]
    paymentStatus: string
    status: string
    total: number
    userId: string
    _id: string
}


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
]

export default function Orders() {

    const [orders, setOrders] = useState<OrderType[]>([])

    useEffect(() => {
        loadUserOrders()
    }, [])

    const loadUserOrders = async () => {
        try {
            const { data } = await api.get('/order/list')
            console.log(data)
            setOrders(data.orders)
        } catch (error) {

        }
    }

    return <Stack>
        <Navigation NAV_ITEMS={NAV_ITEMS} icon="../" />
        <Center mt={20} >
            <Text fontSize={'3xl'} fontWeight={'semibold'}  >Your Orders</Text>
        </Center>

        {orders.length > 0 && <JTable
            tableHeads={['Order Id', 'Products', 'Total Price', 'Status', 'Payment Status', 'Date']}
            tableData={orders}
            tableRender={(index: any, row: object) => {
                const record = row as OrderType
                return <Tr>
                    <Td>{record._id}</Td>
                    <Td>{record.packages[0].leadTitle} ...</Td>
                    <Td fontWeight={'bold'} >${record.total}</Td>
                    <Td>
                        <Badge variant='outline' bg={'gray'} color={'white'} >
                            {record.status}
                        </Badge>
                    </Td>
                    <Td>
                    <Badge variant='outline' bg={ record.paymentStatus === 'pending' ? 'gray' : 'green'} color={'white'} >
                            {record.paymentStatus}
                        </Badge>
                    </Td>
                    <Td>{record.createdAt}</Td>
                </Tr>
            }}
        />}
    </Stack>
}