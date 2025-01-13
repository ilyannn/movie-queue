import { HStack, Icon, Stack } from "@chakra-ui/react";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { IconType } from "react-icons";
import React from "react";

interface ExpandingInfoProps {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
}

export const ExpandingInfo = ({
  icon,
  title,
  children,
  defaultExpanded = false,
}: ExpandingInfoProps) => {
  const defaultValue = defaultExpanded ? ["info"] : undefined;

  return (
    <Stack width="full">
      <AccordionRoot collapsible defaultValue={defaultValue}>
        <AccordionItem value="info">
          <AccordionItemTrigger>
            <HStack gap="4" flex="1" textAlign="start" width="full">
              <Icon fontSize="lg" color="fg.subtle">
                {icon}
              </Icon>
              {title}
            </HStack>
          </AccordionItemTrigger>
          <AccordionItemContent>{children}</AccordionItemContent>
        </AccordionItem>
      </AccordionRoot>
    </Stack>
  );
};
