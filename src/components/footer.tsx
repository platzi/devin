import Link from "next/link";

const columns = [
  {
    title: "Producto",
    links: [
      { label: "Características", href: "#" },
      { label: "Precios", href: "#" },
      { label: "Cambios", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Documentación", href: "#" },
      { label: "Guías", href: "#" },
      { label: "API", href: "#" },
      { label: "Estado", href: "#" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Acerca de", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contacto", href: "#" },
      { label: "Carreras", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacidad", href: "#" },
      { label: "Términos", href: "#" },
      { label: "Cookies", href: "#" },
      { label: "Licencias", href: "#" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title} className="grid gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {col.title}
              </h2>
              <ul className="grid gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ShipLog. Hecho con cariño.
          </p>
          <p className="text-xs text-muted-foreground">
            Bitácora de desarrollo con resumen semanal.
          </p>
        </div>
      </div>
    </footer>
  );
}
