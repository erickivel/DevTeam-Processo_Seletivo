import { Checkbox, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface TaskProps {
  done: boolean;
  name: string;
}

export const Task: React.FC<TaskProps> = ({ done, name }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDone, setIsDone] = useState(done);

  return (
    <Flex
      align="center"
      onPointerOver={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <Checkbox
        size="lg"
        borderColor="gray.600"
        isChecked={isDone}
        onChange={() => setIsDone(!isDone)}
      />
      <Text
        ml="6"
        color={isDone ? "gray.400" : "gray.600"}
        textDecorationLine={isDone ? "line-through" : ""}
        transition="all 0.3s"
      >
        {name}
      </Text>

      <Flex
        ml="auto"
        align="center"
        visibility={isHovered ? "visible" : "hidden"}
      >
        <Flex
          as="button"
          _hover={{
            filter: "brightness(150%)",
          }}
          transition="filter 0.2s"
        >
          <FiEdit2 size={24} color="#385795" />
        </Flex>

        <Flex
          as="button"
          ml="4"
          _hover={{
            filter: "brightness(150%)",
          }}
          transition="filter 0.2s"
        >
          <FiTrash2 size={24} color="#D42F2F" />
        </Flex>
      </Flex>

    </Flex>

  );
}