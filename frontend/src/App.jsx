import { useState, useEffect } from "react";
import "./App.css"; // Importă stilurile

function App() {
  const [produse, setProduse] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [lastUpdate, setLastUpdate] = useState(0); // Define state for lastUpdate
  const [popupProduct, setPopupProduct] = useState(null); // State pentru detaliile produsului selectat

  // const backendURL = "http://172.16.4.99:4001/api/products";
  const backendURL = "http://95.65.99.175:4001/api/products"; 
  useEffect(() => {
    fetchProduse();
    window.addEventListener("scroll", handleScroll);
    const interval = setInterval(fetchProduse, 50000);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };

  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = () => {
    setShowScrollBtn(window.scrollY > 300); // Afișează butonul după 300px de scroll
  };

  async function fetchLastUpdate() {
    try {
      const response = await fetch(`${backendURL}/last-update`);
      const data = await response.json();
      return data.timestamp;
    } catch (error) {
      console.error("Eroare la verificarea actualizărilor:", error);
      return 0; // dacă există o eroare, consideri că nu există update-uri
    }
  }

  async function fetchProduse(forceUpdate = false) {
    try {
      let cachedData = localStorage.getItem("produse");
      let cachedTimestamp = Number(localStorage.getItem("lastUpdate")) || 0;

      // Dacă sunt date în cache și nu cerem actualizare forțată, le folosim
      if (cachedData && !forceUpdate) {
        setProduse(JSON.parse(cachedData));
        setLastUpdate(cachedTimestamp);
      }

      // Verificăm ultima actualizare din baza de date
      const newUpdate = await fetchLastUpdate();

      // Dacă timestamp-ul nu s-a schimbat și nu cerem actualizare forțată, nu facem nimic
      if (newUpdate <= cachedTimestamp && !forceUpdate) return;

      console.log("🔄 Date noi găsite, actualizăm produsele...");

      // Dacă există un termen de căutare, aplicăm filtrul
      const url = searchTerm
        ? `${backendURL}?search=${encodeURIComponent(searchTerm)}`
        : backendURL;

      // Preluăm datele de la server
      const response = await fetch(url);
      const data = await response.json();

      // Procesăm datele noi
      let newProduse = data.map(produs => ({
        ...produs,
        expanded: expanded[produs.pa_id] || false
      }));

      // Setăm datele în starea aplicației și le salvăm în localStorage
      setProduse(newProduse);
      localStorage.setItem("produse", JSON.stringify(newProduse));
      localStorage.setItem("lastUpdate", newUpdate);  // Salvăm timestamp-ul actualizat
      setLastUpdate(newUpdate);  // Actualizăm variabila de stocare
    } catch (error) {
      console.error("Eroare la preluarea produselor:", error);
    }
  }

  // eslint-disable-next-line no-unused-vars
  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Căutăm și aplicăm filtrul produselor
    setTimeout(() => {
      const filteredProduse = JSON.parse(localStorage.getItem("produse") || "[]").filter(produs =>
        produs.a_marca_model.toLowerCase().includes(term.toLowerCase()) ||
        produs.cod.toLowerCase().includes(term.toLowerCase())
      );

      setProduse(filteredProduse);

      // Muta tabelul sus doar dacă există produse
      const tabel = document.querySelector("table");
      if (tabel && filteredProduse.length > 0) {
        tabel.scrollIntoView({ block: "start" });
      }
    }, 300);


  };

  const showPopup = (produs) => {
    setPopupProduct(produs);  // Setează produsul în starea popupProduct
  };

  const closePopup = () => {
    setPopupProduct(null);
  };
  // cea mai buna varianta
  // useEffect(() => {
  //   const searchBar = document.querySelector('.search-bar');
  //   if (!searchBar) return;

  //   // Optimizează performanța modificărilor
  //   searchBar.style.willChange = "bottom, transform";

  //   const updatePosition = () => {
  //     if (!window.visualViewport) return;

  //     // Obținem măsurătorile actuale
  //     const viewportHeight = window.visualViewport.height;
  //     const viewportOffsetTop = window.visualViewport.offsetTop || 0;
  //     const keyboardHeight = window.innerHeight - (viewportHeight + viewportOffsetTop);

  //     // Setăm stilurile de poziționare
  //     searchBar.style.position = "fixed";
  //     searchBar.style.left = "0";
  //     searchBar.style.width = "100%";
  //     searchBar.style.zIndex = "10";
  //     searchBar.style.transition = "bottom 0s linear, transform 0s linear";

  //     if (keyboardHeight > 0) {
  //       // Când tastatura este deschisă, bara se poziționează deasupra acesteia
  //       searchBar.style.bottom = `${keyboardHeight}px`;
  //       searchBar.style.transform = "none";  // eliminăm transformările
  //     } else {
  //       // Când tastatura este închisă, bara rămâne fixată la bază
  //       searchBar.style.bottom = "0px";
  //       searchBar.style.transform = "none";
  //     }
  //   };

  //   // Ascultăm evenimentele de modificare a viewport-ului și de scroll
  //   window.visualViewport.addEventListener("resize", updatePosition);
  //   window.visualViewport.addEventListener("scroll", updatePosition);
  //   window.addEventListener("scroll", updatePosition);

  //   // Dacă ai un input în interiorul barei (ex: '.search-bar input'), ascultă și focus/blur
  //   const searchInput = document.querySelector('.search-bar input');
  //   if (searchInput) {
  //     searchInput.addEventListener("focus", updatePosition);
  //     searchInput.addEventListener("blur", updatePosition);
  //   }

  //   // Actualizare inițială
  //   updatePosition();

  //   return () => {
  //     window.visualViewport.removeEventListener("resize", updatePosition);
  //     window.visualViewport.removeEventListener("scroll", updatePosition);
  //     window.removeEventListener("scroll", updatePosition);
  //     if (searchInput) {
  //       searchInput.removeEventListener("focus", updatePosition);
  //       searchInput.removeEventListener("blur", updatePosition);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   const searchBar = document.querySelector('.search-bar');
  //   if (!searchBar) return;

  //   // Setări CSS definitive pentru elementul fix
  //   searchBar.style.position = "fixed";
  //   searchBar.style.left = "0";
  //   searchBar.style.width = "100%";
  //   searchBar.style.zIndex = "10";
  //   // Folosim transform pentru animații mai fluide (GPU accelerated)
  //   searchBar.style.willChange = "transform";
  //   // Eliminăm tranzițiile pentru update-uri imediate
  //   searchBar.style.transition = "transform 0s ease-in-out";

  //   // Variabilă pentru throttling
  //   let ticking = false;

  //   // Funcția care actualizează poziția barei
  //   const updatePosition = () => {
  //     if (!window.visualViewport) return;

  //     const viewportHeight = window.visualViewport.height;
  //     const viewportOffsetTop = window.visualViewport.offsetTop || 0;
  //     const keyboardHeight = window.innerHeight - (viewportHeight + viewportOffsetTop);

  //     /*
  //       Folosim transform: translateY pentru a deplasa bara sus, 
  //       echivalentul unei modificări de bottom, dar cu performanță îmbunătățită.
  //     */
  //     if (keyboardHeight > 0) {
  //       searchBar.style.transform = `translateY(-${keyboardHeight}px)`;
  //     } else {
  //       searchBar.style.transform = `translateY(0)`;
  //     }

  //     ticking = false;
  //   };

  //   // Wrapper care folosește requestAnimationFrame pentru a limita frecvența actualizărilor
  //   const onScrollOrResize = () => {
  //     if (!ticking) {
  //       ticking = true;
  //       requestAnimationFrame(updatePosition);
  //     }
  //   };

  //   // Ascultăm evenimentele pe viewport-ul vizual, care sunt optimizate pentru mobile
  //   window.visualViewport.addEventListener("resize", onScrollOrResize, { passive: true });
  //   window.visualViewport.addEventListener("scroll", onScrollOrResize, { passive: true });
  //   // Dacă observi că adăugarea evenimentului scroll pe window interferează, poți comenta linia de mai jos:
  //    window.addEventListener("scroll", onScrollOrResize, { passive: true });

  //   // Dacă bara are un input pentru căutare, ascultăm focus/blur pentru actualizare rapidă
  //   const searchInput = document.querySelector('.search-bar input');
  //   if (searchInput) {
  //     searchInput.addEventListener("focus", onScrollOrResize, { passive: true });
  //     searchInput.addEventListener("blur", onScrollOrResize, { passive: true });
  //   }

  //   // Actualizare inițială
  //   updatePosition();

  //   return () => {
  //     window.visualViewport.removeEventListener("resize", onScrollOrResize);
  //     window.visualViewport.removeEventListener("scroll", onScrollOrResize);
  //     // Dacă ai adăugat și evenimentul scroll pe window, nu uita să-l ștergi:
  //      window.removeEventListener("scroll", onScrollOrResize);
  //     if (searchInput) {
  //       searchInput.removeEventListener("focus", onScrollOrResize);
  //       searchInput.removeEventListener("blur", onScrollOrResize);
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const searchBar = document.querySelector('.search-bar');
    if (!searchBar || !window.visualViewport) return;
    
    searchBar.style.position = "fixed";
    searchBar.style.left = "0";
    searchBar.style.width = "100%";
    searchBar.style.zIndex = "10";
    searchBar.style.transition = "none";
  
    let currentKeyboardHeight = 0;
    const SMOOTHING_FACTOR = 0.1; // Cu cât este mai mic, cu atât mișcarea va fi mai lină
  
    const updatePosition = () => {
      const offsetTop = window.visualViewport.offsetTop || 0;
      const targetKeyboardHeight = window.innerHeight - (window.visualViewport.height + offsetTop);
      
      // Interpolare liniară pentru a netezi modificările:
      currentKeyboardHeight += SMOOTHING_FACTOR * (targetKeyboardHeight - currentKeyboardHeight);
      
      const displayHeight = currentKeyboardHeight > 0
        ? `translateY(-${currentKeyboardHeight}px)`
        : "translateY(0)";
      searchBar.style.transform = displayHeight;
      
      requestAnimationFrame(updatePosition);
    };
  
    updatePosition();
  
    return () => {
    };
  }, []);
  
  return (
    <div>
      {<input
        type="text"
        className="search-bar"
        value={searchTerm}
        placeholder="🔍 Caută produs..."
        onChange={handleSearch}
        onClick={() => {
          setSearchTerm("");
          setProduse(JSON.parse(localStorage.getItem("produse") || "[]")); // Resetează lista la produsele inițiale
        }}
      />
      }


      {produse.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Marca / Model</th>
              <th>Celula</th>
              <th>Stoc</th>
              <th>Preț</th>
              <th>Stare preț</th>
            </tr>
          </thead>
          <tbody>
            {produse.map(produs => (
              <tr
                key={produs.pa_id}
                onClick={() => showPopup(produs)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") showPopup(produs); }}
                tabIndex="0"
              >
                <td><strong>{produs.a_marca_model} {produs.cod}</strong></td>
                <td>{produs.nume_celula}</td>
                <td>{produs.p_count}</td>
                <td>{produs.p_price} MDL</td>
                <td>{produs.is_updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center" }}>⏳ Se încarcă produsele...</p>
      )}

      {popupProduct && (
        <>
          <div className="popup-overlay show" onClick={closePopup}></div> { }
          <div id="popup" className="popup show">
            <h2 id="popupTitle">{popupProduct.a_marca_model}</h2>
            <p><strong>Cod produs:</strong> {popupProduct.cod}</p>
            <p><strong>Stoc:</strong> {popupProduct.p_count}</p>
            <p><strong>Preț:</strong> {popupProduct.p_price} MDL</p>
            <p><strong>Stare preț:</strong> {popupProduct.is_updated}</p>
            <button onClick={closePopup}>Închide</button>
          </div>
        </>
      )}


      {showScrollBtn && (
        <button
          id="scrollTopBtn"
          onClick={scrollToTop}
          style={{ opacity: 1, pointerEvents: "auto" }}
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default App;