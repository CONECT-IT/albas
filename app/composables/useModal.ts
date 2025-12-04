import { ref, type Ref } from "vue";

type ModalType = string;

export function useModal<T = any>() {
  const activeModal: Ref<ModalType | null> = ref(null);
  const selectedItem: Ref<T | null> = ref(null);

  const openModal = (type: ModalType, item?: T) => {
    selectedItem.value = item ?? null;
    activeModal.value = type;
  };

  const closeModal = () => {
    activeModal.value = null;
    selectedItem.value = null;
  };

  const isOpen = (type: ModalType) => activeModal.value === type;

  return {
    activeModal,
    selectedItem,
    openModal,
    closeModal,
    isOpen,
  };
}
