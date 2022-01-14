<template>
    <div class="h-screen bg-gray-50 flex">
        <SideNavBar ref="sideNavBar" />
        <div class="p-10 flex-grow">
            <div class="py-3 grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 justify-between gap-3">
                <div class="bg-white rounded p-4 shadow">
                    <h3 class="text-4xl font-bold">{{ numberOfUsers }}</h3>
                    <p class="text-base font-normal text-gray-500">Users</p>
                </div>
                <div class="bg-white rounded p-4 shadow">
                    <h3 class="text-4xl font-bold">{{ numberOfNewUsers }}</h3>
                    <p class="text-base font-normal text-gray-500">New users today</p>
                </div>
                <div class="bg-white rounded p-4 shadow">
                    <h3 class="text-4xl font-bold">{{ todaySales }}</h3>
                    <p class="text-base font-normal text-gray-500">Sales today</p>
                </div>
                <div class="bg-white rounded p-4 shadow">
                    <h3 class="text-4xl font-bold">{{ thisMonthSales }}</h3>
                    <p class="text-base font-normal text-gray-500">Sales this Month</p>
                </div>
            </div>
            <div class="bg-white p-3 mt-3 rounded shadow">
                <h3 class="text-4xl font-bold px-2 py-4">Sales this month</h3>
                <LineChart v-bind="lineChartProps"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref, computed, ComputedRef } from 'vue';
import { useRouter } from 'vue-router'
import { LineChart, useLineChart } from 'vue-chart-3';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { query, where, getDocs } from 'firebase/firestore';

import { db } from '@/modules/db';
import { Roles } from '@/types';
import { useUserStore } from '@/stores/user'

Chart.register(...registerables);

export default defineComponent({
    components: { LineChart },
    setup() {
        const sideNavBar = ref();

        onMounted(() => {
            sideNavBar.value.changeCurrentTab("Dashboard");
        });

        const users = db.user;
        const numberOfUsers = ref(0);
        const getNumberOfUsers = async () => {
            const userQuery = query(users, where("role", "==", Roles.User));
            const userSnapshot = await getDocs(userQuery);
            return userSnapshot.docs.length;
        };

        const numberOfNewUsers = ref(0);
        const getTodayStartTimestamp = () => {
            const today = new Date();
            today.setHours(0, 0, 0);
            return today;
        };

        const getTodayEndTimestamp = () => {
            const today = new Date();
            today.setHours(24, 0, 0);
            return today;
        };

        const getNumberOfNewUsers = async () => {
            const todayStartTimestamp = getTodayStartTimestamp();
            const todayEndTimestamp = getTodayEndTimestamp();
            const todayNewUsersQuery = query(users, where("signUpDate", ">", todayStartTimestamp), where("signUpDate", "<", todayEndTimestamp));
            const userSnapshot = await getDocs(todayNewUsersQuery);
            return userSnapshot.docs.length;
        };

        onMounted(async () => {
            numberOfUsers.value = await getNumberOfUsers();
            numberOfNewUsers.value = await getNumberOfNewUsers();
        });

        const getTodaySales = async () => {
            const todayStartTimestamp = getTodayStartTimestamp();
            const todayEndTimestamp = getTodayEndTimestamp();
            const todayTransactionQuery = query(db.transaction, where("date", ">", todayStartTimestamp), where("date", "<", todayEndTimestamp));
            const transactionSnapshot = await getDocs(todayTransactionQuery);
            const transactionDocs = transactionSnapshot.docs;
            let todaySales = 0;
            transactionDocs.forEach((transactionDoc) => {
                todaySales += transactionDoc.data().amount;
            });

            return todaySales;
        };

        const todaySales = ref(0);

        onMounted(async () => todaySales.value = await getTodaySales());

        const getThisMonthStartTimestamp = () => {
            const time = new Date();
            time.setDate(1);
            time.setHours(0, 0, 0);
            return time;
        };

        const getThisMonthSales = async () => {
            const thisMonthStartTimestamp = getThisMonthStartTimestamp();
            const todayEndTimestamp = getTodayEndTimestamp();
            const todayTransactionQuery = query(db.transaction, where("date", ">", thisMonthStartTimestamp), where("date", "<", todayEndTimestamp));
            const transactionSnapshot = await getDocs(todayTransactionQuery);
            const transactionDocs = transactionSnapshot.docs;
            let thisMonthSales = 0;
            transactionDocs.forEach((transactionDoc) => {
                thisMonthSales += transactionDoc.data().amount;
            });

            return thisMonthSales;
        };

        const thisMonthSales = ref(0);

        onMounted(async () => thisMonthSales.value = await getThisMonthSales());

        const getEverydaySalesData = async () => {
            const thisMonthStartTimestamp = getThisMonthStartTimestamp();
            const todayEndTimestamp = getTodayEndTimestamp();
            const todayTransactionQuery = query(db.transaction, where("date", ">", thisMonthStartTimestamp), where("date", "<", todayEndTimestamp));
            const transactionSnapshot = await getDocs(todayTransactionQuery);
            const transactionDocs = transactionSnapshot.docs;
            const everydaySalesData = Array.from(
                { 
                    length: todayEndTimestamp.getDate() - 1,
                }, () => 0);
            
            for(const transactionDoc of transactionDocs) {
                const transaction = transactionDoc.data();
                const date = transaction.date.toDate().getDate();
                everydaySalesData[date - 1] += transaction.amount;
            }

            return everydaySalesData;
        };

        const thisMonthChartOption = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false,
                    }
                },
                y: {
                    grid: {
                        display: false,
                    }
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                }
            }
        } as ChartOptions;

        const everydaySales = ref([]) as Ref<number[]>;

        onMounted(async () => {
            everydaySales.value = await getEverydaySalesData();
        });

        const thisMonthChartData = computed(() => {
            const currentTime = new Date();
            const labels = [] as string[];
            for(let i = 1; i <= currentTime.getDate(); i++) {
                labels.push(`${currentTime.getMonth() + 1}/${i}`);
            }

            return {
                labels,
                datasets: [
                    {
                        label:'',
                        data: everydaySales.value,
                        borderColor: 'rgb(20, 184, 166)',
                        backgroundColor: 'rgba(204, 251, 241)',
                        fill: true,
                        cubicInterpolationMode: 'monotone',
                        tension: 0.4,
                        pointRadius: 5,
                        pointBackgroundColor: 'rgb(20, 184, 166)',
                    }
                ]
            }
        })  as ComputedRef<ChartData<'line'>>;

        const { lineChartProps } = useLineChart({
            chartData: thisMonthChartData,
            options: thisMonthChartOption,
        });

        return {
            numberOfUsers,
            numberOfNewUsers,
            sideNavBar,
            todaySales,
            thisMonthSales,
            lineChartProps,
        };
    },
})
</script>