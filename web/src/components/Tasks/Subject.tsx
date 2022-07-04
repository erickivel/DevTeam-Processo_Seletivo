import { Flex, Text } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { TaskData } from "../../pages/Home";

import { Task } from "./Task";

interface SubjectProps {
  name: string;
  tasks: TaskData[];
}

export const Subject: React.FC<SubjectProps> = ({ name, tasks }) => {
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
        <Text fontWeight="medium" fontSize="xl">{name}</Text>
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
      {
        tasks.map(task => (
          <Task key={task.id} done={task.done} name={task.name} />
        ))
      }

    </Flex>
  );
}