import Sidebar from "@/components/website/Sidebar";
import Header from "@/components/website/Header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Fixed Sidebar */}
      <div className="w-[240px] shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="shrink-0">
          <Header />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto bg-white p-4">{children}</div>
      </div>
    </div>
  );
}