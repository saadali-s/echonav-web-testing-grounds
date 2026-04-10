import Nav from "@workspace/ui/nav"
import Section1 from "@workspace/ui/section1"
import Section2 from "@workspace/ui/section2"
import Section3 from "@workspace/ui/section3"

export default function Page() {
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
    </div>
  )
}
