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
    FormControl, Switch, FormLabel
} from '@chakra-ui/react'
import {
    Input,
    InputGroup,
    InputLeftElement,
    InputRightAddon
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import Sidebar from "../../components/Admin/SideBar";
import api from '../../components/fectcher';
import JTable from '../../components/Table';

type Users = {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    createdAt: Date,
    ip: string,
    _id: string,
    isBanned: boolean
}


export default function AdminUsers() {
    const [users, setUsers] = React.useState<Users[]>([]);

    React.useEffect(() => {
        fetchUsers()
    }, [])

    async function fetchUsers() {
        try {
            const { data } = await api.get('/admin/users')
            const { status, message, users } = data;
            if (status) {
                setUsers(users)
            } else {
                console.log(message)
            }

        } catch (error) {
            console.log(error)
        }
    }



    return <Sidebar>
 
        {users.length > 0 && <JTable
        size='sm'
            tableData={users}
            tableHeads={['User Name', 'Email', 'Joined', 'IP', 'Banned', 'Remove']}
            tableRender={(index: any, user: any) => {
                return <Row key={index} user={user} />
            }}
            bg='white'
        />}
    </Sidebar>
}


type RowProps = {
    user: Users,
}

const Row = ({ user }: RowProps) => {

    const [isChecked, setChecked] = React.useState(user.isBanned)


    async function ToggleBanned(e: React.ChangeEvent<HTMLInputElement>, id: string) {
        const { data } = await api.put('/admin/user/' + id, { isBanned: e.target.checked });
        setChecked(e.target.checked)
    }

    async function RemoveUser(id: string) {
        const { data } = await api.delete('/admin/user/' + id);
        if (data.status) {
            window.location.reload()
        }
    }

    return <Tr

        _hover={{
            backgroundColor: 'gray.100',
            cursor: 'pointer'
        }}
    >
        <Td style={{ fontWeight: 'bold' }} >{user?.firstName + ' ' + user?.lastName}</Td>
        <Td>{user?.email}</Td>
        <Td>{new Date(user?.createdAt).toDateString()}</Td>
        <Td>{user.ip === '::1' ? 'localhost' : user.ip}</Td>
        <Td isNumeric >
            <FormControl display='flex' alignItems='center'>
                <FormLabel htmlFor='email-alerts' mb='0'>
                    {isChecked ? 'Banned' : 'Ban'}
                </FormLabel>
                <Switch id='email-alerts' isChecked={isChecked} onChange={(e) => {
                    ToggleBanned(e, user._id)
                    setChecked(!isChecked)
                }} />
            </FormControl>
        </Td>
        <Td>
            <Button colorScheme='red' onClick={() => { RemoveUser(user._id) }} >Remove</Button>
        </Td>
    </Tr>
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
