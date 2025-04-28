import {ref} from 'vue';

export function useConfirmModal() {
    const isShowModal = ref(false);
    const modalText = ref('');
    let resolvePromise: (value: boolean) => void;


    const ask = (text: string): Promise<boolean> => {
        modalText.value = text;
        isShowModal.value = true;
        return new Promise((resolve) => {
            resolvePromise = resolve;
        });
    };

    const confirm = () => {
        isShowModal.value = false;
        resolvePromise(true);
    };

    const cancel = () => {
        isShowModal.value = false;
        resolvePromise(false);
    };

    return {
        isShowModal,
        modalText,
        ask,
        confirm,
        cancel
    };
}