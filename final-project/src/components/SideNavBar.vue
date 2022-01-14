<template>
    <div class="bg-white h-screen py-10 px-7 shadow-lg">
        <ul class="text-xl">
            <li v-for="tab in tabs" :key="tab.title"
                class="my-1"
                :class="{
                    ['current-tab']: tab.title === currentTab,
                }">
                <router-link :to="tab.url" class="block py-2 px-4 font-bold cursor-pointer">{{ tab.title }}</router-link>    
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        interface Tab {
            title: string;
            url: string;
        };

        const urlPrefix = '/admin';

        const tabs: Tab[] = [
            {
                title: 'Dashboard',
                url: `${urlPrefix}/dashboard`,
            },
            {
                title: 'Products',
                url: `${urlPrefix}/products`,
            },
            {
                title: 'Transactions',
                url: `${urlPrefix}/transactions`,
            },
        ];

        const currentTab = ref('Dashboard');

        const changeCurrentTab = (newTab: string) => {
            currentTab.value = newTab;
        }

        return {
            tabs,
            currentTab,
            changeCurrentTab,
        }
    },
})
</script>


<style lang="postcss" scoped>
.current-tab {
    @apply bg-teal-100/50 text-teal-500 rounded-md;
}
</style>