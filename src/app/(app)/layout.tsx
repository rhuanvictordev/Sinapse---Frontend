import Header from "@/app/components/header"
import Menu from "@/app/components/menu"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex flex-col bg-[#C4D0DA]">
      <Header />
      <div className="flex flex-1 px-10 pb-10 gap-4">
        <Menu />
        <div className="flex-1 bg-white rounded-2xl p-6">
          {children}
        </div>
      </div>
    </div>
  )
}