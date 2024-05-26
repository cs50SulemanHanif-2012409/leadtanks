import React from "react";
import Sidebar from "../../../components/Admin/SideBar";
import api from "../../../components/fectcher";
import {
    Button,
    HStack,
    Box,
    Text,
} from '@chakra-ui/react'
import { Tr, Td } from '@chakra-ui/react';
import JTable from "../../../components/Table";
import { FcComboChart } from "react-icons/fc";
import { Link } from "react-router-dom";
import { JamalLeads } from "../../../utils/type";

export default function AdminJamalLeads() {
    return (
        <Sidebar >
            <JamalTable />
        </Sidebar>
    );
}

function JamalTable() {


    const [selectedData, setSelectedData] = React.useState<string[]>([]);
    const [users, setUsers] = React.useState([]);

    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(100);


    const [currentShow, setCurrentShow] = React.useState<JamalLeads[]>([]);
    const [showIndex, setShowIndex] = React.useState<number | null>(null)

    const [isLoading, setLoading] = React.useState<boolean>(true)


    React.useEffect(() => {
        setLoading(true)
        fetchUsers()
        updateCurrentShow()
    }, [currentPage, pageSize]);

    React.useEffect(() => {
        updateCurrentShow()
    }, [showIndex])


    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/jamal/companies?page=' + currentPage);
            const { companies } = data;
            setUsers(companies)
            setLoading(false)
            setShowIndex(0)

        } catch (error) {
            console.warn('error fetch Jamal companies:', error)
        }
    }


    const updateCurrentShow = () => {
        setCurrentShow(users)
    }


    const handleRowClick = (record : JamalLeads) => {
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
            <HStack>
                <Link to={'/admin/scrap/leads/jamalpages'} >
                <Button colorScheme='purple' >
                    <FcComboChart />
                    {' Generate New Leads'}</Button>
                </Link>
            </HStack>
            <HStack>
                <Button
                    onClick={handlePreviousPage}
                    isDisabled={currentPage === 1}
                    mr={2}
                    size={'sm'}
                >
                    {"<"}  Page {currentPage - 1}
                </Button>
                <Text>Page {currentPage}</Text>
                <Button size={'sm'} onClick={handleNextPage} isDisabled={users.length < pageSize}>
                    Page {currentPage + 1} {">"}
                </Button>
            </HStack>
        </HStack>
        {isLoading && <Text>Loading...</Text>}
        {!isLoading && currentShow.length > 0 && <JTable 
        tableHeads={['company', 'phoneNumber', 'address', 'country', 'city', 'website Link']}
            tableData={currentShow}
            size="sm"
            tableRender={(index, record : any ) => <Tr
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
                <Td>{record.title.length > 40 ? record.title.substring(0, 40)+'...' : record.title}</Td>
                <Td>{record.phoneNumber}</Td>
                <Td>{record.address.substring(0, 20)}...</Td>
                <Td>{record.country}</Td>
                <Td>{record.city}</Td>
                <Td textDecoration={'underline'} color={'blue.600'} >
                    <a href={record.websiteLink} style={{
                        color: 'blue'
                    }} >Visit</a>
                </Td>
            </Tr>}
        />}
    </Box>
}
