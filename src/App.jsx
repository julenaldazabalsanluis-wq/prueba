import { useState, useEffect, useRef, useCallback } from "react";

const TEL = "946810000";
const TEL_LINK = `tel:+34${TEL}`;
const TEL_DISPLAY = "946 81 00 00";

function useRouter() {
  const [page, setPage] = useState("inicio");
  const navigate = useCallback((p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  return { page, navigate };
}

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ${delay}s cubic-bezier(.23,1,.32,1), transform 0.7s ${delay}s cubic-bezier(.23,1,.32,1)` }}>{children}</div>;
}

/* ═══════ BARBERPOLE ACCENT ═══════ */
function BarberPole({ height = 80, width = 12, style: s = {} }) {
  return (
    <div style={{ width, height, borderRadius: width / 2, overflow: "hidden", position: "relative", border: "1px solid rgba(242,239,234,0.15)", ...s }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `repeating-linear-gradient(
          -45deg,
          #B3211B 0px, #B3211B 6px,
          #F2EFEA 6px, #F2EFEA 12px,
          #1a3a5c 12px, #1a3a5c 18px,
          #F2EFEA 18px, #F2EFEA 24px
        )`,
        backgroundSize: `${width * 3}px ${width * 3}px`,
        animation: "barberSpin 3s linear infinite",
      }} />
      <style>{`@keyframes barberSpin{0%{background-position:0 0}100%{background-position:0 ${width * 3}px}}`}</style>
    </div>
  );
}

/* ═══════ HEADER ═══════ */
function Header({ page, navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);

  const links = [
    { id: "inicio", label: "Inicio" },
    { id: "servicios", label: "Servicios" },
    { id: "nosotros", label: "Nosotros" },
    { id: "galeria", label: "Galería" },
    { id: "contacto", label: "Contacto" },
  ];

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(13,13,13,0.98)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(179,33,27,0.15)" : "none",
      transition: "all 0.4s", padding: "0 clamp(16px, 4vw, 48px)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: scrolled ? 56 : 70, transition: "height 0.3s" }}>
        <div onClick={() => navigate("inicio")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
          <BarberPole height={scrolled ? 28 : 36} width={8} />
          <div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: scrolled ? 18 : 22, color: "#F2EFEA", letterSpacing: 3, lineHeight: 1, transition: "font-size 0.3s" }}>
              ANTONIO BUENO
            </div>
            <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: 9, color: "rgba(179,33,27,0.8)", letterSpacing: 3, textTransform: "uppercase" }}>Barbería · Durango</div>
          </div>
        </div>

        <nav className="ab-desktop-nav" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {links.map(l => (
            <button key={l.id} onClick={() => navigate(l.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: 3,
              color: page === l.id ? "#B3211B" : "#F2EFEA",
              transition: "color 0.3s", padding: 0,
            }}>{l.label}</button>
          ))}
          <a href={TEL_LINK} style={{
            background: "#B3211B", color: "#F2EFEA", padding: "10px 24px",
            fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 3,
            textDecoration: "none", transition: "background 0.3s",
          }}
            onMouseEnter={e => e.target.style.background = "#d4382f"}
            onMouseLeave={e => e.target.style.background = "#B3211B"}
          >Llamar</a>
        </nav>

        <button className="ab-mobile-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
          background: "none", border: "none", cursor: "pointer", display: "none",
          flexDirection: "column", gap: 5, padding: 8,
        }}>
          <span style={{ width: 24, height: 2, background: "#F2EFEA", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
          <span style={{ width: 24, height: 2, background: "#F2EFEA", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ width: 24, height: 2, background: "#F2EFEA", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </button>
      </div>

      {menuOpen && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "rgba(13,13,13,0.98)", padding: "20px 32px", borderBottom: "1px solid rgba(179,33,27,0.15)" }}>
          {links.map(l => (
            <button key={l.id} onClick={() => { navigate(l.id); setMenuOpen(false); }} style={{
              display: "block", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left",
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: page === l.id ? "#B3211B" : "#F2EFEA",
              padding: "12px 0", letterSpacing: 3,
            }}>{l.label}</button>
          ))}
        </div>
      )}
      <style>{`@media(max-width:768px){.ab-desktop-nav{display:none!important}.ab-mobile-btn{display:flex!important}}`}</style>
    </header>
  );
}

/* ═══════ DOTTED LINE (for menu pricing) ═══════ */
function DottedPrice({ name, price, desc }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: 16, color: "#F2EFEA", fontWeight: 500, whiteSpace: "nowrap" }}>{name}</span>
        <span style={{ flex: 1, borderBottom: "1px dotted rgba(242,239,234,0.15)", minWidth: 30, marginBottom: 4 }} />
        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: "#B3211B", letterSpacing: 1, whiteSpace: "nowrap" }}>{price}</span>
      </div>
      {desc && <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 12, color: "rgba(242,239,234,0.35)", marginTop: 2, fontStyle: "italic" }}>{desc}</p>}
    </div>
  );
}

/* ═══════ PAGE: INICIO ═══════ */
function PageInicio({ navigate }) {
  return (
    <div>
      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", textAlign: "center",
        background: `
          radial-gradient(ellipse at 30% 40%, rgba(179,33,27,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 60%, rgba(179,33,27,0.04) 0%, transparent 40%),
          #0D0D0D
        `,
        padding: "120px clamp(20px,5vw,60px) 80px", position: "relative", overflow: "hidden",
      }}>
        {/* Corner decorations */}
        <div style={{ position: "absolute", top: 80, left: 40, display: "flex", gap: 6, opacity: 0.15 }}>
          <div style={{ width: 40, height: 1, background: "#B3211B" }} />
          <div style={{ width: 1, height: 40, background: "#B3211B", marginTop: -20 }} />
        </div>
        <div style={{ position: "absolute", bottom: 80, right: 40, display: "flex", gap: 6, opacity: 0.15, transform: "rotate(180deg)" }}>
          <div style={{ width: 40, height: 1, background: "#B3211B" }} />
          <div style={{ width: 1, height: 40, background: "#B3211B", marginTop: -20 }} />
        </div>

        <Reveal>
          <BarberPole height={60} width={10} style={{ margin: "0 auto 32px" }} />
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 13, color: "rgba(242,239,234,0.4)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16, fontStyle: "italic" }}>Desde hace más de 30 años</p>
        </Reveal>
        <Reveal delay={0.15}>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(52px,12vw,110px)", color: "#F2EFEA", lineHeight: 0.9, letterSpacing: 6, maxWidth: 700, margin: "0 auto 8px" }}>
            ANTONIO<br />BUENO
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "16px 0 28px", justifyContent: "center" }}>
            <div style={{ width: 40, height: 1, background: "rgba(179,33,27,0.5)" }} />
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, color: "#B3211B", letterSpacing: 6 }}>PELUQUERÍA UNISEX</span>
            <div style={{ width: 40, height: 1, background: "rgba(179,33,27,0.5)" }} />
          </div>
        </Reveal>
        <Reveal delay={0.25}>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 16, color: "rgba(242,239,234,0.45)", maxWidth: 420, margin: "0 auto 40px", lineHeight: 1.8, fontStyle: "italic" }}>
            La barbería de toda la vida en el centro de Durango. Corte clásico, afeitado a navaja y el trato de siempre.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <a href={TEL_LINK} style={{
              background: "#B3211B", color: "#F2EFEA", padding: "16px 40px",
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: 4,
              textDecoration: "none", transition: "all 0.3s",
            }}>Llamar: {TEL_DISPLAY}</a>
            <button onClick={() => navigate("servicios")} style={{
              background: "none", color: "#F2EFEA", border: "1px solid rgba(242,239,234,0.2)",
              padding: "16px 40px", cursor: "pointer",
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: 4,
            }}>Ver servicios</button>
          </div>
        </Reveal>

        {/* Scroll */}
        <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", opacity: 0.25 }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 10, letterSpacing: 4, color: "#F2EFEA", marginBottom: 8 }}>SCROLL</div>
          <div style={{ width: 1, height: 36, background: "linear-gradient(180deg, rgba(179,33,27,0.6), transparent)", margin: "0 auto", animation: "abScroll 2s infinite" }} />
          <style>{`@keyframes abScroll{0%{opacity:1}50%{opacity:0.2}100%{opacity:1}}`}</style>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ background: "#0D0D0D", padding: "80px clamp(20px,5vw,60px)", borderTop: "1px solid rgba(179,33,27,0.1)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
          {[
            { icon: "✂", title: "30+ años de oficio", desc: "Tres décadas cortando pelo en Durango. La experiencia se nota." },
            { icon: "◆", title: "Sin cita previa", desc: "Pasa cuando quieras. Aquí siempre hay un sillón esperándote." },
            { icon: "▬", title: "Afeitado clásico", desc: "A navaja, con toalla caliente, como se ha hecho siempre." },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, color: "#B3211B", marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: "#F2EFEA", marginBottom: 8, letterSpacing: 2 }}>{item.title}</h3>
                <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 14, color: "rgba(242,239,234,0.4)", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section style={{ background: "#111", padding: "100px clamp(20px,5vw,60px)", borderTop: "1px solid rgba(242,239,234,0.04)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, color: "#B3211B", letterSpacing: 4, marginBottom: 4 }}>CARTA DE SERVICIOS</p>
                <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(28px,5vw,42px)", color: "#F2EFEA", letterSpacing: 3 }}>Lo que hacemos</h2>
              </div>
              <button onClick={() => navigate("servicios")} style={{
                background: "none", border: "1px solid rgba(179,33,27,0.4)", color: "#B3211B",
                padding: "10px 24px", cursor: "pointer",
                fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 3,
                transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.target.style.background = "#B3211B"; e.target.style.color = "#F2EFEA"; }}
                onMouseLeave={e => { e.target.style.background = "none"; e.target.style.color = "#B3211B"; }}
              >Ver todos →</button>
            </div>
          </Reveal>

          <div style={{ border: "1px solid rgba(242,239,234,0.08)", padding: "32px 28px" }}>
            {[
              { name: "Corte caballero", price: "12€" },
              { name: "Corte + barba", price: "18€" },
              { name: "Afeitado clásico a navaja", price: "10€" },
              { name: "Corte señora", price: "15€" },
              { name: "Tinte caballero", price: "15€" },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div style={{ padding: "8px 0" }}>
                  <DottedPrice name={s.name} price={s.price} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HERITAGE QUOTE */}
      <section style={{
        background: `linear-gradient(135deg, rgba(179,33,27,0.08), transparent), #0D0D0D`,
        padding: "100px clamp(20px,5vw,60px)", textAlign: "center",
        borderTop: "1px solid rgba(179,33,27,0.1)", borderBottom: "1px solid rgba(179,33,27,0.1)",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Reveal>
            <BarberPole height={50} width={8} style={{ margin: "0 auto 28px" }} />
            <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: "clamp(18px,4vw,26px)", color: "#F2EFEA", fontStyle: "italic", lineHeight: 1.7, marginBottom: 20 }}>
              "Llevo yendo a Antonio desde que era chaval. Mi padre iba, yo voy, y ahora llevo a mi hijo. Eso dice todo."
            </p>
            <div style={{ width: 30, height: 1, background: "#B3211B", margin: "0 auto 14px" }} />
            <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: 13, color: "rgba(242,239,234,0.35)" }}>Iñaki R. · Durango</div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0D0D0D", padding: "100px clamp(20px,5vw,60px)", textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(32px,7vw,56px)", color: "#F2EFEA", letterSpacing: 4, marginBottom: 14 }}>
            Pasa cuando quieras
          </h2>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 16, color: "rgba(242,239,234,0.4)", marginBottom: 36, fontStyle: "italic" }}>Sin cita, sin esperas. En el centro de Durango, como siempre.</p>
          <a href={TEL_LINK} style={{
            display: "inline-block", background: "#B3211B", color: "#F2EFEA",
            padding: "18px 48px", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18,
            letterSpacing: 4, textDecoration: "none",
          }}>Llamar ahora →</a>
        </Reveal>
      </section>
    </div>
  );
}

/* ═══════ PAGE: SERVICIOS ═══════ */
function PageServicios() {
  const cats = [
    { cat: "Caballero", items: [
      { name: "Corte clásico", price: "12€", desc: "A tijera o máquina. Lavado y acabado incluidos." },
      { name: "Corte degradado / fade", price: "14€", desc: "Degradado moderno con acabado limpio." },
      { name: "Corte + barba", price: "18€", desc: "El pack completo. Corte y arreglo de barba." },
      { name: "Solo barba (máquina)", price: "6€", desc: "Perfilado y recorte con máquina." },
      { name: "Afeitado clásico a navaja", price: "10€", desc: "Con toalla caliente, espuma y aftershave." },
      { name: "Tinte caballero", price: "15€", desc: "Color discreto para cubrir las canas." },
      { name: "Corte infantil (hasta 12 años)", price: "8€", desc: "Para los más pequeños." },
    ]},
    { cat: "Señora", items: [
      { name: "Corte señora", price: "15€", desc: "Corte y secado. Personalizado según tu pelo y rostro." },
      { name: "Lavar y marcar", price: "12€", desc: "Lavado con marcado o secado." },
      { name: "Tinte completo", price: "Desde 25€", desc: "Coloración completa con productos de calidad." },
      { name: "Mechas", price: "Desde 35€", desc: "Mechas clásicas o técnicas de iluminación." },
      { name: "Permanente", price: "Desde 30€", desc: "Ondulación permanente, rulos clásicos." },
      { name: "Recogido / peinado", price: "Desde 25€", desc: "Para ceremonias y eventos." },
    ]},
    { cat: "Extras", items: [
      { name: "Cejas (cera)", price: "4€", desc: "Depilación y diseño de cejas." },
      { name: "Mascarilla capilar", price: "8€", desc: "Tratamiento hidratante después del lavado." },
    ]},
  ];

  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", paddingTop: 100 }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 clamp(20px,5vw,60px) 80px" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <BarberPole height={40} width={8} />
            <div>
              <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, color: "#B3211B", letterSpacing: 4, marginBottom: 2 }}>CARTA DE PRECIOS</p>
              <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(32px,7vw,52px)", color: "#F2EFEA", letterSpacing: 3 }}>Servicios</h1>
            </div>
          </div>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 15, color: "rgba(242,239,234,0.4)", maxWidth: 450, lineHeight: 1.7, marginBottom: 52, fontStyle: "italic" }}>
            Precios del salón. Sin letra pequeña, sin sorpresas.
          </p>
        </Reveal>

        {cats.map((cat, ci) => (
          <div key={ci} style={{ marginBottom: 52 }}>
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, color: "#B3211B", letterSpacing: 4 }}>{cat.cat}</h2>
                <div style={{ flex: 1, height: 1, background: "rgba(179,33,27,0.2)" }} />
              </div>
            </Reveal>
            <div style={{ border: "1px solid rgba(242,239,234,0.06)", padding: "24px 24px 16px" }}>
              {cat.items.map((item, ii) => (
                <Reveal key={ii} delay={ii * 0.04}>
                  <div style={{ padding: "8px 0" }}>
                    <DottedPrice name={item.name} price={item.price} desc={item.desc} />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        ))}

        <Reveal>
          <div style={{ background: "rgba(179,33,27,0.08)", border: "1px solid rgba(179,33,27,0.15)", padding: 32, textAlign: "center" }}>
            <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: "#F2EFEA", letterSpacing: 2, marginBottom: 8 }}>
              Pasa sin cita. Estamos en el centro de Durango.
            </p>
            <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 14, color: "rgba(242,239,234,0.4)", marginBottom: 24, fontStyle: "italic" }}>Llama si quieres confirmar que hay sitio.</p>
            <a href={TEL_LINK} style={{
              background: "#B3211B", color: "#F2EFEA", padding: "14px 36px",
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: 3, textDecoration: "none",
            }}>Llamar: {TEL_DISPLAY}</a>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ═══════ PAGE: NOSOTROS ═══════ */
function PageNosotros() {
  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", paddingTop: 100 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 clamp(20px,5vw,60px) 80px" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
            <BarberPole height={40} width={8} />
            <div>
              <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, color: "#B3211B", letterSpacing: 4, marginBottom: 2 }}>QUIÉNES SOMOS</p>
              <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(32px,7vw,52px)", color: "#F2EFEA", letterSpacing: 3 }}>Nuestra historia</h1>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40, alignItems: "center", marginBottom: 72 }}>
            <div style={{
              width: "100%", aspectRatio: "3/4",
              background: `linear-gradient(135deg, rgba(179,33,27,0.12), rgba(13,13,13,0.9)), #1a1a1a`,
              border: "1px solid rgba(242,239,234,0.06)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
            }}>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, color: "rgba(179,33,27,0.3)", letterSpacing: 4 }}>AB</span>
              <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: 12, color: "rgba(242,239,234,0.2)", fontStyle: "italic" }}>Est. ~1990</span>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: "#F2EFEA", marginBottom: 16, letterSpacing: 2 }}>Más de 30 años en Durango</h2>
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 15, color: "rgba(242,239,234,0.5)", lineHeight: 1.8, marginBottom: 16 }}>
                Antonio Bueno lleva cortando pelo en Durango desde hace más de tres décadas. Lo que empezó como un joven aprendiz con vocación se ha convertido en la barbería de referencia del centro del pueblo.
              </p>
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 15, color: "rgba(242,239,234,0.5)", lineHeight: 1.8, marginBottom: 16 }}>
                Aquí han pasado abuelos, padres e hijos. Generaciones enteras que confían en las mismas manos para un corte limpio, un afeitado perfecto y una conversación de las de verdad.
              </p>
              <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 15, color: "rgba(242,239,234,0.5)", lineHeight: 1.8 }}>
                En una época de modas y cambios, Antonio sigue haciendo lo que mejor sabe: cuidar a su clientela con el mismo oficio y la misma honestidad de siempre.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: "#F2EFEA", marginBottom: 28, letterSpacing: 2 }}>Lo que nos define</h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { n: "I", title: "Oficio de verdad", text: "Más de 30 años perfeccionando cada corte. La experiencia no se improvisa." },
            { n: "II", title: "Trato de siempre", text: "Te conocemos por tu nombre. Aquí vienes a cortarte el pelo y a charlar." },
            { n: "III", title: "Sin artificios", text: "Precios justos, servicio honesto, resultado impecable. Así de simple." },
            { n: "IV", title: "Generaciones", text: "Abuelos, padres e hijos. La confianza que se hereda." },
          ].map((v, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ background: "rgba(242,239,234,0.02)", border: "1px solid rgba(242,239,234,0.06)", padding: 24 }}>
                <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: 24, color: "rgba(179,33,27,0.35)", fontWeight: 700 }}>{v.n}</span>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: "#F2EFEA", margin: "10px 0 6px", letterSpacing: 2 }}>{v.title}</h3>
                <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 13, color: "rgba(242,239,234,0.4)", lineHeight: 1.7 }}>{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════ PAGE: GALERÍA ═══════ */
function PageGaleria() {
  const [active, setActive] = useState("Todo");
  const cats = ["Todo", "Cortes", "Barba", "Clásico"];
  const photos = [
    { id: 1, cat: "Cortes", bg: "linear-gradient(135deg,#1a1510,#2a2018)", label: "Degradado limpio" },
    { id: 2, cat: "Barba", bg: "linear-gradient(135deg,#15100d,#25201a)", label: "Barba perfilada" },
    { id: 3, cat: "Clásico", bg: "linear-gradient(135deg,#1a1a18,#2a2a25)", label: "Corte ejecutivo" },
    { id: 4, cat: "Cortes", bg: "linear-gradient(135deg,#10151a,#1a2530)", label: "Pompadour moderno" },
    { id: 5, cat: "Barba", bg: "linear-gradient(135deg,#1a1412,#2a2420)", label: "Afeitado a navaja" },
    { id: 6, cat: "Clásico", bg: "linear-gradient(135deg,#18181a,#28282a)", label: "Corte a tijera clásico" },
    { id: 7, cat: "Cortes", bg: "linear-gradient(135deg,#12100e,#221e1a)", label: "Texturizado natural" },
    { id: 8, cat: "Barba", bg: "linear-gradient(135deg,#0e1215,#1a2025)", label: "Barba completa con toalla" },
    { id: 9, cat: "Clásico", bg: "linear-gradient(135deg,#1a1515,#2a2222)", label: "Peinado hacia atrás" },
  ];
  const filtered = active === "Todo" ? photos : photos.filter(p => p.cat === active);

  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", paddingTop: 100 }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 clamp(20px,5vw,60px) 80px" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <BarberPole height={40} width={8} />
            <div>
              <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, color: "#B3211B", letterSpacing: 4, marginBottom: 2 }}>NUESTRO TRABAJO</p>
              <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(32px,7vw,52px)", color: "#F2EFEA", letterSpacing: 3 }}>Galería</h1>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
            {cats.map(c => (
              <button key={c} onClick={() => setActive(c)} style={{
                background: active === c ? "#B3211B" : "rgba(242,239,234,0.04)",
                color: active === c ? "#F2EFEA" : "rgba(242,239,234,0.4)",
                border: active === c ? "none" : "1px solid rgba(242,239,234,0.08)",
                padding: "10px 22px", cursor: "pointer",
                fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 2,
                transition: "all 0.3s",
              }}>{c}</button>
            ))}
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.04}>
              <div style={{
                aspectRatio: i % 4 === 0 ? "3/4" : "1/1", background: p.bg,
                position: "relative", overflow: "hidden", cursor: "pointer",
                border: "1px solid rgba(242,239,234,0.06)",
                transition: "border-color 0.3s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(179,33,27,0.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(242,239,234,0.06)"}
              >
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", padding: "20px 14px 14px" }}>
                  <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 10, color: "#B3211B", letterSpacing: 2 }}>{p.cat}</span>
                  <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 14, color: "#F2EFEA", marginTop: 3 }}>{p.label}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 13, color: "rgba(242,239,234,0.3)", textAlign: "center", marginTop: 36, fontStyle: "italic" }}>
            Próximamente fotos reales del salón. Pasa a vernos.
          </p>
        </Reveal>
      </div>
    </div>
  );
}

/* ═══════ PAGE: CONTACTO ═══════ */
function PageContacto() {
  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", paddingTop: 100 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 clamp(20px,5vw,60px) 80px" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <BarberPole height={40} width={8} />
            <div>
              <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, color: "#B3211B", letterSpacing: 4, marginBottom: 2 }}>CONTACTO</p>
              <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(32px,7vw,52px)", color: "#F2EFEA", letterSpacing: 3 }}>Encuéntranos</h1>
            </div>
          </div>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 15, color: "rgba(242,239,234,0.4)", maxWidth: 450, lineHeight: 1.7, marginBottom: 56, fontStyle: "italic" }}>
            Pasa sin cita o llámanos. Estamos en el centro de Durango, donde siempre hemos estado.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 36, alignItems: "start" }}>
          {/* Main card */}
          <Reveal>
            <div style={{ border: "1px solid rgba(242,239,234,0.08)", padding: 32 }}>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: "#F2EFEA", letterSpacing: 2, marginBottom: 24 }}>Llámanos</h3>
              
              <a href={TEL_LINK} style={{
                display: "block", background: "#B3211B", color: "#F2EFEA",
                padding: "20px 24px", textDecoration: "none", marginBottom: 24,
                textAlign: "center", transition: "background 0.3s",
              }}
                onMouseEnter={e => e.target.style.background = "#d4382f"}
                onMouseLeave={e => e.target.style.background = "#B3211B"}
              >
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 10, letterSpacing: 3, marginBottom: 4, opacity: 0.7 }}>TELÉFONO</div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 3 }}>{TEL_DISPLAY}</div>
              </a>

              <div style={{ background: "rgba(242,239,234,0.03)", border: "1px solid rgba(242,239,234,0.06)", padding: 24, marginBottom: 20 }}>
                <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 14, color: "rgba(242,239,234,0.5)", fontStyle: "italic", lineHeight: 1.7 }}>
                  No usamos WhatsApp ni redes sociales. Aquí se viene en persona o se llama por teléfono. Como se ha hecho toda la vida.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BarberPole height={24} width={6} />
                <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 13, color: "rgba(242,239,234,0.35)" }}>Preferiblemente, pasa directamente por el salón.</p>
              </div>
            </div>
          </Reveal>

          {/* Info */}
          <Reveal delay={0.12}>
            <div>
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: "#F2EFEA", letterSpacing: 2, marginBottom: 14 }}>Dirección</h3>
                <div style={{ border: "1px solid rgba(242,239,234,0.06)", padding: 22 }}>
                  <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 15, color: "#F2EFEA", marginBottom: 4 }}>Centro de Durango</p>
                  <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 14, color: "rgba(242,239,234,0.4)", marginBottom: 14 }}>48200 Durango, Bizkaia</p>
                  <a href="https://www.google.com/maps/search/Peluqueria+Antonio+Bueno+Durango" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Source Serif 4',serif", fontSize: 13, color: "#B3211B", textDecoration: "none" }}>Ver en Google Maps →</a>
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: "#F2EFEA", letterSpacing: 2, marginBottom: 14 }}>Horario</h3>
                <div style={{ border: "1px solid rgba(242,239,234,0.06)", padding: 22 }}>
                  {[
                    { d: "Lunes", h: "9:00 – 13:30 / 16:00 – 19:30" },
                    { d: "Martes", h: "9:00 – 13:30 / 16:00 – 19:30" },
                    { d: "Miércoles", h: "9:00 – 13:30 / 16:00 – 19:30" },
                    { d: "Jueves", h: "9:00 – 13:30 / 16:00 – 19:30" },
                    { d: "Viernes", h: "9:00 – 13:30 / 16:00 – 19:30" },
                    { d: "Sábado", h: "8:30 – 13:30" },
                    { d: "Domingo", h: "Cerrado", c: true },
                  ].map((d, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 6 ? "1px solid rgba(242,239,234,0.04)" : "none" }}>
                      <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: 14, color: d.c ? "rgba(242,239,234,0.2)" : "#F2EFEA" }}>{d.d}</span>
                      <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: 13, color: d.c ? "rgba(242,239,234,0.2)" : "#B3211B" }}>{d.h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ border: "1px solid rgba(179,33,27,0.15)", background: "rgba(179,33,27,0.06)", padding: 20, textAlign: "center" }}>
                <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, color: "#B3211B", letterSpacing: 2, marginBottom: 4 }}>Sin cita previa</p>
                <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 13, color: "rgba(242,239,234,0.4)", fontStyle: "italic" }}>Pasa cuando te venga bien. Si hay cola, es corta.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* ═══════ FOOTER ═══════ */
function Footer({ navigate }) {
  return (
    <footer style={{ background: "#080806", borderTop: "1px solid rgba(179,33,27,0.1)", padding: "52px clamp(20px,5vw,60px) 24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 36, marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <BarberPole height={40} width={6} />
          <div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: "#F2EFEA", letterSpacing: 3, marginBottom: 4 }}>Antonio Bueno</div>
            <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 12, color: "rgba(242,239,234,0.3)", lineHeight: 1.7, fontStyle: "italic" }}>Barbería clásica en Durango desde hace más de 30 años.</p>
          </div>
        </div>
        <div>
          <h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, color: "#B3211B", letterSpacing: 3, marginBottom: 14 }}>Páginas</h4>
          {["inicio", "servicios", "nosotros", "galeria", "contacto"].map(p => (
            <button key={p} onClick={() => navigate(p)} style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontFamily: "'Source Serif 4',serif", fontSize: 13, color: "rgba(242,239,234,0.4)", marginBottom: 6, textTransform: "capitalize", padding: 0 }}>{p === "galeria" ? "Galería" : p}</button>
          ))}
        </div>
        <div>
          <h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, color: "#B3211B", letterSpacing: 3, marginBottom: 14 }}>Contacto</h4>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 13, color: "rgba(242,239,234,0.4)", marginBottom: 6 }}>Centro de Durango</p>
          <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 13, color: "rgba(242,239,234,0.4)", marginBottom: 6 }}>48200 Bizkaia</p>
          <a href={TEL_LINK} style={{ fontFamily: "'Source Serif 4',serif", fontSize: 13, color: "#B3211B", textDecoration: "none" }}>{TEL_DISPLAY}</a>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(242,239,234,0.04)", paddingTop: 18, textAlign: "center" }}>
        <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 11, color: "rgba(242,239,234,0.15)" }}>© 2026 Peluquería Antonio Bueno · Durango, Bizkaia</p>
      </div>
    </footer>
  );
}

/* ═══════ APP ═══════ */
export default function App() {
  const { page, navigate } = useRouter();
  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />
      <Header page={page} navigate={navigate} />
      {page === "inicio" && <PageInicio navigate={navigate} />}
      {page === "servicios" && <PageServicios />}
      {page === "nosotros" && <PageNosotros />}
      {page === "galeria" && <PageGaleria />}
      {page === "contacto" && <PageContacto />}
      <Footer navigate={navigate} />
    </div>
  );
}
