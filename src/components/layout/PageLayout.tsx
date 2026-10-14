import type { ReactNode } from "react";

interface IPageLayout {
  headTitle: string;
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export default function PageLayout({
  headTitle,
  children,
  title,
  description,
  actions,
}: IPageLayout) {
  return (
    <>
      {(title || description || actions) && (
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {headTitle}
            </p>
            {title && <h1 className="font-heading text-3xl font-semibold tracking-tight text-slate-50">{title}</h1>}
            {description && <p className="max-w-2xl text-sm leading-6 text-slate-400">{description}</p>}
          </div>

          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}

      <div className="flex flex-col gap-6">{children}</div>
    </>
  );
}
