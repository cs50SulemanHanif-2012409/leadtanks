import React from "react";
import { Text, Heading, Card, Button, Badge, HStack } from "@chakra-ui/react";
import Sidebar from "../../components/Admin/SideBar";
import { FaUserFriends, } from "react-icons/fa";
import api from "../../components/fectcher";
import { formatNumber } from "../../utils";
import { FcPackage, FcBullish , FcBarChart  } from "react-icons/fc";
import { AdminStats } from "../../utils/type";

import { useAdminStats } from "../../utils/store";

export default function AdminHome() {


    const stats : AdminStats = useAdminStats((state : any)=> state.stats)
    const setStats = useAdminStats((state : any)=> state.setStats)

    React.useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        if(!stats.status){
            console.log('Stats LoadCount ', stats)
            const { data } = await api.get('/admin/stats')
            if (data.status) {
                setStats(data)
            }
        }
    }

    return <Sidebar>
        <HStack padding={2} justify={'center'} flexWrap={{ base: 'wrap' }} >
            <StatCard title='Users' amount={formatNumber(stats.users,0)} colorscheme='purple' icon={<FaUserFriends />} />
            <StatCard title='Packages' amount={formatNumber(stats.packages,0)} colorscheme='green' icon={<FcPackage />} />
            <StatCard title='Orders' amount={formatNumber(0)} colorscheme='orange' icon={<FcBarChart  />} />
        </HStack>
        <HStack padding={2} justify={'center'} flexWrap={{ base: 'wrap' }} >
            <StatCard title='Facebook Leads' amount={formatNumber(stats.leads)} colorscheme='yellow' icon={<FcBullish  />} />
            <StatCard title='Jamal Leads' amount={formatNumber(stats.jamalleads)} colorscheme='red' icon={<FcBullish  />} />
        </HStack>

    </Sidebar>
}


interface StatsProps {
    title: string,
    amount: string,
    colorscheme: string,
    icon: any
}

const StatCard = (props: StatsProps) => {
    return <Card
        direction={'column'}
        overflow='hidden'
        variant='outline'
        backgroundColor={`${props.colorscheme}.50`}
        borderColor={props.colorscheme}
        colorScheme={props.colorscheme}
        padding={4}
        minW={'24%'}
    >
        <HStack justifyContent={'space-between'} width={'100%'} >
            <Text>{props.title}</Text>
            <Button colorScheme={props.colorscheme}>
                {props.icon}
            </Button>
        </HStack>
        <HStack>
            <Heading>{props.amount}</Heading>
        </HStack>
        <HStack mt={2}>
            {/* <Badge colorScheme={props.colorscheme} p={1} >{props.recordsCount} records</Badge> */}
        </HStack>

    </Card>
}
