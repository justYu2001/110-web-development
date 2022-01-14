import { defineStore } from 'pinia';
import { CartItem, Product, User } from '@/types';
import { doc, query, where, getDoc, getDocs, updateDoc, DocumentReference } from 'firebase/firestore';
import { db } from '@/modules/db';

export const useShoppingCartStore = defineStore('shoppingCart', {
    state: () => ({
        userDocRef: {} as DocumentReference<User>,
        cart: [] as CartItem[],
    }),

    getters: {
        totalPrice() {
            let totalPrice = 0;
            for(const cartItem of this.cart) {
                totalPrice += cartItem.price * cartItem.number;
            }

            return totalPrice;
        },

        totalItemNumber() {
            let totalItemNumber = 0;
            for(const cartItem of this.cart) {
                totalItemNumber += cartItem.number;
            }

            return totalItemNumber;
        }
    },

    actions: {
        async setCart(userId: string) {
            const queryByUserId = query(db.user, where('id', '==', userId));
            const userSnapshot = await getDocs(queryByUserId);
            const userDoc = userSnapshot.docs[0];
            this.userDocRef = userDoc.ref;
            const user = userDoc.data();
            this.cart = user.cart;
        },

        async addItem(productId: string) {
            const productDocRef = doc(db.product, productId);
            const productSnapshot = await getDoc(productDocRef);
            
            const product = productSnapshot.data() as Product;
            const productInCart = this.cart.find((cartItem) => cartItem.id === productId);
            if(productInCart) {
                productInCart.number++;
            } else {
                const newCartItem: CartItem = {
                    ...product,
                    id: productId,
                    number: 1,
                };
                this.cart.push(newCartItem);
            }

            updateDoc(this.userDocRef, {
                cart: this.cart,
            });
        },

        async updateNumberOfItem(productId: string, newNumber: number) {
            const productIndex = this.cart.findIndex((cartItem) => cartItem.id === productId);
            
            if(newNumber === 0) {
                this.cart.splice(productIndex, 1);
            } else {
                this.cart[productIndex].number = newNumber;
            }

            updateDoc(this.userDocRef, {
                cart: this.cart,
            });
        },

        async clearCart() {
            this.cart = [];

            await updateDoc(this.userDocRef, {
                cart: this.cart,
            });
        }
    }
});