import { Box, HStack, Stack, Text, useColorModeValue } from "@chakra-ui/react";


export default function ProfileLead() {
    return <HStack padding={8} borderRadius={8} bgColor={useColorModeValue('app.mlight', 'gray.700')} >
        <Box bgColor={'#74D98A'} padding={2} borderRadius={8} >
            <Text color={'white'} fontWeight={'bold'} >JD</Text>
        </Box>
        <Stack padding={0} width={'90%'} >
            <Text lineHeight={0.1} fontWeight={'semibold'} >Jhon Doe</Text>
            <Text fontWeight={'extrabold'} >USA</Text>
        </Stack>
        <Stack as={'a'} href="#+820123456">
            <img src="./call.png" alt="call icon" />
        </Stack>
    </HStack>
}