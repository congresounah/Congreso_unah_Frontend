/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Agregamos el dominio de Unsplash
        pathname: '/**',                // Permitimos todas las rutas del dominio
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',     // Si necesitas otro dominio, agrégalo aquí
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.masmovil.es',
        pathname: '/**',
      },
      
    ],
    domains: ['1.bp.blogspot.com','res.cloudinary.com','img.icons8.com'],
  },
};

export default nextConfig;
