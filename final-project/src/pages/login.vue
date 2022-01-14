<template>
    <main class="h-screen flex justify-center items-center">
        <div>
            <h1 class="text-5xl">Welcome back</h1>
            <div class="flex flex-col py-3">
                <label for="email" class="text-lg py-1">Email</label>
                <input id="email" 
                       type="text" 
                       class="border-2 border-gray-300 rounded text-lg p-1 outline-none focus:border-teal-500"
                       v-model="email">
                <label for="password" class="text-lg py-1">Password</label>
                <input  id="password" 
                        type="password" 
                        class="border-2 border-gray-300 rounded text-lg p-1 outline-none focus:border-teal-500"
                        v-model="password">
            </div>
            <button class="text-center py-2 bg-teal-500 w-full text-white text-lg rounded mt-2 disabled:bg-teal-500/70" @click="login">Log in</button>
            <p class="text-center py-3">
                <span class="text-gray-400">Dont't have an account? </span><router-link to="/signup" class="text-teal-500">Sign up for free</router-link>
            </p>
            <pre class="text-red-500 text-center self-start">{{ errorMessage }}</pre>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import { signInWithEmailAndPassword, AuthError, AuthErrorCodes } from 'firebase/auth';
import { auth } from '@/modules/firebase';
import { useUserStore } from '@/stores/user';
import { useShoppingCartStore } from '@/stores/cart';
import { Roles } from '@/types';

export default defineComponent({
    setup() {
        const router = useRouter();

        const userStore = useUserStore();
        const shoppingCartStore = useShoppingCartStore();

        const email = ref('');
        const password = ref('');

        const errorMessage = ref('');

        const login = async (event: MouseEvent) => {
            const loginButton = event.currentTarget as HTMLButtonElement;
            try {
                loginButton.disabled = true;
                
                const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
                const userId = userCredential.user.uid;
        
                await userStore.login(userId);
                
                if(userStore.role === Roles.Admin) {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/');
                }
            } catch (error) {
                loginButton.disabled = false;

                const authError = error as AuthError;

                if(authError.code === AuthErrorCodes.INVALID_EMAIL ||
                   authError.code === AuthErrorCodes.INVALID_PASSWORD
                ) {
                    errorMessage.value = 'Incorrect email or password.';
                } else {
                    console.error(authError);
                    errorMessage.value = 'There are some problems with our server.\nPlease try again later.';
                }
            }
        };

        return {
            email,
            password,
            errorMessage,
            login,
        }
    },
})
</script>
