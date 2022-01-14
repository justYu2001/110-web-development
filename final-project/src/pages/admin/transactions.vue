<template>
    <TransactionModal ref="transactionModal" />
    <div class="h-screen bg-gray-50 flex">
        <SideNavBar ref="sideNavBar" />
        <div class="flex-grow p-5">
            <div class="bg-white rounded shadow p-5">
                <table class="table-fixed min-w-full mt-3">
                    <thead class="border-b-2 table table-fixed w-full">
                        <tr>
                            <th scope="col" class="p-2 text-left">Transaction ID</th>
                            <th scope="col" class="p-2 text-left">User</th>
                            <th scope="col" class="p-2 text-left">Date</th>
                            <th scope="col" class="p-2 text-left">Amount</th>
                        </tr>
                    </thead>
                    <tbody class="block h-[42rem] p-1 overflow-scroll">
                        <tr v-for="transaction in transactions" :key="transaction.id"
                            class="table table-fixed w-full cursor-pointer hover:bg-gray-100"
                            @click="openTransactionModal(transaction)">
                            <td class="py-3 px-2">{{ transaction.id }}</td>
                            <td class="py-3 px-2">{{ transaction.user }}</td>
                            <td class="py-3 px-2">{{ transaction.date.toDate().toLocaleDateString() }}</td>
                            <td class="py-3 px-2">${{ transaction.amount }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue';
import { useRouter } from 'vue-router'
import { getDocs, query, orderBy } from 'firebase/firestore';
import { useUserStore } from '@/stores/user'

import { db } from '@/modules/db';
import { Transaction, Roles } from '@/types';
import { TransactionModalAPI } from '@/components/TransactionModal.vue';

export default defineComponent({
    setup() {
        const sideNavBar = ref();

        onMounted(() => {
            sideNavBar.value.changeCurrentTab("Transactions");
        });

        const transactions = ref([]) as Ref<Transaction[]>;

        onMounted(async () => {
            const orderByQuery = query(db.transaction, orderBy('date', 'desc'));
            const transactionSnapshot = await getDocs(orderByQuery);
            const transactionDocs = transactionSnapshot.docs;
            transactions.value = transactionDocs.map((transactionDoc) => ({
                id: transactionDoc.id,
                ...transactionDoc.data(),
            }));
        });

        const transactionModal = ref() as Ref<TransactionModalAPI>;

        const openTransactionModal = (transaction: Transaction) => {
            transactionModal.value.openModal(transaction);
        }

        return {
            sideNavBar,
            transactions,
            transactionModal,
            openTransactionModal,
        };
    },
})
</script>
