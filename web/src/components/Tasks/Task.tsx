import { Checkbox, Flex, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { BaseModal } from "../BaseModal";
import { Button } from "../Form/Button";
import { Input } from "../Form/Input";

interface TaskProps {
  done: boolean;
  name: string;
  subjectName: string;
}

export const Task: React.FC<TaskProps> = ({ done, name, subjectName }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isHovered, setIsHovered] = useState(false);
  const [isDone, setIsDone] = useState(done);

  return (
    <Flex
      align="center"
      onPointerOver={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      transform={isHovered ? "scale(1.01)" : "scale(1)"}
      transition="all 0.3s"
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
        cursor="pointer"
        onClick={() => setIsDone(!isDone)}
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
          onClick={onOpen}
          _hover={{
            filter: "brightness(150%)",
          }}
          transition="filter 0.2s"
        >
          <FiEdit2 size={24} color="#385795" />
        </Flex>

        <BaseModal
          isOpen={isOpen}
          onClose={onClose}
          title="Editar tarefa:"
        >
          <VStack spacing="3">
            <Input inputName="taskName" label="Nome:" type="text" value={name} />
            <Input inputName="subjectName" label="Assunto:" type="text" value={subjectName} />
            <Button mt="6" type="submit">Salvar</Button>
          </VStack>
        </BaseModal>

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