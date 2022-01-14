import { QueryDocumentSnapshot, WithFieldValue } from '@firebase/firestore/dist/lite';
import { collection } from 'firebase/firestore';

import { firestore } from '@/modules/firebase';

import { User, Product, Transaction } from '@/types';

const converter = <T>() => ({
    toFirestore: (data: WithFieldValue<T>) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

const dataPoint = <T>(collectionPath: string) => {
    return collection(firestore, collectionPath).withConverter(converter<T>());
}

const db = {
    user: dataPoint<User>('user'),
    product: dataPoint<Product>('product'),
    transaction: dataPoint<Transaction>('transaction'),
};

export { db };
export default db;
