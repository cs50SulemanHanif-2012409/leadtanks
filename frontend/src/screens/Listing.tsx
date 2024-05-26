import { useEffect, useState } from "react";
import { Stack, Input, Select, useBreakpointValue, IconButton, Center, HStack, Text, Flex, Button, ButtonGroup } from "@chakra-ui/react";
import Navigation from "../components/navbar";
import { AiFillAppstore, AiOutlineBars } from "react-icons/ai";
import Footer from "../components/Footer";
import api from "../components/fectcher";
import { useNavigate } from "react-router-dom";

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
        href: './search',
    },
    {
        label: 'Cart',
        href: '../cart',
    },
];

type TypePackageItem = {
    _id: string,
    leadTitle: string,
    leadDescription: string,
    leadPrice: number,
    noleads: number,
    leadTags: Array<string>,
}

export default function Listing() {


    const [packages, setPackages] = useState([])
    const [_old, setOldPackages] = useState([])

    const [type, setType] = useState(true);

    useEffect(() => {
        fetchPackages()
    }, [])

    const fetchPackages = async () => {
        const { data } = await api.get('/package/all');
        const { status, packages } = data;
        if (status) {
            setPackages(packages)
            setOldPackages(packages)
        }
    }
    const onSearch = (_srch: string) => {
        if (_srch.length > 2) {
            const filteredPackages: any = packages.filter((pkg: TypePackageItem) =>
                pkg?.leadTitle?.toLowerCase()?.includes(_srch.toLowerCase()) ||
                pkg?.leadDescription?.toLowerCase()?.includes(_srch.toLowerCase()) ||
                pkg?.leadTags.includes(_srch)
            );

            // Update the state with the filtered packages
            setPackages(filteredPackages);
        } else {
            setPackages(_old)
        }
    }

    return <Stack>
        <Navigation NAV_ITEMS={NAV_ITEMS} icon="../" />
        <Flex marginTop={20} />
        <Center padding={8} >
            <Input placeholder='Search Packages' width={useBreakpointValue({ base: '100%', lg: '40%' })}
                onChange={(e) => onSearch(e.target.value)}
            />

            <ButtonGroup spacing={2} m={2}>
                <IconButton
                    onClick={() => setType(true)}
                    bg={type ? 'app.mdark' : 'blue.400'}
                    color={'white'}
                    aria-label='Search database'
                    icon={<AiFillAppstore />}
                />
                <IconButton
                    onClick={() => setType(false)}
                    bg={!type ? 'app.mdark' : 'blue.400'}
                    color={'white'}
                    aria-label='Search database'
                    icon={<AiOutlineBars />}
                />
            </ButtonGroup>

            <Select marginLeft={5} maxWidth={130} variant='filled' placeholder='Filter' >
                <option value='option1'>FaceBook Leads</option>
                <option value='option2'>IT leads</option>
                <option value='option3'>Bussiness Leads</option>
                <option value='option4'>All</option>
            </Select>
        </Center>
        <Flex flexWrap={'wrap'} justifyContent={'space-evenly'} >
            {packages.map((pkg, index) => {
                return <LeadPack packageItem={pkg} istype={type} />
            })}
        </Flex>
        <Footer />
    </Stack>
}



interface TypeLeadPack {
    packageItem: TypePackageItem,
    istype: Boolean
}

const LeadPack = ({ packageItem, istype }: TypeLeadPack) => {

    const navigate = useNavigate()

    return <HStack 
        justify={useBreakpointValue({ base: 'center', lg: 'flex-start' })}
        onClick={()=> navigate(`/listing/${packageItem._id}/${textToSlug(packageItem.leadTitle)}`)}
        margin={5} padding={4} shadow={'md'} width={{ base: '100%', lg: istype ? '45%' : '100%' }}
        flexWrap={useBreakpointValue({
            base: 'wrap',
            lg: 'nowrap'
        })}

    >
        <img src="../user_animation.gif" alt="user_animation" />
        <Stack marginLeft={useBreakpointValue({ base: 2, lg: 8 })}>
            <Text fontWeight={'bold'} color={'app.mdark'} fontSize={22} >{packageItem.leadTitle} </Text>
            <ul>
                <li>{convertNumberToShortScale(packageItem.noleads)} Leads</li>
                {packageItem.leadTags.map(i => <li>{i}</li>)}
            </ul>
            <Text width={'100%'} textAlign={'end'} display={'flex'}
                fontWeight={'bold'} color={'app.mdark'} fontSize={24} >
                {packageItem.leadPrice}
                <Text style={{
                    translate: '0px 5px'
                }}
                    color={'black'} fontWeight={'bold'}  >$</Text>
            </Text>
        </Stack>
    </HStack>
}

function textToSlug(text: string) {
    return text
        .toLowerCase() // Convert to lowercase
        .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace consecutive hyphens with a single hyphen
        .trim(); // Trim leading and trailing spaces

}
function convertNumberToShortScale(number: any) {
    if (number >= 1e12) {
        return (number / 1e12).toFixed(2) + 'T';
    } else if (number >= 1e9) {
        return (number / 1e9).toFixed(2) + 'B';
    } else if (number >= 1e6) {
        return (number / 1e6).toFixed(2) + 'M';
    } else if (number >= 1e3) {
        return (number / 1e3).toFixed(2) + 'K';
    }
    return number.toString();
}
