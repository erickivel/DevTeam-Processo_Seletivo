import { Flex, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { Button } from "../components/Form/Button";
import { Input } from "../components/Form/Input";
import { Header } from "../components/Header";

const SignIn: React.FC = () => {
  return (
    <>
      <Header />
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
        <Text mb="8" alignSelf="flex-start" fontFamily="Roboto" color="orange.500" fontSize="4xl" fontWeight="medium">Faça seu login:</Text>

        <VStack>
          <Input label="Nome:" name="name" type="text" />
          <Input label="Senha:" name="password" type="password" />
        </VStack>

        <Button>Entrar</Button>

        <Text display="flex" justifyContent="center" mt="4">
          Não tem uma conta?

          <Text
            ml="1"
            color="orange.500"
            _hover={{
              color: "orange.600"
            }}
            transition="color 0.3s"
          >
            <Link to="/signUp">
              Registre-se
            </Link>
          </Text>
        </Text>
      </Flex>
    </>
  );
}

export default SignIn;