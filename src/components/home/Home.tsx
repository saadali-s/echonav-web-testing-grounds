import Nav from "./nav"
import Section1 from "./section1"
import Section2 from "./section2"
import Section3 from "./section3"
import Footer from "./section4"

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full flex-1 rounded-lg border bg-muted p-6">
        <Nav />
      </div>
      <div className="w-full flex-1 rounded-lg p-10">
        <Section1 />
      </div>
      <div className="w-full flex-1 rounded-lg p-10">
        <Section2 />
      </div>
      <div className="w-full flex-1 rounded-lg p-10">
        <Section3 />
      </div>
        <Footer />
    </div>
  )
}
