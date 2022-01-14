<template>
    <app-header />
    <main class="bg-gray-50 pt-32 pb-5 px-5">
        <ul class="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <li v-for="product in products" :key="product.id"
                class="flex flex-col rounded bg-white shadow">
                <img :src="product.imageURL" 
                     :alt="product.name"
                     class="h-36 p-1 object-contain object-center">
                <div class="p-3">
                    <h3 class="text-xl">{{ product.name }}</h3>
                    <div class="flex justify-between items-end pt-3 pb-2">
                        <p class="text-lg">${{ product.price }}</p>
                        <button class="outline-none bg-teal-500 px-3 py-1 font-bold text-white rounded"
                                @click="addShoppingCartItem(product)">加入購物車</button>
                    </div>
                </div>
            </li>
        </ul>
    </main>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue';
import { getDocs } from 'firebase/firestore';

import { useShoppingCartStore } from '@/stores/cart';
import { db } from '@/modules/db';
import { Product } from '@/types';

export default defineComponent({
    setup() {
        const shoppingCartStore = useShoppingCartStore();

        const products = ref() as Ref<Product[]>;

        onMounted(async () => {
            const productSnapshot = await getDocs(db.product);
            const productDocs = productSnapshot.docs;
            products.value = productDocs.map((productDoc) => ({
                id: productDoc.id,
                ...productDoc.data(),
            }));
        });

        const addShoppingCartItem = (product: Product) => {
            shoppingCartStore.addItem(<string>product.id);
        }

        return {
            products,
            addShoppingCartItem,
        }
    },
})
</script>
