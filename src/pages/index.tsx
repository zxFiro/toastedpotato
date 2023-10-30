import type { NextPage } from 'next'
import {Link,Center,Heading} from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <Center w='1900px' h='900px'>
      <Heading alignItems={"center"}>
        Welcome to <Link href="potato" color='teal'>Potato!</Link>
      </Heading>
      </Center>
  )
}

export default Home
