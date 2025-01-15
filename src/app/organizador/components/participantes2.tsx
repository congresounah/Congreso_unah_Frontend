import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { obtenerUsuariosParaChequear, actualizarEstadoUsuario } from "@/services/participantes/participantes";
import { Participantes } from "@/interfaces/participantes";
import InvoiceModal from "./modalVerificación";
import Loader from "@/components/Loading";
import { toast } from "react-toastify";

const TablaParticipantes = () => {
  const [usuarios, setUsuarios] = useState<Participantes[]>([]);
  const [filteredData, setFilteredData] = useState<Participantes[]>([]);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [, setActions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVerificarFilter, setSelectedVerificarFilter] = useState<boolean | null>(null);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const [selectedUser, setSelectedUser] = useState<Participantes | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await obtenerUsuariosParaChequear(selectedVerificarFilter);
      setUsuarios(data);
      setFilteredData(data);
      setActions(data.map(() => "Validar"));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Error al cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsuarios();
  }, [selectedVerificarFilter]);

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

  const handleOpenModal = (usuario: Participantes) => {
    setSelectedUser(usuario);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleValidate = async () => {
    if (selectedUser) {
      setLoadingButton(true);

      try {
        const response = await actualizarEstadoUsuario(selectedUser.id_usuario.toString(), true);
        fetchUsuarios();

        if(response.resultado.codigo === 1) {
          toast.success("Usuario validado con éxito");
          return;
        }

        throw new Error("Error al validar el usuario");

/*         const updatedActions = actions.map((action, index) =>
          usuarios[index].id_usuario === selectedUser.id_usuario ? "Validado" : action
        );
        setActions(updatedActions); */
      } catch (err) {
        toast.error("Error al validar el usuario.");
        console.error("Error al validar el usuario:", err);
      } finally {
        handleCloseModal();
        setLoadingButton(false);
      }
    }
    handleCloseModal();
  };

  const handleDeny = async () => {
    if (selectedUser) {
      setLoadingButton(true);
      try {
        const response = await actualizarEstadoUsuario(selectedUser.id_usuario.toString(), false);
        fetchUsuarios();

        if(response.resultado.codigo === 1) {
          toast.success("Usuario denegado con éxito");
          return;
        }

        throw new Error("Error al denegar el usuario");

      } catch (err) {
        toast.error("Error al denegar el usuario.");
        console.error("Error al denegar el usuario:", err);
      } finally {
        handleCloseModal();
        setLoadingButton(false);
      }
    }
    handleCloseModal();
  };

  const handleChange = (value: boolean | null) => {
    setSelectedVerificarFilter(value);
  };

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="overflow-x-auto pb-4">
      <h2 className="text-3xl text-black border-b-[1px] border-gray-300 pb-1 mb-4">Participantes</h2>

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

      <div className="flex flex-row gap-4 mb-4">
        <div className="flex gap-2">
          <input
            type="radio"
            name="verificar"
            id="por-verificar"
            value="null"
            checked={selectedVerificarFilter === null}
            onChange={() => handleChange(null)}
          />
          <label htmlFor="por-verificar">Por verificar</label>
        </div>
        <div className="flex gap-2">
          <input
            type="radio"
            name="verificar"
            id="aceptados"
            value="true"
            checked={selectedVerificarFilter === true}
            onChange={() => handleChange(true)}
          />
          <label htmlFor="aceptados">Aceptados</label>
        </div>
        <div className="flex gap-2">
          <input
            type="radio"
            name="verificar"
            id="rechazados"
            value="false"
            checked={selectedVerificarFilter === false}
            onChange={() => handleChange(false)}
          />
          <label htmlFor="rechazados">Rechazados</label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loader />
        </div>
      ) :
        <div className="overflow-y-auto max-h-[700px] border border-gray-300 rounded-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left border-b">DNI</th>
                <th className="px-4 py-2 text-left border-b">Nombre</th>
                <th className="px-4 py-2 text-left border-b">Correo</th>
                <th className="px-4 py-2 text-center border-b">Recibo</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((usuario, index) => (
                <tr
                  key={usuario.id_usuario}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2 border-b">{usuario.dni}</td>
                  <td className="px-4 py-2 border-b">{usuario.nombre_completo}</td>
                  <td className="px-4 py-2 border-b">{usuario.correo}</td>
                  <td className="px-4 py-2 border-b text-center">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                      onClick={() => handleOpenModal(usuario)}
                    >
                      {selectedVerificarFilter || selectedVerificarFilter === false ? "Cambiar estado" : "Verificar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }

      {selectedUser && (
        <InvoiceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onValidate={handleValidate}
          onDeny={handleDeny}
          invoiceCode={selectedUser.codigo_recibo}
          invoiceImage={selectedUser.img_recibo}
          isAccepted={selectedVerificarFilter}
          loading={loadingButton}
        />
      )}
    </div>
  );
};

export default TablaParticipantes;
