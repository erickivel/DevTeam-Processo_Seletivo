import { useCallback } from "react";

import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { FiPlus, FiPower } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import LogoImg from "../assets/logo.svg";
import { useAuth } from "../contexts/AuthContext";


interface HeaderProps {
  openCreateTaskModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ openCreateTaskModal }) => {
  const navigate = useNavigate();

  const { isAuthenticated, logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return (
    <Box
      as="header"
      w="100%"
      h="20"
      bg="blue.500"
    >
      <Flex
        as="header"
        w="100%"
        maxWidth={1480}
        h="20"
        mx="auto"
        bg="blue.500"
        align="center"
        justifyContent="space-between"
      >
        <Image src={LogoImg} alt="Logo ImpacTo-do" />

        {isAuthenticated && (
          <Flex>
            <Flex
              as="button"
              onClick={openCreateTaskModal}
              py="2"
              px="3"
              borderRadius={8}
              align="center"
              justifyContent="center"
              bg="orange.500"
              _hover={{
                bg: "orange.600"
              }}
              transition="background-color 0.3s"
            >
              <FiPlus color="#F7FAFC" size={26} />
              <Text ml="3" color="gray.50" fontSize="xl">Criar Tarefa</Text>
            </Flex>
            <Flex
              as="button"
              onClick={() => handleLogout()}
              ml="10"
              p="2"
              borderRadius="8"
              align="center"
              justify="center"
              bg="blue.500"

              _hover={{
                filter: "brightness(115%)"
              }}
              transition="all 0.3s"
            >
              <FiPower color="#EB7D3D" size={24} strokeWidth={3} />
              <Text ml="2" color="gray.50" fontSize="xl">Sair</Text>
            </Flex>


          </Flex>
        )}
      </Flex>
    </Box >
  );
};
