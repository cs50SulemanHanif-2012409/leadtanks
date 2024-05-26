import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    Image,
    useDisclosure,
} from '@chakra-ui/react'
import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons'
import { useCookies } from "react-cookie";
import { useEffect , useState } from 'react';
import api from '../fectcher';
import { useNavigate } from 'react-router-dom';
interface NavItem {
    label: string
    subLabel?: string
    children?: Array<NavItem>
    href?: string
}

interface NavProps {
    NAV_ITEMS : NavItem[],
    icon? : string
}


export default function Navigation({ NAV_ITEMS , icon } : NavProps) {
    const { isOpen, onToggle } = useDisclosure();
    const [cookies, removeCookie] = useCookies();
    const [user , setUser] = useState({ firstName : '' , lastName : '' });

    useEffect(()=>{
      getMe()
    },[])

    const getMe = async () =>{
        if(cookies?.token){
             const { data  } = await api.get('/user/me');
             const { status , user } = data;
             if(status) setUser(user)
        }
    }

    return (
        <Box position={'relative'} display={'flex'} justifyContent={'center'}>
            <Flex
               borderRadius={8}
                w={'96%'}
                top={6}
                position={'absolute'}
                color={useColorModeValue('gray.600', 'white')}
                bg={useColorModeValue('white', 'gray.600')}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                shadow={'md'}

                align={'center'}>
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}>
                    <IconButton
                        onClick={onToggle}
                        icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </Flex>
                <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                  <Image  src={icon + "/logo/logo 9.png"}  height={"50px"} alt='LeadTanks Logo' />
                </Flex>

                <Stack
                    flex={{ base: 1, md: 0 }}
                    justify={'flex-end'}
                    direction={'row'}
                    spacing={6}>
                    <Flex display={{ base: 'none', md: 'flex' }} justify={'center'} alignItems={'center'} >
                        <DesktopNav  NAV_ITEMS={NAV_ITEMS} />
                    </Flex>
                    
                    {!cookies?.token && <Button as={'a'} fontSize={'sm'} fontWeight={400} variant={'link'} href={'/signin'}>
                        Sign In
                    </Button>}
                    {!cookies?.token && <Button
                        as={'a'}
                        display={{ base: 'none', md: 'inline-flex' }}
                        fontSize={'sm'}
                        fontWeight={600}
                        color={'white'}
                        bg={'app.mdark'}
                        href={'/register'}
                        _hover={{
                            bg: 'gray.300',
                        }}>
                        Register
                    </Button>}
                    {cookies?.token && user?.firstName && <Button
                        display={{ base: 'none', md: 'inline-flex' }}
                        fontSize={'sm'}
                        fontWeight={600}
                        color={'white'}
                        bg={'app.mdark'}
                        as={'a'}
                        href='/dashboard'
                    >
                       Dashboard {user?.firstName}
                    </Button>}
                </Stack>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav NAV_ITEMS={NAV_ITEMS} />
            </Collapse>
        </Box>
    )
}

const DesktopNav = ({NAV_ITEMS}: { NAV_ITEMS : NavItem[]}) => {
    const linkColor = useColorModeValue('gray.600', 'gray.200')
    const linkHoverColor = useColorModeValue('gray.800', 'white')
    const popoverContentBgColor = useColorModeValue('white', 'gray.800')
    const navigate = useNavigate()
    return (
        <Stack direction={'row'} spacing={4}>
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                        <PopoverTrigger>
                            <Box
                                p={2}
                                onClick={()=> navigate(navItem.href ?? '#')}
                                fontSize={'sm'}
                                fontWeight={500}
                                color={linkColor}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                    cursor : 'pointer'
                                }}>
                                {navItem.label}
                            </Box>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                boxShadow={'xl'}
                                bg={popoverContentBgColor}
                                p={4}
                                rounded={'xl'}
                                minW={'sm'}>
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <DesktopSubNav key={child.label} {...child} />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    )
}

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
    return (
        <Box
            as="a"
            href={href}
            role={'group'}
            display={'block'}
            p={2}
            rounded={'md'}
            _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
            <Stack direction={'row'} align={'center'}>
                <Box>
                    <Text
                        transition={'all .3s ease'}
                        _groupHover={{ color: 'pink.400' }}
                        fontWeight={500}>
                        {label}
                    </Text>
                    <Text fontSize={'sm'}>{subLabel}</Text>
                </Box>
                <Flex
                    transition={'all .3s ease'}
                    transform={'translateX(-10px)'}
                    opacity={0}
                    _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                    justify={'flex-end'}
                    align={'center'}
                    flex={1}>
                    <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
                </Flex>
            </Stack>
        </Box>
    )
}

const MobileNav = ({NAV_ITEMS}: { NAV_ITEMS : NavItem[]}) => {
    return (
        <Stack marginTop={20} bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
            {NAV_ITEMS.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
        </Stack>
    )
}

const MobileNavItem = ({ label, children, href }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure()
    const navigate = useNavigate()
    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Box
                py={2}

                onClick={()=> navigate(href ?? '/')}
                justifyContent="space-between"
                alignItems="center"
                _hover={{
                    textDecoration: 'none',
                }}>
                <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={'all .25s ease-in-out'}
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Box>

            <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    align={'start'}>
                    {children &&
                        children.map((child) => (
                            <Box as="a" key={child.label} py={2} href={child.href}>
                                {child.label} 
                            </Box>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    )
}

