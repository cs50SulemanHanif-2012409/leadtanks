import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
    Center,
    Stack,
    FormControl, Switch, FormLabel,
    HStack,
    Toast,
    useToast
} from '@chakra-ui/react'
import {
    Input,
    InputGroup,
    InputLeftElement,
    InputRightAddon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Text,
    Textarea,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import Sidebar from "../../components/Admin/SideBar";
import api from '../../components/fectcher';
import JTable from '../../components/Table';
import { BsPencilSquare } from "react-icons/bs";


export default function AdminOrders() {
    const [orderlist, setOrders] = React.useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [selectedOrder, setSelectedOrder] = React.useState<any>({})

    const toast = useToast();

    React.useEffect(() => {
        fetchOrders()
    }, [])

    async function fetchOrders() {
        try {
            const { data } = await api.get('/admin/orders')
            const { status, message, orders } = data;
            console.log(orders)
            if (orders) {
                setOrders(orders)
            } else {
                console.log(message)
            }

        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                toast({ description: error.message, title: 'Error', status: 'error', position: "top" })
            }

        }
    }


    const completeOrder = async () => {
        try {

            const { data } = await api.put(`/admin/order/${selectedOrder._id}`, {
                status: 'completed'
            })
            toast({ description: 'Order completed', title: 'Success', status: 'success', position: "top" })
            console.log(data)

            fetchOrders()

        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                toast({ description: error.message, title: 'Error', status: 'error', position: "top" })
            }
        }
    }



    return <Sidebar>

        {orderlist.length > 0 && <JTable
            size='sm'
            tableData={orderlist}
            tableHeads={['Order Id', 'Products', 'Total Price', 'Status', 'Payment Status', 'Date', 'Actions']}

            tableRender={(index: any, record: any) => {
                return <Tr>
                    <Td>{record._id}</Td>
                    <Td>{record.packages?.[0].leadTitle} ...</Td>
                    <Td>{record.total}</Td>
                    <Td>{record.status}</Td>
                    <Td>{record.paymentStatus}</Td>
                    <Td>{record.createdAt}</Td>
                    <Td>
                        <Button m={1} p={2} bg={'blue.400'} color={'white'} onClick={() => {
                            onOpen()
                            setSelectedOrder(record)
                        }} >
                            <BsPencilSquare />
                        </Button>

                    </Td>
                </Tr>
            }}
            bg='white'
        />}

        <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Updated Order</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack bg={'white'} p={4} minW={'60%'} >
                        <HStack>
                            <Text fontWeight={'medium'} >Order Id :</Text>
                            <Text fontSize={'smaller'} fontFamily={'mono'} >{selectedOrder?._id}</Text>
                        </HStack>
                        <HStack>
                            <Text fontWeight={'medium'} >Package :</Text>
                            <Text fontFamily={'mono'} >{selectedOrder?.packages?.[0].leadTitle}</Text>
                        </HStack>
                        <HStack>
                            <Text fontWeight={'medium'} >Total :</Text>
                            <Text fontFamily={'mono'} >${selectedOrder?.total}</Text>
                        </HStack>
                        <HStack>
                            <Text fontWeight={'medium'} >Status :</Text>
                            <Text fontFamily={'mono'} >{selectedOrder?.status}</Text>
                        </HStack>
                        <HStack>
                            <Text fontWeight={'medium'} >Payment Status :</Text>
                            <Text fontFamily={'mono'} >{selectedOrder?.paymentStatus}</Text>
                        </HStack>
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button colorScheme='red' onClick={completeOrder} >Complete Order</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
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
