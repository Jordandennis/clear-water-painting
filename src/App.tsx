import NoticeBar from "./components/NoticeBar"
import WarrantyForm from "./components/WarrantyForm"

export default function App() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/Ocean.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-20">
        <header className="flex items-center gap-4 px-6 p-4 bg-white shadow-sm">
          <a href="/">
            <img
              src="/images/Clear_Water_Painting-A_edited.png"
              alt="Clear Water Painting Logo"
              className="w-24 h-24 rounded-full hover:bg-gray-800/50 transition-colors"
            />
          </a>
          <span className="text-4xl font-[ClearWater,Georgia,serif] text-gray-800">
            Clear Water Painting
          </span>
        </header>

        <main className="flex flex-col items-center pt-20 px-8 text-center mb-16">
          <h1 className="text-3xl text-black font-bold text-center">
            Residential Painting Contractor
          </h1>
          <h2 className="text-2xl text-black font-medium text-center">
            Serving the Comox Valley and surrounding area!
          </h2>
        </main>

        <NoticeBar />
        <WarrantyForm />
      </div>
    </div>
  )
}
