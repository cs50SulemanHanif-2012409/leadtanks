//@ts-nocheck
import React from "react";
import Sidebar from "../../components/Admin/SideBar";
import api from "../../components/fectcher";
import {
    Button,
    HStack,
    Box,
    Text,
} from '@chakra-ui/react'
import { IoMdSearch } from "react-icons/io";
import { Select } from '@chakra-ui/react'
import { Table, Tbody, Tr, Td, Thead } from '@chakra-ui/react';
import JTable from "../../components/Table";


export default function AdminFacebookLeads() {
    return (
        <Sidebar >
            <FBUsersTable />
        </Sidebar>
    );
}

function FBUsersTable() {


    const [selectedData, setSelectedData] = React.useState([]);
    const [users, setUsers] = React.useState([]);

    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(100);


    const [currentShow, setCurrentShow] = React.useState([]);
    const [showIndex, setShowIndex] = React.useState<number | null>(null)
    
    const [countries, setCountries] = React.useState([]);
    const [selectedCountry, setSelectedCountry] = React.useState('all')
    
    const [isLoading , setLoading] = React.useState<boolean>(true)



    React.useEffect(() => {
        setLoading(true)
        fetchUsers()
        // updateCurrentShow()
    }, [currentPage, pageSize, selectedCountry]);

    React.useEffect(() => {
        updateCurrentShow()
    }, [showIndex])

    React.useEffect(() => {
        fetchCountries()
    }, [])

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/fb/users?page=' + currentPage + '&country=' + selectedCountry);
            const { users } = data;
         
            setUsers(users)
            setCurrentShow(users)
            setLoading(false)
            setShowIndex(0)

        } catch (error) {
            console.warn('error fetch User:', error)
        }
    }
    const fetchCountries = async () => {
        const { data } = await api.get('/admin/fb/countries');
        const { countries } = data;
        setCountries(countries.countries)
    }

    const updateCurrentShow = () => {
        console.log(users , selectedCountry)
        setCurrentShow(users)
    }


    const handleRowClick = (record) => {
        // Check if the clicked row is already selected
        const isSelected = selectedData.some((row) => row === record._id);

        if (isSelected) {
            // If the row is already selected, remove it from the selectedRows state
            setSelectedData((prevState) =>
                prevState.filter((row) => row !== record._id)
            );
        } else {
            // If the row is not selected, add it to the selectedRows state
            setSelectedData((prevState) => [...prevState, record._id]);
        }
    };
    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };




    return <Box>

        <HStack justify={'space-between'}>
            <Select w={{ base : '100%' , lg : '30%'}} placeholder='Select Country' onChange={e => setSelectedCountry(e.target.value)} >
                {countries.map(country => <option value={country}>{country}</option>)}
            </Select>
            <Text>Country : {selectedCountry}</Text>
            <HStack>
            <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                mr={2}
            >
                {"<<"}  Page {currentPage - 1}
            </Button>
            <Text>Page {currentPage}</Text>
            <Button onClick={handleNextPage} disabled={users.length < pageSize}>
                Page {currentPage + 1} {">>"}
            </Button>
        </HStack>
        </HStack>
        {isLoading && <Text>Loading...</Text>}
        {!isLoading && currentShow.length > 0 && <JTable 
          size="sm"
        tableHeads={['First Name', 'Last Name', 'Gender', 'Phone Number', 'Country']}
            tableData={currentShow}
            tableRender={(index, record) => <Tr
                key={record._id}
                _hover={{
                    backgroundColor: 'gray.100'
                }}
                borderBottomColor={'gray.500'}
                borderBottomWidth={1.1}
                onClick={() => handleRowClick(record)}
                cursor="pointer"
                backgroundColor={
                    selectedData.some((row) => row === record._id)
                        ? 'blue.100'
                        : (index % 2 === 0) ? 'gray.100' : 'white'
                }
            >
                <Td>{record.firstName}</Td>
                <Td>{record.lastName}</Td>
                <Td>{record.gender}</Td>
                <Td>{record.phoneNumber}</Td>
                <Td>{record.country}</Td>
            </Tr>}
        />}
    </Box>
}
