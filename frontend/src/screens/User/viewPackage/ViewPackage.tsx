import React from "react";
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
import { Link, useParams } from "react-router-dom";
import { JamalLeads } from "../../../utils/type";


export default function ViewPackage() {

    const params = useParams();
    const { id } = params;

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
            const { data } = await api.get(`/order/package/${id}?page=${currentPage}`);
            const { lead } = data;
            console.log(data)
            setUsers(lead)
            setLoading(false)
            setShowIndex(0)

        } catch (error) {
            console.warn('error fetch Leads:', error)
        }
    }


    const updateCurrentShow = () => {
        setCurrentShow(users)
    }


    const handleRowClick = (record: JamalLeads) => {
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


    return <Box p={4} >

        <HStack justify={'space-between'}>
            <HStack>
                <Text size={'xl'} fontWeight={'bold'}>Enjoy Leads</Text>
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
            tableHeads={['First Name', 'Last Name', 'Gender', 'Phone Number', 'Country']}
            tableData={currentShow}
            size="sm"
            tableRender={(index, record : any) => <Tr
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
                <Td>{record.lead.firstName}</Td>
                <Td>{record.lead.lastName}</Td>
                <Td>{record.lead.gender}</Td>
                <Td>{record.lead.phoneNumber}</Td>
                <Td>{record.lead.country}</Td>
            </Tr>}
        />}
    </Box>
}
