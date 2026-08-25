export const routes = {
  dashboard: "/",
  auth: {
    signUp: "/signup",
    signIn: "/signin",
  },

  applications: {
    details: (id: string) => `/applications/${id}/details`,
    documents: (id: string) => `/applications/${id}/documents`,
    review: (id: string) => `/applications/${id}/review`,
    success: (id: string) => `/applications/${id}/success`,
  },
};
