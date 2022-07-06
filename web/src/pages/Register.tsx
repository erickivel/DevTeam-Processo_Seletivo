import { Box, Flex, Text, useToast, VStack } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Button } from "../components/Form/Button";
import { Input } from "../components/Form/Input";
import { Header } from "../components/Header";
import { api } from "../services/api";

interface CreateUserFormData {
  name: string;
  password: string;
  passwordConfirmation: string;
}

const createUserFormSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório"),
  password: yup.string().required("Senha obrigatória").min(6, "No mínimo 6 caracteres"),
  passwordConfirmation: yup.string().oneOf([
    null, yup.ref('password')
  ], 'As senhas precisam ser iguais')
});

const Register: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm<CreateUserFormData>({
    resolver: yupResolver(createUserFormSchema)
  })

  const { errors } = formState;

  const handleCreateUser: SubmitHandler<CreateUserFormData> = async (values) => {
    try {
      await api.post("/users", values);

      toast({
        title: "Usuário criado com sucesso!",
        description: "Você já pode fazer login",
        status: "success",
        duration: 7000,
        isClosable: true
      });

      navigate("/login");
    } catch (error: any) {
      if (error.response.data === 'This user name is already taken') {
        toast({
          title: "Este nome de usuário já esta em uso",
          description: "Tente outro nome",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Oops",
          description: "Erro no servidor",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }

  return (
    <>
      <Header />

      <Flex w="100%" maxW={1480} mx="auto">
        <Link to="/login">
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

        <Box
          as="form"
          onSubmit={handleSubmit(handleCreateUser)}
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
            <Input
              label="Confirmar senha:"
              inputName="passwordConfirmation"
              type="password"
              error={errors.passwordConfirmation}
              {...register('passwordConfirmation')}
            />
          </VStack>

          <Button type="submit" >Cadastrar</Button>

        </Box>
      </Flex>
    </>
  );
}

export default Register;