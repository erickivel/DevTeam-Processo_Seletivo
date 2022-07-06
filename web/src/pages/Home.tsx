import { useCallback, useEffect, useState } from "react";
import { Box, Flex, Text, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/Header";
import { Subject } from "../components/Tasks/Subject";
import { BaseModal } from "../components/BaseModal";
import { Input } from "../components/Form/Input";
import { Button } from "../components/Form/Button";

export interface TaskData {
  id: string;
  name: string;
  done: boolean;
}
export interface SubjectData {
  id: string;
  name: string;
  tasks: TaskData[];
}

export interface CreateTaskFormData {
  name: string;
  subjectName: string;
}

export const createTaskFormSchema = yup.object().shape({
  name: yup.string().required("Nome da tarefa é obrigatório"),
  subjectName: yup.string().required("Nome do assunto é obrigatório"),
});

const Home: React.FC = () => {
  const toast = useToast();
  const { isOpen: isOpenCreateTaskModal, onOpen: openCreateTaskModal, onClose: closeCreateTaskModal } = useDisclosure();

  const [selectedSubject, setSelectedSubject] = useState("");

  const { register, handleSubmit, formState, reset } = useForm<CreateTaskFormData>({
    resolver: yupResolver(createTaskFormSchema),
  })

  const { errors } = formState;

  const { token, getTasks, tasksWithSubjects, setTasksWithSubject } = useAuth();


  useEffect(() => {
    getTasks();
  }, [getTasks]);


  const handleCreateTask: SubmitHandler<CreateTaskFormData> = useCallback(async (values) => {
    try {
      values.subjectName = selectedSubject ? selectedSubject : values.subjectName;
      setSelectedSubject("");

      const { data } = await api.post("/tasks", values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const subjectExists = tasksWithSubjects.find(s => s.name === values.subjectName);

      if (subjectExists) {
        console.log("exists")
        setTasksWithSubject(tasksWithSubjects.map(subject => {
          if (subject.name === values.subjectName) {
            return {
              ...subject,
              tasks: [
                ...subject.tasks,
                {
                  id: data.id,
                  done: data.done,
                  name: data.name
                }
              ]
            }
          }

          return subject
        }))

      } else {
        const tasksUpdated = [
          ...tasksWithSubjects,
          {
            id: data.subjectId,
            name: data.subjectName,
            tasks: [{
              id: data.id,
              name: data.name,
              done: data.done,
            }]
          }
        ];

        setTasksWithSubject(tasksUpdated)
      }

      closeCreateTaskModal();
      reset();
    } catch (error) {
      toast({
        title: "Oops",
        description: "Erro no servidor",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    }
  }, [tasksWithSubjects, setTasksWithSubject, toast, token, closeCreateTaskModal, reset, selectedSubject])

  return (
    <>
      <Header openCreateTaskModal={openCreateTaskModal} />

      <BaseModal
        isOpen={isOpenCreateTaskModal}
        onClose={() => {
          closeCreateTaskModal()
          setSelectedSubject("")
          reset()
        }}
        title="Nova tarefa:"
      >
        <Box
          as="form"
          onSubmit={handleSubmit(handleCreateTask)}
        >
          <VStack spacing="3">
            <Input
              inputName="name"
              label="Nome:"
              type="text"
              {...register("name")}
              error={errors.name}
            />
            {selectedSubject ? (
              <Input
                inputName="subjectName"
                label="Assunto:"
                type="text"
                {...register("subjectName")}
                value={selectedSubject}
                borderColor="gray.400"
                focusBorderColor="gray.400"
                color="gray.400"
                _hover={{
                  borderColor: "gray.400"
                }}
                pointerEvents="none"
              />
            ) : (
              <Input
                inputName="subjectName"
                label="Assunto:"
                type="text"
                {...register("subjectName")}
                error={errors.subjectName}
              />
            )}
          </VStack>
          <Button type="submit">Criar</Button>
        </Box>
      </BaseModal>



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
          {
            tasksWithSubjects.map(subject => {
              if (subject.tasks.length !== 0) {
                return (
                  <Subject
                    id={subject.id}
                    setSelectedSubject={setSelectedSubject}
                    openCreateTaskWithSubjectModal={openCreateTaskModal}
                    name={subject.name}
                    key={subject.id}
                    tasks={subject.tasks}
                  />
                )
              }
            })
          }
        </VStack>

      </Flex>
    </>
  );
}

export default Home;