import React from 'react';
import {
    Tr,
    Td,
    Button,
    Stack, Select, HStack
} from '@chakra-ui/react'
import {
    Input,
    InputGroup,
    InputLeftElement,
    InputRightAddon,
    useToast,
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
import { useNavigate } from 'react-router-dom';
import api from '../../components/fectcher';
import JTable from '../../components/Table';
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { formatNumber } from '../../utils';


type TypePackage = {
    createdAt: string,
    leadDescription: string
    leadPrice: number,
    leadTags: Array<string>,
    leadTitle: string,
    noleads: number,
    updatedAt: Date,
    _id: string
}

export default function AdminPackages() {
    const router = useNavigate()
    const toast = useToast()
    const [packages, setPackages] = React.useState<TypePackage[]>([])
    const [currentPage, setCurrentPage] = React.useState(1);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [selectedPackage, setSelectedPackage] = React.useState<TypePackage | null>(null);

    React.useEffect(() => {
        fetchPackages()
    }, [])

    const fetchPackages = async () => {
        try {
            const { data } = await api.get('/admin/packages?page=' + currentPage);
            const { packages } = data;
            setPackages(packages)


        } catch (error) {
            console.warn(error)
        }
    }

    async function removePackage(id: string) {
        try {
            const { data } = await api.delete(`/admin/package/${id}`, { timeout: 30000 })
            const { status, message } = data;
            if (status) {
                showMessage('Removed', message)
                setPackages(packages.filter(pkg => pkg._id !== id))
            } else {
                showMessage('Removed Failed', message, "error")
            }
        } catch (error: any) {
            showMessage('Removed Failed', error.message.toString(), "error")
        }
    }

    async function updatePackage() {
        try {

            const { data } = await api.patch(`/admin/package/${selectedPackage?._id}`, selectedPackage)
            const { status } = data;
            if (status) {
                setPackages(packages.filter(p => {
                    if (p._id === selectedPackage?._id) {
                        return selectedPackage;
                    } else {
                        return p;
                    }
                }))
                onClose()
                window.location.reload()
                console.log(data)
            }

        } catch (error) {

        }
    }

    function handleInputChange(e: any) {
        const pkg: any = { ...selectedPackage, [e.target.name]: e.target.value ?? '' };
        setSelectedPackage(pkg)
    }

    const showMessage = (_msg: string, desc: string, status: "success" | "error" | "info" | "warning" | "loading" | undefined = "success") => {
        toast({
            status,
            title: _msg,
            description: desc,
            duration: 4000,
            position: 'top-right'
        })
    }



    const Row = ({ p }: { p: TypePackage }) => {
        return <Tr
            key={p._id}
            _hover={{
                backgroundColor: 'gray.100',
                cursor: 'pointer'
            }}
        >
            <Td  >{p.leadTitle}</Td>
            <Td>{p.leadTags.join(',')}</Td>
            <Td>{p.leadPrice}</Td>
            <Td>{formatNumber(p.noleads)}</Td>
            <Td>{new Date(p.createdAt).toLocaleDateString()}</Td>
            <Td  >
                <Button m={1} p={2} bg={'blue.400'} color={'white'} onClick={() => {
                    onOpen()
                    setSelectedPackage(p)
                }} >
                    <BsPencilSquare />
                </Button>
                <Button m={1} p={2} colorScheme='red' onClick={removePackage.bind(null, p._id)} >
                    <FaTrashAlt />
                </Button>
            </Td>
        </Tr>
    }

    return <Sidebar>

        <Button bg={'app.mdark'} color={'white'} mb={2} onClick={() => {
            router('/admin/create/package');
        }} >Add+ </Button>
        {packages.length > 0 ? <JTable

            size='sm'
            bg='white'
            tableData={packages}
            tableHeads={['Package Name', 'Tags', 'Price', 'No of. Leads', 'Created On', 'Actions']}
            tableRender={(index: any, p: any) => <Row p={p} />}
        /> : <Text>No Packages Found</Text>}


        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update Lead</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack bg={'white'} p={4} minW={'60%'} >
                        <Input placeholder='Enter Lead title ' value={selectedPackage?.leadTitle} name='leadTitle' onChange={handleInputChange} />
                        <Textarea placeholder='Enter Lead Description' value={selectedPackage?.leadDescription} name='leadDescription' onChange={handleInputChange} ></Textarea>
                        <Input placeholder='Enter Lead Tags' value={selectedPackage?.leadTags.join(',')} name='leadTags' onChange={handleInputChange} ></Input>
                        <Input placeholder='Enter Lead Price' type='number' value={selectedPackage?.leadPrice} name='leadPrice' onChange={handleInputChange}></Input>
                        <HStack>
                            <Select placeholder='Select Database' disabled >
                                <option value="fb">Facebook</option>
                            </Select>
                            <Select placeholder='Select Country' disabled  >
                                {/* {countries.map(country => <option value={country}>{country}</option>)} */}
                            </Select>
                            <Input placeholder='Number Of Leads ex 300' type='number' value={selectedPackage?.noleads} disabled  ></Input>
                        </HStack>
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button variant='ghost' onClick={updatePackage} >Update</Button>
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
