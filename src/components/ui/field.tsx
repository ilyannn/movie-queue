import { Field as ChakraField } from "@chakra-ui/react";
import React from "react";

export interface FieldProps extends Omit<ChakraField.RootProps, "label"> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  optionalText?: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({
  label,
  children,
  helperText,
  errorText,
  optionalText,
  ...rest
}) => (
  <ChakraField.Root {...rest}>
    {label && (
      <ChakraField.Label>
        {label}
        <ChakraField.RequiredIndicator fallback={optionalText} />
      </ChakraField.Label>
    )}
    {children}
    {helperText && (
      <ChakraField.HelperText>{helperText}</ChakraField.HelperText>
    )}
    {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
  </ChakraField.Root>
);

export default Field;
