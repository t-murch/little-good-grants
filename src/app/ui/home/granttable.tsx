import Table from "next/table";

export default function GrantTable() {
  return (
    <>
      <div className="grow justify-between mb-2 p-4 space-x-2 font-semibold md:text-4xl md:flex-col md:space-x-0 md:space-y-2 border-2 border-solid border-blue-500">
        <h2>Table Table</h2>
        <Table />
      </div>
    </>
  );
}
