import { Sparkles } from "lucide-react"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative flex items-center justify-center w-8 h-8 bg-black rounded-md">
        <span className="text-pump-green font-bold text-xl">c</span>
        <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-pump-yellow" />
      </div>
      <span className="font-bold text-xl">
        <span className="text-white">crowd</span>
        <span className="text-pump-green">.fun</span>
      </span>
    </Link>
  )
}
