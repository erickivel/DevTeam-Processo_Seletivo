import { Flex, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import { Button } from "../components/Form/Button";
import { Input } from "../components/Form/Input";
import { Header } from "../components/Header";

const SignUp: React.FC = () => {
  return (
    <>
      <Header />

      <Flex w="100%" maxW={1480} mx="auto">
        <Link to="/signIn">
          <Flex
            align="center"
            mt="6"
            _hover={{
              filter: "brightness(70%)"
            }}
            transition="filter 0.3s"
          >
            <FiArrowLeft size={20} color="#4a5568" />
            <Text ml="3" fontSize="lg">Voltar para login</Text>
          </Flex>
        </Link>
      </Flex>
      <Flex
        flexDirection="column"
        maxWidth={490}
        borderRadius={16}
        boxShadow="lg"
        bg="gray.50"
        mt={94}
        mx="auto"
        p="16"
        pt="14"
      >
        <Text
          mb="8"
          alignSelf="flex-start"
          fontFamily="Roboto"
          color="orange.500"
          fontSize="4xl"
          fontWeight="medium">
          Faça seu cadastro:
        </Text>

        <VStack>
          <Input label="Nome:" name="name" type="text" />
          <Input label="Senha:" name="password" type="password" />
          <Input label="Confirmar senha:" name="confirmPassword" type="password" />
        </VStack>

        <Button>Cadastrar</Button>
      </Flex>
    </>
  );
}

export default SignUp;