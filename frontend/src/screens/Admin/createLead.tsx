//@ts-nocheck
import React from 'react';
import {
    Button,
    Center,
    Stack,
    HStack,
    Textarea,
    Heading,
    Box,
    Text,
    useToast
} from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import { Table, Tbody, Tr, Td, Thead } from '@chakra-ui/react';
import {
    Input,
    InputGroup,
    InputLeftElement,
    InputRightAddon,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import Sidebar from "../../components/Admin/SideBar";
import api from '../../components/fectcher';

export default function AdminCreateLead() {
    const [showNext, setshowNext] = React.useState(false);

    const [countries, setCountries] = React.useState([]);
    const [selectedCountry, setSelectedCountry] = React.useState('all')


    const [leadTitle, setLeadTitle] = React.useState('')
    const [leadDescription, setLeadDescription] = React.useState('')
    const [leadPrice, setLeadPrice] = React.useState()
    const [leadTags, setLeadTags] = React.useState('')
    const [noleads, setNoLead] = React.useState()

    const [db , setDb] = React.useState('')

    const [isLoading , setLoading] = React.useState(false);


    const toast = useToast();

    React.useEffect(()=>{
        console.log(db)
    },[db])


    React.useEffect(() => {
        if(db === 'fb'){
            if(countries.length == 0){
                fetchCountries()
            }
        }
    }, [db])


    const fetchCountries = async () => {
        const { data } = await api.get('/admin/fb/countries');
        const { countries } = data;
        setCountries(countries.countries)
    }

    const onSubmit = async () => {
              setLoading(true)

        if (leadTitle.length < 5) {
            showMessage('Lead Title too Small', 'Lead Title Needs To Bigger', 'error')
            setLoading(false)
            return;
        }
        if (leadDescription.length < 20) {
            showMessage('Lead Description too Small', 'Lead Description Needs To Bigger', 'error')
            setLoading(false)
            return;
        }
        if (leadPrice === 0 || noleads === 0) {
            showMessage('Lead Price or Qty Invalid', 'Lead Price or Qty Cant be Zero', 'error')
            setLoading(false)
            return;
        }
        
        try {
            
            const { data } = await api.post('/admin/create/package', {
                leadTitle,
                leadDescription,
                leadPrice,
                leadTags,
                noleads,
                selectedCountry,
                db
            })
            
            const { status, message } = data;
            setLoading(false)
            if (status) {
                showMessage('Created!!', 'New Lead Added')
                setLeadDescription('')
                setLeadPrice(0)
                setLeadTitle('')
                setNoLead(0)
                setLeadTags([])
            } else {
                showMessage('Failed!!', message, 'error')
            }
            
        } catch (error) {
            showMessage('Failed!!', error.message, 'error')
            setLoading(false)
        }


    }

    const showMessage = (_msg: string, desc: string, type: string = 'success') => {
        toast({
            title: _msg,
            description: desc,
            duration: 4000,
            status: type,
            position: 'top-right'
        })
    }

    return <Sidebar>
        <Center style={{
            display: showNext ? 'none' : 'flex'
        }} >
            <Stack bg={'white'} p={4} minW={'60%'} >
                <Heading>Create New Lead</Heading>
                <Input placeholder='Enter Lead title ' value={leadTitle} onChange={(e) => setLeadTitle(e.target.value)} />
                <Textarea placeholder='Enter Lead Description' value={leadDescription} onChange={(e) => setLeadDescription(e.target.value)} ></Textarea>
                <Input placeholder='Enter Lead Tags' onChange={(e) => setLeadTags((e.target.value).toString().split(','))} ></Input>
                <Input placeholder='Enter Lead Price' type='number' value={leadPrice} onChange={(e) => setLeadPrice(Number(e.target.value))} ></Input>
                <HStack>
                    <Select placeholder='Select Database' onChange={(e)=> setDb(e.target.value)} >
                        <option value="fb">Facebook</option>
                        <option value="jp">Jamal Pages</option>
                    </Select>
                    {db === 'fb' && <Select placeholder='Select Country' onChange={e => setSelectedCountry(e.target.value)} >
                        {countries.map(country => <option value={country}>{country}</option>)}
                    </Select>}
                    
                    <Input placeholder='Number Of Leads ex 300' type='number' value={noleads} onChange={(e) => setNoLead(Number(e.target.value))}  ></Input>

                </HStack>
                <Button bg={'app.mdark'} color={'white'} isLoading={isLoading} onClick={onSubmit}>Next</Button>
            </Stack>
        </Center>

       
    </Sidebar>
}

export const SearchBar = ({ onChangeText }: { onChangeText: any }) => {
    return (
        <>
            <InputGroup borderRadius={5} size="sm">
                <InputLeftElement
                    pointerEvents="none"
                    children={<Search2Icon color="gray.600" />}
                />
                <Input type="text" placeholder="Search..." border="1px solid #949494" onChange={e => onChangeText(e.target.value)} />
                <InputRightAddon
                    p={0}
                    border="none"
                >
                    <Button bgColor={'app.mdark'} color={'white'} size="sm" borderLeftRadius={0} borderRightRadius={3.3} border="1px solid #949494">
                        Search
                    </Button>
                </InputRightAddon>
            </InputGroup>
        </>
    );
};

