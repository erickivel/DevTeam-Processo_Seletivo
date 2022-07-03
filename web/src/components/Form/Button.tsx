import { Button as ChakraButton, ButtonProps as ChakraButtonProps, Text } from "@chakra-ui/react";

export const Button: React.FC<ChakraButtonProps> = ({ children, ...rest }) => {
  return (
    <ChakraButton
      bg="orange.500"
      width="100%"
      size="lg"
      mt="8"
      transition="filter 0.3s"
      _hover={{
        filter: "brightness(80%)"
      }}
      {...rest}
    >
      <Text color="gray.50" fontSize="lg" fontFamily="Roboto" fontWeight="light">{children}</Text>
    </ChakraButton>
  );
};