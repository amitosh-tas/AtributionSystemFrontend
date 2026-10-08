import type { ReactNode } from "react"


interface IPageLayout{
  headTitle: string,
  children: ReactNode,
  title?: string,
  description?: string,
  actions?: ReactNode,
}



export default function PageLayout({
  headTitle,
  children,
  title,
  description,
  actions
} : IPageLayout) {
  return (
    <>

      {(title || description || actions) && (
        <header className="mb-6 flex items-start justify-between">
          <div className="flex flex-col gap-2.5">
            <p
            className="text-xs uppercase text-text-muted">
              {headTitle}
            </p>
            {title && 
              <h1
              className="text-3xl font-medium font-heading">
                {title}
              </h1>
            }
            {description && 
            <p className="text-text-muted text-xs">
              {description}
            </p>
            }
          </div>

          {actions && <div>{actions}</div>}
        </header>
      )}
    
      <div
      className="flex flex-col gap-7.5">
        {children}
      </div>
    </>
  )
}
