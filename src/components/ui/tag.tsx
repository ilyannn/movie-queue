import { Tag as ChakraTag } from "@chakra-ui/react";
import React from "react";

export interface TagProps extends ChakraTag.RootProps {
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  onClose?: VoidFunction;
  closable?: boolean;
}

const Tag: React.FC<TagProps> = ({
  startElement,
  endElement,
  onClose,
  children,
  ...rest
}) => {
  const closable = !!onClose;

  return (
    <ChakraTag.Root {...rest}>
      {startElement && (
        <ChakraTag.StartElement>{startElement}</ChakraTag.StartElement>
      )}
      <ChakraTag.Label>{children}</ChakraTag.Label>
      {endElement && <ChakraTag.EndElement>{endElement}</ChakraTag.EndElement>}
      {closable && (
        <ChakraTag.EndElement>
          <ChakraTag.CloseTrigger onClick={onClose} />
        </ChakraTag.EndElement>
      )}
    </ChakraTag.Root>
  );
};

export default Tag;
