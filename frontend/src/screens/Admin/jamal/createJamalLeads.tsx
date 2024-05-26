import { useEffect, useState } from "react";
import { socket } from "../../../utils/socket";
import Sidebar from "../../../components/Admin/SideBar";
import JTable from "../../../components/Table";
import { Button, Card, HStack, Heading, Input, Tr, Td, Spinner, Center } from "@chakra-ui/react";
import { JamalLeads } from "../../../utils/type";
import api from "../../../components/fectcher";

export default function AdminCreateJamalLeads() {

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [leads, setLead] = useState<JamalLeads[]>([])
  const [isFetching, setFetching] = useState<boolean>(false)
  const [feild , setFeild] = useState<string>('')
  const [city , setCity] = useState<string>('')

  useEffect(() => {

    socket.connect()

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }


    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('jamal-response-chuck', (message) => {
      setFetching(true)
      const record: JamalLeads = JSON.parse(message)
      console.log(record)
      if (record) {
        setLead((prev: JamalLeads[]) => [record, ...prev])
        setFetching(false)
      }
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);


  const searchLeads = async () =>{
    try {
      setFetching(true)
      const { data } = await api.post('/scrapper/search/jamal' , { 
        feild,
        city
      })
      console.log(data)
      
    } catch (error) {
      setFetching(false)
    }
  }


  return <Sidebar>
    <Heading>Create New Jamal Pages Leads</Heading>
    <HStack my={10} >
      <Input placeholder="Company Type ex: IT" onChange={(e)=> setFeild(e.target.value)} ></Input>
      <Input placeholder="City ex: Karachi" onChange={(e)=> setCity(e.target.value)} ></Input>
      <Button colorScheme='facebook' onClick={searchLeads} >Find</Button>
    </HStack>
    <Center>
      <Heading>Total Leads Scrapped ({leads.length})</Heading>
    </Center>
    {isFetching && <Spinner color="red.500" /> }
    <Card>
      {leads.length > 0 && <JTable
        tableHeads={['company', 'phoneNumber', 'address', 'country', 'city', 'website Link']}
        tableData={leads}
        size="sm"
        tableRender={(index, record: any) => <Tr
          key={record._id}
          _hover={{
            backgroundColor: 'gray.100'
          }}
          borderBottomColor={'gray.500'}
          borderBottomWidth={1.1}
          cursor="pointer"
          backgroundColor={
            (index % 2 === 0) ? 'gray.100' : 'white'
          }
        >
          <Td>{record.title}</Td>
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
    </Card>
  </Sidebar>
}