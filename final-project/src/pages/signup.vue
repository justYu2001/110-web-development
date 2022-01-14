<template>
    <main class="h-screen flex justify-center items-center">
        <div>
            <h1 class="text-5xl">Create an account</h1>
            <div class="flex flex-col py-3">
                <label for="username" class="text-lg py-1">Username</label>
                <input id="username" 
                       type="text" 
                       class="border-2 border-gray-300 rounded text-lg p-1 outline-none focus:border-teal-500"
                       v-model="username"
                       @blur="checkUsername">
                <p class="text-red-500">{{ usernameErrorMessage }}</p>
                <label for="email" class="text-lg py-1">Email</label>
                <input id="email" 
                       type="text" 
                       class="border-2 border-gray-300 rounded text-lg p-1 outline-none focus:border-teal-500"
                       v-model="email"
                       @blur="checkEmail">
                <p class="text-red-500">{{ emailErrorMessage }}</p>
                <label for="password" class="text-lg py-1">Password</label>
                <input  id="password" 
                        type="password" 
                        class="border-2 border-gray-300 rounded text-lg p-1 outline-none focus:border-teal-500"
                        v-model="password"
                        @blur="checkPassword">
                <p class="text-red-500">{{ passwordErrorMessage }}</p>
            </div>
            <button class="text-center py-2 bg-teal-500 w-full text-white text-lg rounded mt-2 disabled:bg-teal-500/70" @click="signUp">Sign up</button>
            <p class="text-center py-3">
                <span class="text-gray-400">Already have an account? </span><router-link to="/login" class="text-teal-500">Log in</router-link>
            </p>
            <pre class="text-red-500 text-center self-start">{{ signUpErrorMessage }}</pre>
        </div>
    </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDocs, query, where, Timestamp } from 'firebase/firestore';

import { auth } from '@/modules/firebase';
import { useUserStore } from '@/stores/user';
import { db } from '@/modules/db';
import { User, Roles } from '@/types';
import { format } from 'path/posix';

export default defineComponent({
    setup() {
        const router = useRouter();

        const userStore = useUserStore();

        const username = ref('');
        const email = ref('');
        const password = ref('');

        const usernameErrorMessage = ref('');

        const checkUsername = () => {
            if(username.value === '') {
                usernameErrorMessage.value = "Username can't be blank.";
            } else {
                usernameErrorMessage.value = '';
            }
        }

        const emailErrorMessage = ref('');

        const checkEmail = async () => {
            emailErrorMessage.value = '';

            const emailRegExp = new RegExp('^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$');

            if(emailRegExp.test(email.value) === false) {
                emailErrorMessage.value = 'Incorrect email format.';
                return;
            }

            const users = db.user;
            const queryByEmail = query(users, where('email', '==', email.value));
            const userSnapshot = await getDocs(queryByEmail);
            if(userSnapshot.empty === false) {
                emailErrorMessage.value = 'This email has already been used.';
            }
        }

        const passwordErrorMessage = ref('');

        const checkPassword = () => {
            if(password.value.length < 6) {
                passwordErrorMessage.value = 'Password is too short (minimum is 6 characters)';
            } else {
                passwordErrorMessage.value = '';
            }
        }

        const signUpErrorMessage = ref('');

        const signUp = async (event: MouseEvent) => {
            const signUpButton = event.currentTarget as HTMLButtonElement;

            try {
                signUpButton.disabled = true;

                checkUsername();
                checkEmail();
                checkPassword();

                const errorDataExists = usernameErrorMessage.value ||
                                        emailErrorMessage.value ||
                                        passwordErrorMessage.value;

                if(errorDataExists) {
                    return;
                }

                const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
                await updateProfile(userCredential.user, {
                    displayName: username.value,
                });

                const newUser: User = {
                    role: Roles.User,
                    id: userCredential.user.uid,
                    name: username.value,
                    email: email.value,
                    signUpDate: Timestamp.fromDate(new Date()),
                    cart: [],
                };

                await userStore.signUp(newUser);

                router.push('/');
            } catch (error) {
                signUpErrorMessage.value = 'There are some problems with our server.\nPlease try again later.';
                signUpButton.disabled = false;
            }
        };

        return {
            username,
            email,
            password,
            signUpErrorMessage,
            signUp,
            usernameErrorMessage,
            checkUsername,
            emailErrorMessage,
            checkEmail,
            passwordErrorMessage,
            checkPassword,
        }
    },
})
</script>
