'use client';

import { useState, useEffect, JSX } from "react";
import { FaEdit, FaSearch, FaEye, FaPaperPlane } from "react-icons/fa";
import { obtenerUsuarios } from "@/services/participantes/participantes"; // Importa el servicio
import { Participantes } from "@/interfaces/participantes";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loading";

const TableComponent = () => {
  const [usuarios, setUsuarios] = useState<Participantes[]>([]);
  const router = useRouter();
  const [filteredData, setFilteredData] = useState<Participantes[]>([]);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [actions, ] = useState<{ desc: string; icon: JSX.Element; bgColor: string; getRoute?: (id: string) => string }[]>([
    {
      desc: "Enviar",
      icon: <FaPaperPlane size={13} />,
      bgColor: "bg-blue-500",
      getRoute: (id: string) => `/admin/home/${id}`
    },
    {
      desc: "Editar",
      icon: <FaEdit size={15} />,
      bgColor: "bg-yellow-500",
      getRoute: (id) => `/admin/home/${id}?visualizar=false`
    },
    {
      desc: "Ver",
      icon: <FaEye size={15}/>,
      bgColor: "bg-green-500",
      getRoute: (id) => `/admin/home/${id}?visualizar=true`
    }
  ]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const data = await obtenerUsuarios();
        setUsuarios(data);
        setFilteredData(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Error al cargar los usuarios.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const toggleSortOrder = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const comparison = a.nombre_completo.localeCompare(b.nombre_completo);
      return sortOrder === "ASC" ? -comparison : comparison;
    });

    setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    setFilteredData(sortedData);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = usuarios.filter(
      (usuario) =>
        usuario.nombre_completo.toLowerCase().includes(term.toLowerCase()) ||
        usuario.correo.toLowerCase().includes(term.toLowerCase()) ||
        usuario.dni.includes(term)
    );
    setFilteredData(filtered);
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader />
        </div>
    );
}

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="overflow-x-auto px-4">
      <h2 className="text-3xl mb-6 text-black border-b-[1px] border-gray-300 pb-1">Participantes</h2>
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex items-center w-full sm:w-1/3 bg-gray-100 rounded-full px-4 py-1">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-transparent border-none text-gray-600 focus:outline-none"
          />
          <button title="buscar" className="ml-2">
            <FaSearch className="text-blue-500" />
          </button>
        </div>
        <div className="relative">
          <button
            onClick={toggleSortOrder}
            className="bg-gray-200 px-4 py-2 rounded-lg shadow hover:bg-gray-300"
          >
            Ordenar por: {sortOrder}
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[700px] border border-gray-300 rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left border-b">DNI</th>
              <th className="px-4 py-2 text-left border-b">Nombre</th>
              <th className="px-4 py-2 text-left border-b">Correo</th>
              <th className="px-4 py-2 text-center border-b">Acciones</th>
            </tr>
          </thead>
          <tbody className="font-thin">
            {filteredData.map((usuario, index) => (
              <tr
                key={usuario.id_usuario}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-2 border-b">{usuario.dni}</td>
                <td className="px-4 py-2 border-b">{usuario.nombre_completo}</td>
                <td className="px-4 py-2 border-b">{usuario.correo}</td>
                <td className="px-4 py-2 border-b text-center">
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-1">
                    {
                      actions.map((action, i) => (
                        <button
                          className={`bg-blue-500 text-white px-2 py-1 rounded shadow hover:bg-blue-600 text-sm font-300 flex items-center gap-1 w-full ${action.bgColor}`}
                          onClick={() => {
                            if (action.getRoute) {
                              const route = action.getRoute(usuario.id_usuario.toString());
                              const validUrl = new URL(route, window.location.origin).toString(); // Asegura que la URL sea completa
                              router.push(validUrl); // Redirige con la URL completa
                            }
                          }}
                          key={`${usuario.id_usuario}-${action.icon}-${i}`} // Combina valores para crear una clave única
                        >
                          <span className="material-symbols-outlined text-xs">{action.icon}</span>
                          {action.desc}
                        </button>
                      ))
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;
