const robots = () => {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/auth/login",
        "/auth/register",
        "/auth/forgot-password",
        "/auth/reset-password",
        "/auth/verify",
        "/companies",
        "/watchlists",
        "/profile",
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_URL}/sitemap.xml`,
  };
};

export default robots;
