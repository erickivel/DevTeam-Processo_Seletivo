import { Flex, Text, useToast, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";

import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/Header";
import { Subject } from "../components/Tasks/Subject";
import { SubmitHandler } from "react-hook-form";

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
  name: yup.string().required("Nome da tarefa obrigatório"),
  subjectName: yup.string().required("Nome do assunto obrigatório"),
});

const Home: React.FC = () => {
  const toast = useToast();

  const { token } = useAuth();

  const [tasksWithSubjects, setTasksWithSubjects] = useState<SubjectData[]>([]);

  useEffect(() => {
    api.get("/tasks", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      setTasksWithSubjects(response.data)
    }).catch(() => {
      toast({
        title: "Oops!",
        description: "Erro no servidor",
        duration: 6000,
        status: "error",
        isClosable: true,
      });
    })
  }, [token, toast]);


  const handleCreateTask: SubmitHandler<CreateTaskFormData> = useCallback(async (values) => {
    try {
      const { data } = await api.post("/tasks", values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const subjectExists = tasksWithSubjects.find(s => s.name === values.subjectName);
      console.log(subjectExists)
      if (subjectExists) {
        console.log("exists")
        setTasksWithSubjects(tasksWithSubjects.map(subject => {
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


        setTasksWithSubjects(tasksUpdated)
      }
    } catch (error) {

    }
  }, [token])

  return (
    <>
      <Header handleCreateTask={handleCreateTask} />

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
            tasksWithSubjects.map(subject => (
              <Subject name={subject.name} key={subject.id} tasks={subject.tasks} />
            ))
          }
        </VStack>

      </Flex>
    </>
  );
}

export default Home;