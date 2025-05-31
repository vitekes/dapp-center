import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        // Разрешаем загрузку картинок с публичных IPFS gateway и локального узла
        remotePatterns: [
            {
                protocol: "https",
                hostname: "gateway.lighthouse.storage",
                pathname: "/ipfs/**",
            },
            {
                protocol: "https",
                hostname: "ipfs.io",
                pathname: "/ipfs/**",
            },
            {
                protocol: "https",
                hostname: "dweb.link",
                pathname: "/ipfs/**",
            },
            {
                protocol: "https",
                hostname: "cloudflare-ipfs.com",
                pathname: "/ipfs/**",
            },
            {
                protocol: "https",
                hostname: "gateway.pinata.cloud",
                pathname: "/ipfs/**",
            },
            // Локальные шлюзы
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "8081",
                pathname: "/ipfs/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "8081",
                pathname: "/ipfs/**",
            },

        ],
    },
};

export default nextConfig;