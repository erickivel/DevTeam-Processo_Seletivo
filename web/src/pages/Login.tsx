import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";

import { Button } from "../components/Form/Button";
import { Input } from "../components/Form/Input";
import { Header } from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

interface LoginUserFormData {
  name: string;
  password: string;
}

const loginUserFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  password: yup.string().required("Senha obrigatória").min(6, "No mínimo 6 caracteres")
});

const Login: React.FC = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, formState } = useForm<LoginUserFormData>({
    resolver: yupResolver(loginUserFormSchema)
  })

  const { login } = useAuth();

  const { errors } = formState;

  const handleLoginUser: SubmitHandler<LoginUserFormData> = useCallback(async (values) => {
    await login(values);

    navigate("/");
  }, [login, navigate])

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
        <Text
          mb="8"
          alignSelf="flex-start"
          fontFamily="Roboto"
          color="orange.500"
          fontSize="4xl"
          fontWeight="medium"
        >
          Faça seu login:
        </Text>

        <Box
          as="form"
          onSubmit={handleSubmit(handleLoginUser)}
        >

          <VStack>
            <Input
              label="Nome:"
              inputName="name"
              type="text"
              error={errors.name}
              {...register('name')}
            />
            <Input
              label="Senha:"
              inputName="password"
              type="password"
              error={errors.password}
              {...register('password')}
            />
          </VStack>

          <Button type="submit" >Entrar</Button>
        </Box>

        <Flex justifyContent="center" mt="4">
          <Text>Não tem uma conta?</Text>

          <Text
            ml="1"
            color="orange.500"
            _hover={{
              color: "orange.600"
            }}
            transition="color 0.3s"
          >
            <Link to="/register">
              Cadastre-se
            </Link>
          </Text>
        </Flex>
      </Flex>
    </>
  );
}

export default Login;