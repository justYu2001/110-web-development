<template>
    <header class="px-10 py-5 flex fixed top-0 left-0 right-0 shadow-md bg-white">
        <h1 class="text-4xl py-2.5">All Yu Need</h1>
        <nav class="flex justify-end items-center flex-grow pl-3 py-2 text-xl font-medium">
            <div v-if="isGuest">
                <router-link to="/login" class="mx-2 py-2 px-5 border-2 border-teal-500 rounded-full text-teal-500">Log in</router-link>
                <router-link to="/signup" class="mx-2 py-2 px-5 border-2 border-teal-500 bg-teal-500 text-white rounded-full">Sign up</router-link>
            </div>
            <div class="flex items-center" v-else>
                <span class="font-normal px-3">{{ username }}</span>
                <div class="mr-2 relative">
                    <ShoppingCartIcon class="w-12 h-12 p-1.5 cursor-pointer fill-current peer" />
                    <div class="absolute top-0 right-0 w-5 h-5 text-sm flex justify-center items-center text-white bg-red-500 rounded-full"
                         v-show="totalItemNumber > 0">{{ totalItemNumber }}</div>
                    <div class="border-t-4 border-teal-500 min-w-max rounded shadow bg-white absolute top-12 right-0 hidden hover:block peer-hover:block"
                         v-show="totalItemNumber > 0">
                        <ul class="p-3 h-36 overflow-scroll">
                            <li v-for="cartItem in shoppingCartItems"
                             class="flex items-center py-1.5">
                                <p class="text-base w-60">{{ cartItem.name }}</p>
                                <div class="flex items-center">
                                    <button class="bg-teal-500 w-6 h-6 rounded-full text-white text-center leading-6"
                                            @click="decreaseCartItemNumber(cartItem)">-</button>
                                    <input type="text" class="w-14 mx-1 text-center outline-none rounded border-2 border-gray-300" 
                                           :value="cartItem.number"
                                           @change="setCartItemNumber($event, cartItem)">
                                    <button class="bg-teal-500 w-6 h-6 rounded-full text-white text-center leading-6"
                                            @click="increaseCartItemNumber(cartItem)">+</button>
                                </div>
                            </li>
                        </ul>
                        <div class="bg-gray-300 h-0.5 mx-3 mt-1"></div>
                        <div class="p-3 flex justify-between items-center">
                            <p>總計：{{ totalPrice }}</p>
                            <button class="py-1 px-5 text-lg border-teal-500 bg-teal-500 text-white rounded-full"
                                    @click="buy">購買</button>
                        </div>
                    </div>
                </div>
                <button class="mx-2 py-2 px-5 border-2 border-teal-500 bg-teal-500 text-white rounded-full"
                        @click="logOut">Log out</button>
            </div>
        </nav>
    </header>
</template>

<script lang="ts">
import { defineComponent, computed, TableHTMLAttributes } from 'vue';
import { useRouter } from 'vue-router';
import { signOut } from 'firebase/auth';
import { addDoc, Timestamp } from 'firebase/firestore';

import ShoppingCartIcon from '@/assets/icons/shopping_cart.svg?component';
import { useUserStore } from '@/stores/user';
import { useShoppingCartStore } from '@/stores/cart';
import { Roles, CartItem, Transaction } from '@/types';
import { auth } from '@/modules/firebase';
import { db } from '@/modules/db';

export default defineComponent({
    components: {
        ShoppingCartIcon,
    },
    setup() {
        const router = useRouter();

        const userStore = useUserStore();

        const username = computed(() => userStore.name);

        const isGuest = computed(() => userStore.role === Roles.Guest);

        const logOut = async () => {
            try {
                await signOut(auth);
                userStore.logout();
                router.push('/');
            } catch (error) {
                console.error(error);
            }
        }

        const shoppingCartStore = useShoppingCartStore();
        const shoppingCartItems = computed(() => shoppingCartStore.cart);

        const totalPrice = computed(() => shoppingCartStore.totalPrice);

        const totalItemNumber = computed(() => shoppingCartStore.totalItemNumber);

        const setCartItemNumber = (event: Event, cartItem: CartItem) => {
            const input = event.currentTarget as HTMLInputElement;
            const newCartItemNumber = Number.parseInt(input.value);
            shoppingCartStore.updateNumberOfItem(<string>cartItem.id, newCartItemNumber);
        };

        const increaseCartItemNumber = (cartItem: CartItem) => {
            shoppingCartStore.updateNumberOfItem(<string>cartItem.id, cartItem.number + 1);
        };

        const decreaseCartItemNumber = (cartItem: CartItem) => {
            shoppingCartStore.updateNumberOfItem(<string>cartItem.id, cartItem.number - 1);
        };

        const buy = async () => {
            const newTransaction: Transaction = {
                date: Timestamp.fromDate(new Date()),
                products: shoppingCartStore.cart,
                amount: shoppingCartStore.totalPrice,
                user: userStore.name,
            };

            await addDoc(db.transaction, newTransaction);
            await shoppingCartStore.clearCart();
        };

        return {
            isGuest,
            username,
            logOut,
            shoppingCartItems,
            totalPrice,
            totalItemNumber,
            setCartItemNumber,
            increaseCartItemNumber,
            decreaseCartItemNumber,
            buy,
        }
    },
})
</script>
