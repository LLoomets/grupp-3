// composables/useAuth.ts
import { onMounted, ref } from "vue";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";

const user = ref<User | null>(null);

export function useAuth() {
  onMounted(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser;
    });
  });

  return { user };
}
