export const Logo = () => {
	return (
		<div id="logo" className="mb-5 mt-2 text-center flex-column d-flex" style={{
			width: "fit-content"
		}}>
			<span id="newe" className="mb-0" style={{
				color: "white",
				fontSize: "40px",
				fontWeight: "700"
			}}>
				Newe
			</span>
			<span id="logistica" style={{
				marginTop: "-10px",
				fontSize: "10px",
				fontWeight: "700",
				color: "white"
			}}>
				Logistíca Integrada
			</span>
		</div>
	)
}

export const LogoMobile = () => {
  return (
    <div 
      id="logo-mobile" 
      className="text-center flex-column d-flex mb-4 mt-5"
      style={{
        width: "fit-content",
        margin: "0 auto", 
        zIndex: 2,
        position: 'relative'
      }}
    >
      <span 
        className="mb-0" 
        style={{
            color: "white",
            fontSize: "100px", 
            fontWeight: "700",
            lineHeight: "1",
            fontFamily: "Poppins, sans-serif"
        }}
      >
        Newe
      </span>
      
      <span 
        style={{
            marginTop: "-5px",
            fontSize: "20px",
            fontWeight: "700",
            color: "white",
            letterSpacing: "1px"
        }}
      >
        Logistíca Integrada
      </span>
    </div>
  )
}