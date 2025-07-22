import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import ARView from '../views/ARView.vue';
import { auth } from '@/firebase';

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/tabs/tab1",
  },
  {
    path: "/tabs/",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/tabs/tab1",
      },
      {
        path: "tab1",
        component: () => import("@/views/Tab1Page.vue"),
      },
      {
        path: "tab2",
        component: () => import("@/views/Tab2Page.vue"),
      },
      {
        path: "tab3",
        component: () => import("@/views/Tab3Page.vue"),
      },
      {
        path: "tab4",
        component: () => import("@/views/Tab4Page.vue"),
      },
      {
        path: "tab5",
        component: () => import("@/views/Tab5Page.vue"),
      },
    ],
  },
  {
    path: "/ar-view",
    component: ARView,
  },
  {
    path: "/settings",
    component: () => import("@/views/SettingsPage.vue"),
  },
  {
    path: "/disclaimer",
    component: () => import("@/views/DisclaimerPage.vue"),
  },
  {
    path: "/login",
    component: () => import("@/views/LoginPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const user = auth.currentUser;

  if (!user && to.path !== "/login") {
    // Kui pole sisse logitud ja lähed mitte-login lehele, suuna loginile
    next("/login");
  } else if (user && to.path === "/login") {
    // Kui juba sisse logitud ja proovid loginile minna, suuna põhilehele
    next("/tabs/tab1");
  } else {
    next();
  }
});

export default router
