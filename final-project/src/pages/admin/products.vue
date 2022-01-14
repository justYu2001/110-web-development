<template>
    <ProductModal ref="productModal" />
    <div class="h-screen bg-gray-50 flex">
        <SideNavBar ref="sideNavBar" />
        <div class="flex-grow p-5">
            <div class="bg-white rounded shadow p-5">
                <div class="flex justify-end">
                    <button class="px-5 py-2 bg-teal-500 rounded text-white font-bold"
                            @click="openAddProductModal">Add product</button>
                </div>
                <table class="table-fixed min-w-full mt-3">
                    <thead class="border-b-2 table w-full table-fixed">
                        <tr>
                            <th scope="col" class="p-2 text-left">Name</th>
                            <th scope="col" class="p-2 text-left">Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody class="block h-[40rem] p-1 overflow-scroll">
                        <tr v-for="product in products" :key="product.id"
                            class="table table-fixed w-full">
                            <td class="py-3 px-2">{{ product.name }}</td>
                            <td class="py-3 px-2">${{ product.price }}</td>
                            <td class="py-3 pr-8 flex justify-end">
                                <button class="px-5 py-2 mx-2 bg-teal-500 rounded text-white font-bold"
                                        @click="openEditProductModal(product)">Edit product</button>
                                <button class="px-5 py-2 mx-2 bg-red-500 rounded text-white font-bold"
                                        @click="deleteProduct(product)">Delete product</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue';
import { onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { deleteObject } from 'firebase/storage';

import { ProductModalAPI } from '@/components/ProductModal.vue';
import { firestore } from '@/modules/firebase';
import { getProductImageRef } from '@/modules/storage'; 
import { db } from '@/modules/db';
import { Product, ProductModalTypes } from '@/types';

export default defineComponent({
    setup() {
        const sideNavBar = ref();

        onMounted(() => {
            sideNavBar.value.changeCurrentTab("Products");
        });

        const productModal = ref() as Ref<ProductModalAPI>;

        const openAddProductModal = () => {
            productModal.value.openModal(ProductModalTypes.Add);
        };

        const openEditProductModal = (product: Product) => {
            productModal.value.openModal(ProductModalTypes.Edit, product);
        };

        const products = ref([]) as Ref<Product[]>;

        onSnapshot(db.product, (snapshot) => {
            const productDocs = snapshot.docs;
            products.value = productDocs.map((productDoc) => {
                return {
                    id: productDoc.id,
                    ...productDoc.data(),
                } as Product;
            });
        });

        const deleteProduct = (product: Product) => {
            const dbName = db.product.path;
            const productDocRef = doc(firestore, dbName, <string>product.id);
            deleteDoc(productDocRef);

            const productImageRef = getProductImageRef(product.imageFileName);
            deleteObject(productImageRef);
        }

        return {
            sideNavBar,
            productModal,
            openAddProductModal,
            openEditProductModal,
            products,
            deleteProduct,
        };
    },
})
</script>
