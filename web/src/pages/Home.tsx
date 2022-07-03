import { Flex, Text, VStack } from "@chakra-ui/react";

import { Header } from "../components/Header";
import { Subject } from "../components/Tasks/Subject";

const Home: React.FC = () => {
  return (
    <>
      <Header />

      <Flex
        w="100%"
        maxWidth={1480}
        mx="auto"
        mb="20"
        flexDirection="column"
      >
        <Text
          my="8"
          color="blue.500"
          fontSize="4xl"
          fontWeight="medium"
        >
          Tarefas
        </Text>

        <VStack spacing="6">
          <Subject />
          <Subject />
          <Subject />
        </VStack>

      </Flex>
    </>
  );
}

export default Home;