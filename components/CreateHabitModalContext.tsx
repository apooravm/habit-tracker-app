import { createContext, ReactNode, useContext, useState } from "react";

type ModalContextType = {
    modalVisible: boolean;
    showModal: () => void;
    hideModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modalVisible, setModalVisible] = useState(false);

    const showModal = () => setModalVisible(true);
    const hideModal = () => setModalVisible(false);

    return (
        <ModalContext.Provider value={{ modalVisible, showModal, hideModal }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const ctx = useContext(ModalContext);
    if (!ctx) {
        throw new Error("useModal must be used inside ModalProvider!");
    }

    return ctx;
}
