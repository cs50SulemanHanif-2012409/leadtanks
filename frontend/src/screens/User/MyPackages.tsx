import { Center, Stack,  Text,  useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import api from "../../components/fectcher"
import { packageType } from "../../utils/type"
import MyPackage from "../../components/Package"

interface OrderType {
    createdAt: string
    packages: [packageType]
    paymentStatus: string
    status: string
    total: number
    userId: string
    _id: string
}



export default function MyPackages() {

 

    const [packages , setPackages] = useState<packageType[]>([])

    const toast = useToast()

    useEffect(() => {
        loadUserOrders()
    }, [])

    const loadUserOrders = async () => {
        try {
            const { data } = await api.get('/order/list')
            console.log(data)
            let pkgs = data.orders.map((order: OrderType) => {
                return order.packages as packageType[]
            })

            pkgs = pkgs.flat()

            console.log(pkgs)
            setPackages(pkgs)

        } catch (error) {
            toast({
                title : 'Error',
                description : 'Something went wrong',
                duration : 3000,
                position : 'top'
            })
        }
    }

    return <Stack>
        <Center my={4} >
            <Text fontSize={'2xl'} fontWeight={'bold'} >Your Packages</Text>
        </Center>
        <Stack flexDir={'row'} justifyContent={'center'} >
            {packages.map((item : packageType)=> <MyPackage item={item} />)}
        </Stack>
    </Stack>
}