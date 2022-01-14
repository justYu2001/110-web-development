import { defineStore } from 'pinia';
import { Roles, User } from '@/types';
import { query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/modules/db';
import { useShoppingCartStore } from '@/stores/cart';

export const useUserStore = defineStore('user', {
    state: () => ({
        role: Roles.Guest,
        name: '',
    }),

    actions: {
        setName(newName: string) {
            this.name = newName;
        },

        setRole(newRole: Roles) {
            this.role = newRole;
        },

        async login(userId: string) {
            try {
                const users = db.user;
                const queryByUserId = query(users, where('id', '==', userId));
                const userSnapshot = await getDocs(queryByUserId);

                const userData = userSnapshot.docs[0].data();

                this.role = userData.role;
                this.name = userData.name;

                const shoppingCartStore = useShoppingCartStore();
                await shoppingCartStore.setCart(userId);
            } catch (error) {
                throw error;
            }
        },

        logout() {
            this.$reset();
        },

        async signUp(newUser: User) {
            try {
                const users = db.user;

                await addDoc(users, newUser);

                this.role = Roles.User;
                this.name = newUser.name;
            } catch (error) {
                throw error;
            }
        }
    }
});