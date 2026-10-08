import type { ReactNode } from "react"


interface IGrid{
  children: ReactNode
}


function AnalyticsGrid({ children } : IGrid) {
  return (
    <div 
    className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {children}
    </div>
  )
}

export default AnalyticsGrid