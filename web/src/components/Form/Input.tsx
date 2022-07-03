import { FormControl, FormErrorMessage, FormLabel, forwardRef, Input as ChakraInput, InputProps as ChakraInputProps } from "@chakra-ui/react";
import { ForwardRefRenderFunction } from "react";

interface InputProps extends ChakraInputProps {
  inputName: string;
  type: string;
  label: string;
  error?: any;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ inputName, type, label, error = null, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error}>

      <FormLabel htmlFor={inputName} fontFamily="Roboto" fontSize="lg" fontWeight="regular">
        {label}
      </FormLabel>

      <ChakraInput
        id={inputName}
        name={inputName}
        type={type}
        borderRadius={8}
        borderColor="gray.400"
        _hover={{
          borderColor: "orange.500"
        }}
        focusBorderColor="orange.500"
        size="lg"
        autoComplete="disabled"
        ref={ref}
        {...rest}
      />

      {!!error && (
        <FormErrorMessage>
          {error.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);