import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 text-white py-2 flex justify-end md:hidden w-full">
          <Image
            src="/logos/logo_cit_completo_blanco.webp" // Asegúrate de reemplazar este path con tu imagen
            alt="Congreso de Innovación y Tecnología UNAH 2025"
            width={160}
            height={160}
            className="mr-3 xl:hidden"
          />
    </header>
  );
};

export default Header;
