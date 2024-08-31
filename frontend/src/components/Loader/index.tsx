
import loadingGif from './loading.gif'
import { Center, Image } from '@chakra-ui/react'
export default function Loader() {
    return (
        <Center>
            <Image src={loadingGif} alt="loading" maxW={300} />
        </Center>
    )
}