import { Center, Text , Stack } from "@chakra-ui/react";
import { useRouteError } from "react-router-dom";

export default () => {
    const error: any = useRouteError();
    console.error(error);
    return <Center minH={'100vh'}>
        <Stack justify={'center'} alignItems={'center'} >
            <Text fontSize={'3xl'} fontWeight={'bold'} >Oops Page Encountered an Error</Text>
            <Text fontSize={'2xl'} color={'gray.600'} >404 Error {error?.statusText}</Text>
            <Text color={'red.600'} >{error?.error?.message || error?.statusText}</Text>
        </Stack>
    </Center>
}