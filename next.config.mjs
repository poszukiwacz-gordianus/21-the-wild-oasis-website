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
