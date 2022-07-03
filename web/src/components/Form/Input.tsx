import { FormControl, FormErrorMessage, FormLabel, Input as ChakraInput, InputProps as ChakraInputProps } from "@chakra-ui/react";

interface InputProps extends ChakraInputProps {
  name: string;
  type: string;
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ name, type, label, error }) => {
  return (
    <FormControl isInvalid={!!error}>

      <FormLabel htmlFor={name} fontFamily="Roboto" fontSize="lg" fontWeight="regular">
        {label}
      </FormLabel>

      <ChakraInput
        name={name}
        id={name}
        type={type}
        borderRadius={8}
        borderColor="gray.400"
        _hover={{
          borderColor: "orange.500"
        }}
        focusBorderColor="orange.500"
        size="lg"
        autoComplete="disabled"
      />

      {!!error && (
        <FormErrorMessage>
          {error}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};