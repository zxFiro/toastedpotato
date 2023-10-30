import { Flex, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const Potato = () => {
    const router = useRouter()

    
    return (
        <Flex height="100vh"  alignItems="center" justifyContent="center">
            <Flex direction="column" background="gray.100" p={12} rounded={6}>
                <Heading onClick={() => router.push({pathname:"plainb",query:{pid:"e1"} })}>
                    fracciones1
                </Heading>
                <Heading onClick={() => router.push({pathname:"plainb",query:{pid:"e2"}})}>
                    fracciones2
                </Heading>
                <Heading onClick={() => router.push({pathname:"plainb",query:{pid:"e3"}})}>
                    potencias1
                </Heading>
                <Heading onClick={() => router.push({pathname:"plainb",query:{pid:"e4"}})}>
                    potencias2
                </Heading>
                <Heading onClick={() => router.push({pathname:"plainb",query:{pid:"e5"}})}>
                    potencias3
                </Heading>
                <Heading onClick={() => router.push({pathname:"plainb",query:{pid:"e6"}})}>
                    potencias4
                </Heading>
                <Heading onClick={() => router.push("plainpotato")}>
                    persistentpotato
                </Heading>
            </Flex> 
        </Flex>
    )
}
  
  export default Potato