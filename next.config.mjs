/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hqqtbuqiwtuetrmwwbia.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
    ],
  },
  // experimental: {
  //   staleTimes: {
  //     dynamic: 0,
  //     static: 180,
  //   },
  // },
  // output: "export",
};

export default nextConfig;
