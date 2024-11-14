import { createRouter, createWebHistory } from "vue-router";
import IndexPage from "@/pages/index.vue"
import SplashScreen from "@/components/SplashScreen.vue";
import LoginPage from "@/pages/auth/login.vue"
import RegisterPage from "@/pages/auth/register.vue"
import HomePage from "@/pages/main/home.vue"
import SearchPage from "@/pages/main/search.vue"
import ProfilePage from "@/pages/main/profile.vue"
import ConcertDetails from "../pages/details/ConcertDetails.vue";
import PaymentPage from "@/pages/payment/payment.vue";
import MathPage from "@/pages/main/math.vue";
import eTicket from "../pages/payment/eTicket.vue"; 
import myTicket from "../pages/main/myTicket.vue";
import TicketDetail from "../pages/main/TicketDetails.vue";

const routes = [
    {
        path: "/",
        name: "SplashScreen",
        component: SplashScreen
    },
    {
        path: "/index",
        name: "Index",
        component: IndexPage
    },
    {
        path: "/login",
        name: "Login",
        component: LoginPage
    },
    {
        path: "/register",
        name: "Register",
        component: RegisterPage
    },
    {
        path: "/home",
        name: "Home",
        component: HomePage
    },
    {
        path: "/search",
        name: "Search",
        component: SearchPage
    },
    {
        path: "/profile",
        name: "Profile",
        component: ProfilePage
    },
    {
        path: "/concerts/",
        name: "ConcertDetails",
        component: ConcertDetails
    },
    {
        path: "/payment",
        name: "Payment",
        component: PaymentPage
    },
    {
        path: "/math",
        name: "Math",
        component: MathPage
    },
    {    
        path: "/eticket",
        name: "eTicket",
        component: eTicket
    },
    {
        path: "/myticket",
        name: "MyTicket",
        component: myTicket
    },
    {
        path: '/ticket-details/:id',
        name: 'TicketDetails',
        component: TicketDetail,
        props: true
    },
    
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});


export default router;