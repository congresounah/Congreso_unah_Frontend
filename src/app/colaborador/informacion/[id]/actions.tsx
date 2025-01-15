export const isTokenValid = (token: string): boolean => {
    try {
        // Divide el token y decodifica el payload
        const parts = token.split(".");
        if (parts.length !== 3) {
            throw new Error("Formato de token inválido");
        }

        const payload = JSON.parse(atob(parts[1]));

        // Verifica el rol del usuario
        if (payload.tipo_usuario === "organizador") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error al procesar el token:", error);
        return false;
    }
}



/*     const processToken = () => {
        const token = Cookies.get("authToken");
    
        if (token) {
          try {
            // Divide el token y decodifica el payload
            const parts = token.split(".");
            if (parts.length !== 3) {
              throw new Error("Formato de token inválido");
            }
    
            const payload = JSON.parse(atob(parts[1]));
    
            // Verifica el rol del usuario
            if (payload.tipo_usuario === "colaborador") {
              setTokenValido(true);
            } else {
              setTokenValido(false);
            }
          } catch (error) {
            setTokenValido(false);
            console.error("Error al procesar el token:", error);
          }
        } else {
          setTokenValido(false);
        }
      }; */