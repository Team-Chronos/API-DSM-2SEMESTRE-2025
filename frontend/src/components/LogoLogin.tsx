export const Logo = () => {
    return (
      <div id="logo" className="mb-5 mt-2 ms-2 text-center flex-column d-flex" style={{
              width: "fit-content"
      }}>
              <span id="newe" className="mb-0" style={{
                  color: "var(--azul)",
                  fontSize: "200px",
                  fontWeight: "700",
                  letterSpacing: "-10px",
                  
              }}>
                  Newe
              </span>
              <span id="logistica" style={{
                  marginTop: "-70px",
                  fontSize: "40px",
                  fontWeight: "700",
                  color: "gray"
              }}>
                  Logistíca Integrada
              </span>
      </div>
    )
  }