import { ref } from 'firebase/storage';

import { storage } from '@/modules/firebase';

export const getProductImageRef = (fileName: string) => {
    return ref(storage, `product/${fileName}`);
};