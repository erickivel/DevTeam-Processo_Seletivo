import { ReactNode } from "react";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";

interface BaseModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const BaseModal: React.FC<BaseModalProps> = ({ title, isOpen, onClose, children }) => {

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="100%" maxWidth={490} px="16" py="14">
          <ModalHeader p="0">
            <Text
              mb="8"
              alignSelf="flex-start"
              fontFamily="Roboto"
              color="orange.500"
              fontSize="4xl"
              fontWeight="medium"
            >
              {title}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody mt="-1" p="0">
            {children}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>


  );
}