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
        <div class="relative z-10 bg-white pt-8 px-20 w-4/5 rounded transition-all duration-300"
            :class="{
                ['scale-0']: !isActiveModal,
                ['scale-100']: isActiveModal
            }">
            <h3 class="text-3xl font-bold mb-3">Image</h3>
            <label class="block mx-auto my-3 w-4/5 p-2 rounded cursor-pointer"
                   :class="{
                       ['bg-white']: hasThumbnail,
                       ['bg-gray-200']: hasThumbnail === false,
                   }">
                <div v-if="hasThumbnail"
                     class="flex justify-center py-3.5">
                    <img ref="thumbnail" class="h-72 w-72 object-cover object-center rounded shadow">
                </div>
                <div v-else
                     class="border-2 border-dashed border-gray-400 rounded px-3 py-36"
                     @drop.prevent="setImageFile"
                     @dragenter.prevent
                     @dragover.prevent>
                    <p class="text-gray-500 text-center">Darg and drop image here or click to upload</p>
                </div>
                <input ref="fileInput" 
                       type="file" 
                       accept=".png,.jpg,.jpeg" 
                       class="hidden"
                       @change="setThumbnail">
            </label>
            <div class="flex justify-between pt-2">
                <div class="w-2/5">
                    <h3 class="text-3xl font-bold mb-2">Name</h3>
                    <input type="text" 
                           class="w-full border-2 border-gray-300 rounded outline-none p-1 text-lg focus:border-teal-500"
                           v-model="name">
                </div>
                <div class="w-2/5">
                    <h3 class="text-3xl font-bold mb-2">Price</h3>
                    <input type="text" 
                           class="w-full border-2 border-gray-300 rounded outline-none p-1 text-lg focus:border-teal-500"
                           v-model.number="price">
                </div>
            </div>
            <div class="flex justify-end py-5">
                <button class="bg-teal-500 text-white text-lg font-bold py-1 px-3 rounded disabled:bg-teal-500/70"
                        @click="buttonClickHandler[modalType]">{{ buttonText }}</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref, nextTick } from 'vue';
import { uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, addDoc, updateDoc } from 'firebase/firestore';

import { db } from '@/modules/db';
import { firestore } from '@/modules/firebase';
import { getProductImageRef } from '@/modules/storage';
import { Product, ProductModalTypes } from '@/types';

export interface ProductModalAPI {
    openModal: (type: ProductModalTypes, product?: Product) => void;
}

interface ProductModalButtonClickHandler {
    [ProductModalTypes.Add]: (event: MouseEvent) => Promise<void>;
    [ProductModalTypes.Edit]: (event: MouseEvent) => Promise<void>;
}

export default defineComponent({
    name: 'ProductModal',
    setup(props, { expose }) {
        const fileInput = ref() as Ref<HTMLInputElement>;

        const hasThumbnail = ref(false);

        const thumbnail = ref() as Ref<HTMLImageElement>;
        
        const updateThumbnail = (imageFile: File) => {
            if(imageFile.type.startsWith('image/')) {
                hasThumbnail.value = true;

                const reader = new FileReader();
                reader.readAsDataURL(imageFile);

                reader.onload = () => thumbnail.value.src = <string>reader.result; 
            } else {
                hasThumbnail.value = false;
            }
        };

        const setImageFile = (event: DragEvent) => {
            const fileList = event.dataTransfer?.files;

            if(fileList && fileList.length > 0) {
                fileInput.value.files = fileList;            

                const imageFile = fileList[0];
                updateThumbnail(imageFile);
            }
        };

        const setThumbnail = (event: Event) => {
            const inputElement = event.currentTarget as HTMLInputElement;
            const fileList = inputElement.files;

            if(fileList && fileList.length > 0) {
                updateThumbnail(fileList[0]);
            }
        };

        const name = ref('');
        const price = ref() as Ref<number | undefined>;

        const addProduct = async (event: MouseEvent) => {
            const button = event.currentTarget as HTMLButtonElement;
            button.disabled = true;

            const fileList = fileInput.value.files;
            const hasProductImage = fileList && fileList.length > 0;

            if(hasProductImage && name.value && price.value) {
                const currentTimestamp = Date.now();
                const imageFileName = `${name.value}${currentTimestamp}`;
                const productImageRef = getProductImageRef(imageFileName);
                
                const fileImage = fileList[0];
                await uploadBytes(productImageRef, fileImage);
                const productImageURL = await getDownloadURL(productImageRef);

                const newProduct = {
                    name: name.value,
                    price: price.value,
                    imageFileName,
                    imageURL: productImageURL,
                } as Product;

                await addDoc(db.product, newProduct);
                closeModal();
            }

            button.disabled = false;
        };

        const editProductData = async (event: MouseEvent) => {
            const button = event.currentTarget as HTMLButtonElement;
            button.disabled = true;

            const productId = productData.value.id as string;
            if(name.value && price.value) {
                const dbName = db.product.path;
                const productDocRef = doc(firestore, dbName, productId);

                await updateDoc(productDocRef, {
                    name: name.value,
                    price: price.value,
                });

                closeModal();
                button.disabled = false;
            }
        };

        const buttonClickHandler = ref({
            [ProductModalTypes.Add]: addProduct,
            [ProductModalTypes.Edit]: editProductData,
        }) as Ref<ProductModalButtonClickHandler>;

        const buttonText = computed(() => {
            return modalType.value === ProductModalTypes.Add ? "Add" : "Save";
        });

        const isActiveModal = ref(false);

        const modalType = ref() as Ref<ProductModalTypes>;
        const productData = ref() as Ref<Product>;

        const setProductData = (product: Product) => {
            productData.value = product;
            name.value = product.name;
            price.value = product.price;
            hasThumbnail.value = true;
            nextTick(() => {
                thumbnail.value.src = product.imageURL;
            });
        };

        const openModal = (type: ProductModalTypes, product?: Product) => {
            modalType.value = type;

            if(type === ProductModalTypes.Edit) {
                if(!product) {
                    const errorMessage = 'Product Information is required when type is edit.';
                    console.error(errorMessage);
                    return;
                }
                
                setProductData(product);
            }

            isActiveModal.value = true;
        };

        expose({
            openModal,
        } as ProductModalAPI);

        const closeModal = () => {
            const fileList = fileInput.value.files;
            if(fileList) {
                fileInput.value.value = '';
            }

            name.value = '';
            price.value = undefined;

            hasThumbnail.value = false;
            isActiveModal.value = false;
        };

        return {
            isActiveModal,
            openModal,
            closeModal,
            fileInput,
            setImageFile,
            setThumbnail,
            hasThumbnail,
            thumbnail,
            name,
            price,
            modalType,
            buttonClickHandler,
            buttonText,
        }
    },
});
</script>
