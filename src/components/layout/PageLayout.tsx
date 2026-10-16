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
  actions,
}: IPageLayout) {
  return (
    <div className="mx-auto w-full max-w-360">
      {(title || description || actions) && (
        <header className="mb-8 flex flex-wrap items-start justify-between gap-5 border-b border-border pb-6">
          <div className="flex min-w-0 flex-col gap-2">
            <p
            className="text-xs font-medium text-text-muted">
              {headTitle}
            </p>
            {title && 
              <h1
              className="font-heading text-2xl font-semibold tracking-tight text-text sm:text-[28px]">
                {title}
              </h1>
            }
            {description && 
            <p className="max-w-2xl text-sm leading-6 text-text-muted">
              {description}
            </p>
            }
          </div>

          {actions && 
          <div 
          className="flex shrink-0 flex-wrap items-center gap-2
          self-center
          ">{actions}</div>}
        </header>
      )}
    
      <div
      className="flex min-w-0 flex-col gap-6">
        {children}
      </div>
    </div>
  )
}
