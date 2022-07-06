import { SyntheticEvent, useCallback, useState } from "react";

import { Box, Checkbox, Flex, Text, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

import { BaseModal } from "../BaseModal";
import { Button } from "../Form/Button";
import { Input } from "../Form/Input";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

interface TaskProps {
  id: string;
  done: boolean;
  name: string;
  subjectName: string;
  subjectId: string;
}

interface InputErrors {
  taskName: {
    message: string
  },
  subjectName: {
    message: string;
  }
}

export const Task: React.FC<TaskProps> = ({ done, name, id, subjectName, subjectId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [isHovered, setIsHovered] = useState(false);
  const [isDone, setIsDone] = useState(done);
  const [taskNameValue, setTaskNameValue] = useState(name);
  const [subjectNameValue, setSubjectNameValue] = useState(subjectName);
  const [inputErrors, setInputErrors] = useState<InputErrors>({} as InputErrors);

  const { token, tasksWithSubjects, setTasksWithSubject } = useAuth();

  const handleDeleteTask = useCallback(async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedTasksList = tasksWithSubjects.map(subject => {
        if (subject.id === subjectId) {
          const taskIndex = subject.tasks.findIndex(t => t.id === id);

          subject.tasks.splice(taskIndex, 1);
        }

        return subject;
      })

      setTasksWithSubject(updatedTasksList);
    } catch (error) {
      toast({
        title: "Oops",
        description: "Erro no servidor",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    }
  }, [token, toast, setTasksWithSubject, tasksWithSubjects, subjectId]);

  const handleEditTask = useCallback(async (event: SyntheticEvent) => {
    try {
      event.preventDefault();

      const target = event.target as typeof event.target & {
        taskName: { value: string }
        subjectName: { value: string }
      }

      if (target.subjectName.value === "") {
        setInputErrors({
          ...inputErrors,
          subjectName: {
            message: "Nome do assunto é obrigatório"
          }
        })

        return;
      }

      if (target.taskName.value === "") {
        setInputErrors({
          ...inputErrors,
          taskName: {
            message: "Nome da tarefa é obrigatório"
          }
        })

        return;
      }

      const { data } = await api.put(`/tasks/${id}`, {
        taskName: target.taskName.value,
        subjectName: target.subjectName.value
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const subjectExists = tasksWithSubjects.find(subject => subject.id === data.subjectId);

      if (subjectName === target.subjectName.value) {
        const tasksListsUpdated = tasksWithSubjects.map(subject => {
          if (subject.id === subjectId) {
            const taskIndex = subject.tasks.findIndex(t => t.id === id);
            subject.tasks[taskIndex] = {
              ...subject.tasks[taskIndex],
              name: target.taskName.value
            }

            return subject;
          }

          return subject;
        });

        setTasksWithSubject(tasksListsUpdated);
      } else if (subjectExists) {
        const tasksListsUpdated = tasksWithSubjects.map(subject => {

          if (subject.id === subjectId) {
            const taskIndex = subject.tasks.findIndex(t => t.id === id);
            subject.tasks.splice(taskIndex, 1);
          }

          if (subject.name === target.subjectName.value) {
            subject.tasks = [
              ...subject.tasks,
              {
                id,
                name: target.taskName.value,
                done,
              }
            ]
          }

          return subject;
        });

        setTasksWithSubject(tasksListsUpdated);
      } else {
        const tasksWithoutTaskToBeUpdated = tasksWithSubjects.map(subject => {
          if (subject.id === subjectId) {
            const taskIndex = subject.tasks.findIndex(t => t.id === id);
            subject.tasks.splice(taskIndex, 1);
          }

          return subject;
        })

        const tasksListsUpdated = [
          ...tasksWithoutTaskToBeUpdated,
          {
            id: data.subjectId,
            name: data.subjectName,
            tasks: [
              {
                id,
                done,
                name: target.taskName.value
              }
            ]
          }
        ]

        setTasksWithSubject(tasksListsUpdated);

      }

      onClose()
    } catch (error) {
      toast({
        title: "Oops",
        description: "Erro no servidor",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    }

  }, [setTasksWithSubject, subjectId, tasksWithSubjects, inputErrors, toast, id, token, done, onClose, subjectName]);

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
          onClose={() => {
            onClose()
            setTaskNameValue(name)
            setSubjectNameValue(subjectName);
            setInputErrors({} as InputErrors);
          }}
          title="Editar tarefa:"
        >
          <Box
            as="form"
            onSubmit={handleEditTask}
          >
            <VStack spacing="3">
              <Input
                inputName="taskName"
                label="Nome:"
                type="text"
                error={inputErrors.taskName}
                value={taskNameValue}
                onChange={(e) => setTaskNameValue(e.target.value)}
              />
              <Input
                inputName="subjectName"
                label="Assunto:"
                type="text"
                error={inputErrors.subjectName}
                value={subjectNameValue}
                onChange={(e) => setSubjectNameValue(e.target.value)}
              />
            </VStack>
            <Button type="submit">Salvar</Button>
          </Box>
        </BaseModal>

        <Flex
          as="button"
          ml="4"
          onClick={() => handleDeleteTask(id)}
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