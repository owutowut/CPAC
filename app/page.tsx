import CompanyTable from "@/components/table/companyTable";

export default function Home() {
  return (
    <main className="bg-[#4e54c8] min-h-screen w-full area">
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div className="h-full w-full flex justify-center items-center">
        <div className="min-h-[85vh] min-w-[85vw] bg-slate-900 rounded-2xl drop-shadow-xl py-[3rem] px-[4rem] overflow-hidden">
          <CompanyTable />
        </div>
      </div>
    </main>
  );
}
