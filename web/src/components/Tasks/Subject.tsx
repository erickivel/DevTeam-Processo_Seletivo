import { Flex, Text } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

import { Task } from "./Task";

export const Subject: React.FC = () => {
  return (
    <Flex
      w="100%"
      p="8"
      bg="gray.50"
      borderRadius={16}
      flexDirection="column"
      boxShadow="lg"
    >
      <Flex
        justify="space-between"
        align="center"
        mb="6"
      >
        <Text fontWeight="medium" fontSize="xl">Assunto</Text>
        <Flex
          as="button"
          _hover={{
            filter: "brightness(75%)"
          }}
          transition="filter 0.3s"
        >
          <FiPlus size={30} color="#EB7D3D" />
        </Flex>
      </Flex>

      <Task />
      <Task />
      <Task />
      <Task />
      <Task />

    </Flex>
  );
}