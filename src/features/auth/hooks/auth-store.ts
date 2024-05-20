import { create } from "zustand";

interface Store {
  resendCode: () => void;
  setResendCode: (resendCode: () => void) => void;
}

const useAuthStore = create<Store>()((set) => ({
  resendCode: () => {
    //
  },
  setResendCode: (resendCode: () => void) => {
    set({ resendCode });
  },
}));

export default useAuthStore;
