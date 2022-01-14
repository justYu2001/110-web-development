<template>
    <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router'

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/modules/firebase';
import { useUserStore } from '@/stores/user';
import { Roles } from '@/types';

export default defineComponent({
    setup() {
        const userStore = useUserStore();
        const router = useRouter();

        onAuthStateChanged(auth, async (user) => {
            if(user) {
                userStore.setRole(Roles.User);
                userStore.setName(<string>user.displayName);
                await userStore.login(user.uid);
                const currentPath = router.currentRoute.value.path;
                if(currentPath.includes('admin') && userStore.role !== Roles.Admin) {
                    router.push('/');
                }
            }
        });
    },
})
</script>
