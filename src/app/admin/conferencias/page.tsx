'use client'
import TableComponent from "./components/Table";

const Conferencias: React.FC = () => {
  return (
    <div className="flex">
      <main className="container mx-auto">
        <TableComponent/>
      </main>
    </div>
  );
};

export default Conferencias;
