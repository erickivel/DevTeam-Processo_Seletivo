import { Flex, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/Header";
import { Subject } from "../components/Tasks/Subject";

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

const Home: React.FC = () => {
  const { token } = useAuth();

  const [tasksWithSubjects, setTasksWithSubjects] = useState<SubjectData[]>([]);

  useEffect(() => {
    api.get("/tasks", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      setTasksWithSubjects(response.data)
    })
  }, [token]);

  console.log(tasksWithSubjects);

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