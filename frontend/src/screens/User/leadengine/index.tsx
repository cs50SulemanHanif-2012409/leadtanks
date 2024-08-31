import { useEffect, useState } from "react";
import { Search2Icon, StarIcon } from "@chakra-ui/icons";
import { Button, Card, CardHeader, Divider, HStack, Image, Input, Select, Stack, Text, useToast } from "@chakra-ui/react";
import Loader from "../../../components/Loader";
import api from "../../../components/fectcher";
import { socket } from "../../../utils/socket";

interface GoogleMaps {
    placeId: string,
    address: string,
    category: string,
    phone: string,
    googleUrl: string,
    bizWebsite: string,
    storeName: string,
    ratingText: string,
    stars: number,
    numberOfReviews: number
}
interface Yelp {
    about: string
    address: string
    image: string
    link: string
    name: string
    phoneNumber: string
    website: string
}

export default function LeadEngine() {
    const [query, setQuery] = useState('');
    const [city, setCity] = useState('');
    const [result, setResult] = useState<GoogleMaps[]>([]);
    const [loading, setLoading] = useState(false);
    const [yelpResult, setYelpResult] = useState<Yelp[]>([]);

    const [scrapperType, setScrapperType] = useState('maps');

    const toast = useToast();


    useEffect(() => {
        // window.jsonToCSV = jsonToCSV;
        socket.on("yelp-response-chuck", (data: any) => {
            // const bizLead = JSON.parse(data) 
            console.log(data)
            //@ts-ignore
            setYelpResult(prev => [...prev, data])
        })

    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (query === '' || city === '') {
            toast({
                title: 'Error',
                description: 'Please fill all the fields',
                position: 'top-right',
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
            return;
        }

        if (scrapperType === 'maps') {
            getMapResults();
        }
        else if (scrapperType === 'yelp') {
            getYelpResults();
        }
    }

    const getYelpResults = async () => {
        let temp = yelpResult;
        try {
            setLoading(true);
            setYelpResult([]);
            setResult([]);
            const { data } = await api.post('/scrapper/search/yelp', {
                desc: query,
                loc: city
            });
            console.log(data);
            if (data.length > 0) {
                setYelpResult(data)
            }
            console.log(data);
            setLoading(false);

        } catch (error) {
            setLoading(false);

            toast({
                title: 'Error',
                description: 'Something went wrong, Please Try Again',
                position: 'top-right',
                duration: 4000,
                status: 'error'
            })
        }
    }
    const getMapResults = async () => {
        let temp = result;
        try {
            setLoading(true);
            setYelpResult([]);
            setResult([]);
            const { data } = await api.post('/scrapper/search/maps', {
                search: `${query} ${city}`
            });
            if (data.length > 0) {
                setResult(data)
            } else {
                setResult(temp)
            }
            console.log(data);
            setLoading(false);

        } catch (error) {
            setLoading(false);
            setResult(temp)
            toast({
                title: 'Error',
                description: 'Something went wrong, Please Try Again',
                position: 'top-right',
                duration: 4000,
                status: 'error'
            })
        }
    }


    const downloadCSV = () => {
        function jsonToCSV(data: GoogleMaps[] | Yelp[]) {
            const csvRows = [];

            // Get the keys from the first object
            const keys = scrapperType === 'maps' ? ["storeName","phone","bizWebsite","googleUrl"] : Object.keys(data[0]);

            // Add the header row
            csvRows.push(keys.join(','));

            for (const item of data) {
                //@ts-ignore
                const values = keys.map(key => item[key]);
                csvRows.push(values.join(','));
            }

            return csvRows.join('\n');
        }
        const csv = jsonToCSV(scrapperType === 'maps' ? result : yelpResult);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const csvUrl = URL.createObjectURL(blob);

        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', csvUrl);
        downloadLink.setAttribute('download', `${query}_${city}_${new Date().toLocaleDateString()}.csv`);

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    return (
        <Stack minH={'100vh'}>

            <Text fontSize={'3xl'} fontFamily={'fantasy'} fontWeight={'bold'} textAlign={'center'} >
                Lead Engine
            </Text>
            <HStack m={5} rounded={6} gap={4} p={6} justifyContent={'center'} alignItems={'center'} bgGradient={'linear(to-r, purple.400,pink.400)'} >
                <Input placeholder="Ex: Saloon" bg={'white'} value={query} onChange={(e) => setQuery(e.target.value)} />
                <Input placeholder="Ex: Newyork" bg={'white'} value={city} onChange={(e) => setCity(e.target.value)} />
                <Select bg={'white'}
                    onChange={(e) => setScrapperType(e.target.value)}
                >
                    <option value="maps">Maps</option>
                    <option value="yelp">Yelp</option>
                </Select>
                <Button
                    fontFamily={'heading'}
                    w={'full'}
                    bgGradient="linear(to-r, #9b59b6, #e74c3c)"
                    color={'white'}
                    _hover={{
                        bgGradient: 'linear(to-r, #8e44ad, #c0392b)',
                        boxShadow: 'xl',
                    }}
                    py={6}
                    fontSize={'xl'}
                    fontWeight={'bold'}
                    borderRadius={50}
                    maxW={250}
                    leftIcon={<Search2Icon />}
                    onClick={handleSubmit}
                >
                    {" Search"}

                </Button>
            </HStack>
            {loading && <Text textAlign={'center'} color={'gray.600'} fontStyle={'italic'} >This process may take 30s ~ 2min. Please be patient.</Text>}
            {loading && <Loader />}
            {result.length &&
                <HStack justifyContent={'space-between'} px={10}>
                    <Text fontSize={'xl'} textAlign={'center'} >Total Results ({result.length})</Text>
                    <Button onClick={downloadCSV} >Download CSV</Button>
                </HStack>
            }
            {yelpResult.length > 0 &&
                <HStack justifyContent={'space-between'} px={10}>
                    <Text fontSize={'xl'} textAlign={'center'} >Total Results ({yelpResult.length})</Text>
                    <Button onClick={downloadCSV} >Download CSV</Button>
                </HStack>
            }
            <Stack gap={2} flexWrap={'wrap'} flexDir={'row'} justifyContent={'center'} >
                {result.map((item: GoogleMaps, index: number) => (
                    <Card key={index} m={5} rounded={6} gap={4} p={6} justifyContent={'center'}
                        alignItems={'center'} width={['100%', '40%',]}  >

                        <HStack justifyContent={'space-between'} width={'100%'}  >
                            <Text fontSize={'md'} color={'app.mdark'} fontWeight={'bold'} textAlign={'center'} >
                                <a href={item.googleUrl} target="_blank" rel="noopener noreferrer">
                                    {item.storeName}
                                </a>
                            </Text>
                            <Text fontSize={'sm'} color={'gray.500'} textAlign={'center'} >
                                {item.ratingText}
                            </Text>

                        </HStack>

                        <Divider orientation="horizontal" />
                        <HStack justifyContent={'space-between'} width={'100%'} >
                            <Text>Address : </Text>
                            <Text  >
                                {item.address}
                            </Text>
                        </HStack>
                        <HStack justifyContent={'space-between'} width={'100%'} >
                            <Text>Phone : </Text>
                            <Text  >
                                {item.phone}
                            </Text>
                        </HStack>
                        <HStack justifyContent={'space-between'} width={'100%'} >
                            <Text>Website : </Text>
                            <a href={item.bizWebsite} style={{ color: 'blue' }}> {item.bizWebsite?.substring(0, 50)}</a>

                        </HStack>
                        <HStack justifyContent={'space-between'} width={'100%'} >
                            <Text>Reviews : </Text>
                            <Text  >
                                {item.numberOfReviews}
                            </Text>
                        </HStack>
                        <HStack justifyContent={'space-between'} width={'100%'} >
                            <Text>Rating : </Text>
                            <HStack>
                                {[...Array(Math.floor(item.stars))].map((_, i) => (
                                    <StarIcon key={i} color={'gold'} />
                                ))}
                                {[...Array(5 - Math.floor(item.stars))].map((_, i) => (
                                    <StarIcon key={i + Math.floor(item.stars)} />
                                ))}
                            </HStack>
                        </HStack>


                    </Card>
                ))}
                {yelpResult.map((item: Yelp, index: number) => (
                    <Card key={index} m={5} rounded={6} gap={4} pb={6} px={3} justifyContent={'center'}
                        alignItems={'center'} width={['100%', '30%',]}  >
                        <a href={item?.link} target="_blank" rel="noopener noreferrer">
                            <Image src={item?.image} alt={item?.name} />
                        </a>

                        <HStack justifyContent={'space-between'} width={'100%'}  >
                            <Text>Bussiness Name : </Text>
                            <Text fontSize={'md'} color={'app.mdark'} fontWeight={'bold'} textAlign={'center'} >
                                <a href={item?.link} target="_blank" rel="noopener noreferrer">
                                    {item?.name}
                                </a>
                            </Text>

                        </HStack>


                        <HStack justifyContent={'space-between'} width={'100%'} >
                            <Text>Address : </Text>
                            <Text  >
                                {item?.address?.replace("Get Directions", "")}
                            </Text>
                        </HStack>
                        <HStack justifyContent={'space-between'} width={'100%'} >
                            <Text>Phone : </Text>
                            <Text  >
                                {item?.phoneNumber?.replace("Phone number", "")}
                            </Text>
                        </HStack>
                        <HStack justifyContent={'space-between'} width={'100%'} >
                            <Text>Website : </Text>
                            <a href={item?.website} style={{ color: 'blue' }}> {item?.website?.replace("Business website", "")}</a>
                        </HStack>




                    </Card>
                ))}
            </Stack>
        </Stack>
    )
}