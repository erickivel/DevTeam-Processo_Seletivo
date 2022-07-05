import { Flex, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";
import { TaskData } from "../../pages/Home";
import { BaseModal } from "../BaseModal";
import { Button } from "../Form/Button";
import { Input } from "../Form/Input";

import { Task } from "./Task";

interface SubjectProps {
  name: string;
  tasks: TaskData[];
}

export const Subject: React.FC<SubjectProps> = ({ name, tasks }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          onClick={onOpen}
          _hover={{
            filter: "brightness(75%)"
          }}
          transition="filter 0.3s"
        >
          <FiPlus size={30} color="#EB7D3D" />
        </Flex>
      </Flex>

      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Nova tarefa:"
      >
        <VStack spacing="3">
          <Input inputName="name" label="Nome:" type="text" />
          <Input inputName="subjectName" label="Assunto:" type="text" value={name} isDisabled />
          <Button mt="6" type="submit">Criar</Button>
        </VStack>
      </BaseModal>

      {
        tasks.map(task => (
          <Task key={task.id} done={task.done} name={task.name} subjectName={name} />
        ))
      }

    </Flex>
  );
}