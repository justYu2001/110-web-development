<template>
    <div class="fixed inset-0 flex justify-center items-center transition-all duration-300 z-10"
         :class="{
             ['opacity-0 pointer-events-none']: !isActiveModal,
             ['opacity-100']: isActiveModal,
         }"
        >
        <div class="absolute inset-0 bg-black/50"
             @click="closeModal">
        </div>
        <div class="relative z-10 bg-white p-8 px-20 w-4/5 rounded transition-all duration-300"
            :class="{
                ['scale-0']: !isActiveModal,
                ['scale-100']: isActiveModal
            }">
            <div v-if="transaction">
                <div class="py-3">
                    <h3 class="text-3xl font-bold">Transaction ID</h3>
                    <p class="text-lg pl-1">{{ transaction.id }}</p>
                </div>
                <div class="py-3">
                    <h3 class="text-3xl font-bold">User</h3>
                    <p class="text-lg pl-1">{{ transaction.user }}</p>
                </div>
                <h3 class="text-3xl font-bold">Detail</h3>
                <ul>
                    <li v-for="item in transaction.products" :key="item.id"
                        class="flex justify-between">
                        <p class="text-lg">{{ item.name }}</p>
                        <p class="text-lg">${{ item.price }} X {{  item.number }}</p>
                    </li>
                </ul>
                <div class="flex justify-between border-t-2 border-gray-300 pt-2 mt-2">
                    <p class="text-lg">{{ transaction.date.toDate().toLocaleDateString() }}</p>
                    <p class="text-lg">Total:{{  transaction.amount }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { Transaction } from '@/types';

export interface TransactionModalAPI {
    openModal: (transactionData: Transaction) => void;
}

export default defineComponent({
    name: 'ProductModal',
    setup(props, { expose }) {
        const transaction = ref() as Ref<Transaction>;

        const isActiveModal = ref(false);

        const openModal = (transactionData: Transaction) => {
            transaction.value = transactionData;
            isActiveModal.value = true;
        };

        expose({
            openModal,
        } as TransactionModalAPI);

        const closeModal = () => {
            isActiveModal.value = false;
        };

        return {
            isActiveModal,
            openModal,
            closeModal,
            transaction,
        }
    },
});
</script>
