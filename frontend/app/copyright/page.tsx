"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const CURRENT_YEAR = new Date().getFullYear();

export default function CopyrightPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-16 w-full">
        <div className="mb-12 space-y-2">
          <p className="text-xs font-mono text-signal uppercase tracking-widest">
            Legal
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-text-primary">
            Copyright y Derechos de Autor
          </h1>
          <p className="text-text-secondary text-base max-w-xl">
            Propiedad intelectual, condiciones de uso y proteccion de marca
            personal sobre VeriMatChain AI y su autor.
          </p>
        </div>

        <div className="space-y-12">

          <LegalSection title="Titularidad de derechos">
            <p>
              VeriMatChain AI es una obra original protegida por las leyes de
              propiedad intelectual de la Republica Argentina y los tratados
              internacionales de los que forma parte, incluyendo el Convenio de
              Berna para la Proteccion de las Obras Literarias y Artisticas y el
              Acuerdo sobre los Aspectos de los Derechos de Propiedad
              Intelectual relacionados con el Comercio (ADPIC).
            </p>
            <p>
              La titularidad exclusiva de todos los derechos de autor, derechos
              conexos y derechos de propiedad intelectual sobre VeriMatChain AI
              corresponde a su creador:
            </p>
            <AuthorCard />
            <p>
              Copyright &copy; {CURRENT_YEAR} Carlos José Castro Galante. Todos
              los derechos reservados.
            </p>
          </LegalSection>

          <LegalSection title="Alcance de la proteccion">
            <p>
              La proteccion comprende, de forma enunciativa y no limitativa, los
              siguientes elementos constitutivos del proyecto:
            </p>
            <ul className="space-y-2 mt-3">
              {PROTECTED_ELEMENTS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-text-secondary"
                >
                  <span className="text-signal shrink-0 mt-0.5 select-none">
                    +
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </LegalSection>

          <LegalSection title="Marca personal">
            <p>
              El nombre Carlos José Castro Galante, su identidad visual,
              presencia digital y produccion intelectual constituyen una marca
              personal protegida. Se prohibe expresamente:
            </p>
            <ul className="space-y-2 mt-3">
              {PROHIBITED_ACTIONS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs text-text-secondary"
                >
                  <span className="text-verdict-critical shrink-0 mt-0.5 select-none">
                    x
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </LegalSection>

          <LegalSection title="Usos autorizados">
            <p>
              Se autoriza el uso de referencias a VeriMatChain AI unicamente en los
              siguientes supuestos, siempre con atribucion correcta al autor:
            </p>
            <div className="mt-4 space-y-3">
              {PERMITTED_USES.map((use) => (
                <div
                  key={use.title}
                  className="bg-surface border border-border rounded p-4 space-y-1.5"
                >
                  <p className="text-xs font-mono text-signal font-bold">
                    {use.title}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {use.description}
                  </p>
                </div>
              ))}
            </div>
          </LegalSection>

          <LegalSection title="Contexto de creacion">
            <p>
              VeriMatChain AI fue concebido, disenado y desarrollado en su
              totalidad por Carlos José Castro Galante como proyecto de
              competencia para el hackathon Dev3Pack y el Startup 101
              Accelerator, edicion junio de 2026.
            </p>
            <p>
              La participacion en dicho evento no transfiere ni limita en modo
              alguno los derechos de propiedad intelectual del autor. Todo uso
              del proyecto por parte de organizadores, jueces o participantes
              queda circunscripto exclusivamente a los fines de evaluacion del
              concurso.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded overflow-hidden">
              {PROJECT_FACTS.map((fact) => (
                <div key={fact.label} className="bg-surface px-5 py-4 space-y-1">
                  <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
                    {fact.label}
                  </p>
                  <p className="text-sm font-mono text-text-primary">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </LegalSection>

          <LegalSection title="Licencia de software">
            <p>
              El codigo fuente de VeriMatChain AI se publica bajo licencia{" "}
              <span className="font-mono text-xs bg-panel px-1.5 py-0.5 rounded text-signal">
                MIT License
              </span>
              , que permite su uso, copia, modificacion y distribucion bajo las
              siguientes condiciones obligatorias:
            </p>
            <div className="mt-4 bg-abyss border border-border rounded p-5 space-y-4">
              <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
                MIT License
              </p>
              <p className="text-xs font-mono text-text-secondary">
                Copyright &copy; {CURRENT_YEAR} Carlos José Castro Galante
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                Se concede permiso, de forma gratuita, a cualquier persona que
                obtenga una copia de este software y de los archivos de
                documentacion asociados, para utilizar el software sin
                restriccion. Esto incluye, sin caracter limitativo, los derechos
                de usar, copiar, modificar, fusionar, publicar, distribuir,
                sublicenciar y vender copias del software, y de permitir a
                terceros hacer lo mismo, sujeto a las condiciones que siguen.
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                El aviso de copyright y este aviso de permiso deberan incluirse
                en todas las copias o partes sustanciales del software.
              </p>
              <p className="text-xs text-text-secondary leading-relaxed uppercase tracking-wide">
                El software se proporciona tal cual, sin garantia de ningun
                tipo, expresa o implicita. En ningun caso el autor sera
                responsable de reclamacion, daño u otra responsabilidad derivada
                del uso del software.
              </p>
            </div>
          </LegalSection>

          <LegalSection title="Tecnologias de terceros">
            <p>
              VeriMatChain AI integra servicios y tecnologias de terceros sujetos a
              sus propios terminos de uso. El autor de VeriMatChain AI no reclama
              titularidad sobre ninguno de estos servicios ni sobre las marcas
              que los identifican.
            </p>
            <div className="mt-4 space-y-2">
              {THIRD_PARTY.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between bg-surface border border-border rounded px-4 py-3"
                >
                  <span className="text-xs font-mono text-signal">
                    {item.name}
                  </span>
                  <span className="text-xs text-text-muted">{item.owner}</span>
                </div>
              ))}
            </div>
          </LegalSection>

          <LegalSection title="Limitacion de responsabilidad">
            <p>
              VeriMatChain AI es una herramienta de asistencia informativa. Los
              analisis generados por inteligencia artificial tienen caracter
              estrictamente orientativo y no constituyen asesoramiento legal,
              periodistico, medico ni de ninguna otra naturaleza profesional.
            </p>
            <p>
              Carlos José Castro Galante no asume responsabilidad alguna por
              decisiones tomadas basandose exclusivamente en los resultados de
              verificacion, ni por errores derivados de las limitaciones tecnicas
              inherentes a los modelos de lenguaje o a los servicios externos
              integrados.
            </p>
            <p>
              El uso de esta herramienta no exime al usuario de contrastar la
              informacion con fuentes primarias confiables antes de tomar
              cualquier decision o difundir contenido.
            </p>
          </LegalSection>

          <LegalSection title="Modificaciones de estos terminos">
            <p>
              Carlos José Castro Galante se reserva el derecho de actualizar
              estos terminos en cualquier momento sin previo aviso. El uso
              continuado de VeriMatChain AI con posterioridad a cualquier
              modificacion implica la aceptacion de los terminos actualizados.
            </p>
            <div className="mt-4 bg-surface border border-border rounded px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted">
                Ultima actualizacion
              </span>
              <span className="text-xs font-mono text-text-primary">
                Abril 2026
              </span>
            </div>
          </LegalSection>

          <LegalSection title="Contacto">
            <p>
              Para consultas sobre licencias, uso comercial del proyecto o la
              marca personal, comunicate directamente con el autor:
            </p>
            <div className="mt-4 bg-surface border border-border rounded p-5 space-y-3">
              {CONTACT_ITEMS.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <span className="text-xs font-mono text-text-muted w-20 shrink-0">
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-signal hover:underline"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-xs font-mono text-text-secondary">
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </LegalSection>

        </div>
      </main>
      <Footer />
    </div>
  );
}

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-px h-6 bg-signal" />
        <h2 className="font-display text-xl font-bold text-text-primary">
          {title}
        </h2>
      </div>
      <div className="pl-4 space-y-3 text-sm text-text-secondary leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function AuthorCard() {
  return (
    <div className="my-4 bg-surface border border-signal/20 rounded p-5 space-y-3 glow-signal">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 border border-signal rotate-45 shrink-0 flex items-center justify-center">
          <span className="font-display font-bold text-signal text-sm -rotate-45">
            CJCG
          </span>
        </div>
        <div className="space-y-1">
          <p className="font-display font-bold text-text-primary text-base">
            Carlos José Castro Galante
          </p>
          <p className="text-xs text-text-secondary font-mono">
            Desarrollador Full Stack e Ingeniero de Inteligencia Artificial
          </p>
          <p className="text-xs text-text-muted font-mono">
            San Juan, Argentina
          </p>
          <a
            href="https://carlosjcastrog.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-signal hover:underline"
          >
            carlosjcastrog.com
          </a>
        </div>
      </div>
    </div>
  );
}

const PROTECTED_ELEMENTS = [
  "Nombre comercial VeriMatChain AI y cualquier variacion ortografica o fonetica confundiblemente similar.",
  "Logotipo, identidad visual, sistema de colores y lenguaje de diseno del proyecto.",
  "Codigo fuente del backend desarrollado en FastAPI, incluyendo los agentes LangGraph y los servicios de inteligencia artificial.",
  "Codigo fuente del frontend desarrollado en Next.js, incluyendo componentes, hooks, estilos y flujos de interaccion.",
  "Contrato inteligente de Solana Anchor para el sistema de atestaciones de veracidad on-chain.",
  "Arquitectura del pipeline de verificacion multimodal y su documentacion tecnica.",
  "Prompts de sistema, estrategia de instruccion y metodologia de evaluacion para los modelos de lenguaje.",
  "Extension de navegador para verificacion de contenido en tiempo real.",
  "Contenido editorial, textos de interfaz, documentacion y material de presentacion.",
];

const PROHIBITED_ACTIONS = [
  "Utilizar el nombre VeriMatChain AI o variaciones similares para identificar otros productos o servicios sin autorizacion escrita previa.",
  "Reproducir, distribuir o exhibir publicamente el proyecto atribuyendo su autoria a personas distintas del autor.",
  "Utilizar el nombre, imagen o reputacion de Carlos José Castro Galante con fines publicitarios, comerciales o de cualquier otra naturaleza sin consentimiento previo y por escrito.",
  "Desarrollar obras derivadas del proyecto con fines comerciales sin licencia acordada con el autor.",
  "Intentar registrar como marca propia el nombre VeriMatChain AI o cualquier denominacion confundiblemente similar en cualquier jurisdiccion.",
  "Reclamar derechos de propiedad intelectual sobre cualquier componente original del proyecto.",
];

const PERMITTED_USES = [
  {
    title: "Referencia academica o periodistica",
    description:
      "Se permite citar VeriMatChain AI en trabajos de investigacion, articulos academicos o publicaciones periodisticas, siempre que se incluya atribucion clara al autor y no se reproduzca contenido sustancial sin autorizacion.",
  },
  {
    title: "Evaluacion en el contexto del hackathon Dev3Pack",
    description:
      "Los jueces, organizadores y participantes del hackathon Dev3Pack y el Startup 101 Accelerator pueden evaluar, referenciar y demostrar el proyecto en el marco exclusivo de dicho evento.",
  },
  {
    title: "Uso personal y educativo del codigo fuente",
    description:
      "Cualquier persona puede estudiar, modificar y usar el codigo fuente para fines personales o educativos no comerciales, respetando los terminos de la licencia MIT y manteniendo la atribucion al autor en todos los archivos.",
  },
  {
    title: "Mencion en portfolios profesionales",
    description:
      "Quienes hayan contribuido de forma documentada y verificable pueden mencionar el proyecto en sus portfolios, indicando con precision su rol y dejando constancia de que la autoria original del proyecto pertenece a Carlos José Castro Galante.",
  },
];

const PROJECT_FACTS = [
  { label: "Autor", value: "Carlos José Castro Galante" },
  { label: "Año", value: "2026" },
  { label: "Evento", value: "Dev3Pack Hackathon" },
];

const THIRD_PARTY = [
  { name: "Claude API", owner: "Anthropic PBC" },
  { name: "ElevenLabs Speech Classifier", owner: "ElevenLabs Inc." },
  { name: "Solana Blockchain", owner: "Solana Foundation" },
  { name: "Anchor Framework", owner: "Coral XYZ" },
  { name: "IPFS / Pinata", owner: "Pinata Cloud Inc." },
  { name: "Google Fact Check Tools API", owner: "Google LLC" },
  { name: "Next.js", owner: "Vercel Inc." },
  { name: "LangGraph", owner: "LangChain Inc." },
];

const CONTACT_ITEMS = [
  {
    label: "Web",
    value: "carlosjcastrog.com",
    href: "https://carlosjcastrog.com",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/carlosjcastrog",
    href: "https://linkedin.com/in/carlosjcastrog",
  },
  {
    label: "GitHub",
    value: "github.com/carlosjcastrog",
    href: "https://github.com/carlosjcastrog",
  },
  {
    label: "Proyecto",
    value: "VeriMatChain AI, Startup 101 Accelerator 2026",
    href: undefined,
  },
];