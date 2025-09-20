import { atom } from 'jotai';

type ModalType = 'form' | 'more_modals';
export const openModalTypeAtom = atom<ModalType | null>(null);
