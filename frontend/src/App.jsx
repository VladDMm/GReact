// import { useState, useEffect } from "react";
// import "./App.css"; // Importă stilurile
// function App() {
//   const [produse, setProduse] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [expanded, setExpanded] = useState({});
//   const [showScrollBtn, setShowScrollBtn] = useState(false);
//   const [lastUpdate, setLastUpdate] = useState(0);
//   const backendURL = "http://192.168.112.175:5000/api/products";
//   useEffect(() => {
//     fetchProduse();
//     window.addEventListener("scroll", handleScroll);
//     const interval = setInterval(fetchProduse, 50000);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       clearInterval(interval);
//     };
//   }, []);
//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };
//   const handleScroll = () => {
//     setShowScrollBtn(window.scrollY > 300); // Afișează butonul după 300px de scroll
//   };
//   // async function fetchLastUpdate() {
//   //   try {
//   //     const response = await fetch(`${backendURL}/last-update`);
//   //     const data = await response.json();
//   //     return data.timestamp;
//   //   } catch (error) {
//   //     console.error("Eroare la verificarea actualizărilor:", error);
//   //     return lastUpdate;
//   //   }
//   // }
//   // async function fetchProduse(forceUpdate = false) {
//   //   try {
//   //     let cachedData = localStorage.getItem("produse");
//   //     let cachedTimestamp = Number(localStorage.getItem("lastUpdate")) || 0;
//   //     if (cachedData && !forceUpdate) {
//   //       setProduse(JSON.parse(cachedData));
//   //       setLastUpdate(cachedTimestamp);
//   //     }
//   //     const newUpdate = await fetchLastUpdate();
//   //     if (newUpdate <= lastUpdate && !forceUpdate) return;
//   //     console.log("🔄 Date noi găsite, actualizăm produsele...");
//   //     const url = searchTerm
//   //       ? `${backendURL}?search=${encodeURIComponent(searchTerm)}`
//   //       : backendURL;
//   //     const response = await fetch(url);
//   //     const data = await response.json();
//   //     let newProduse = data.map(produs => ({
//   //       ...produs,
//   //       expanded: expanded[produs.pa_id] || false
//   //     }));
//   //     setProduse(newProduse);
//   //     localStorage.setItem("produse", JSON.stringify(newProduse));
//   //     localStorage.setItem("lastUpdate", newUpdate);
//   //     setLastUpdate(newUpdate);
//   //   } catch (error) {
//   //     console.error("Eroare la preluarea produselor:", error);
//   //   }
//   // }
//   async function fetchLastUpdate() {
//   try {
//     const response = await fetch(`${backendURL}/last-update`);
//     const data = await response.json();
//     return data.timestamp;
//   } catch (error) {
//     console.error("Eroare la verificarea actualizărilor:", error);
//     return lastUpdate;
//   }
// }
// async function fetchProduse(forceUpdate = false) {
//   try {
//     let cachedData = localStorage.getItem("produse");
//     let cachedTimestamp = Number(localStorage.getItem("lastUpdate")) || 0;
//     if (cachedData && !forceUpdate) {
//       setProduse(JSON.parse(cachedData));
//       setLastUpdate(cachedTimestamp);
//     }
//     const newUpdate = await fetchLastUpdate();
//     if (newUpdate <= lastUpdate && !forceUpdate) return;
//     console.log("🔄 Date noi găsite, actualizăm produsele...");
//     const url = searchTerm
//       ? `${backendURL}?search=${encodeURIComponent(searchTerm)}`
//       : backendURL;
//     const response = await fetch(url);
//     const data = await response.json();
//     let newProduse = data.map(produs => ({
//       ...produs,
//       expanded: expanded[produs.pa_id] || false
//     }));
//     setProduse(newProduse);
//     localStorage.setItem("produse", JSON.stringify(newProduse));
//     localStorage.setItem("lastUpdate", newUpdate); // Actualizează timestamp-ul
//     setLastUpdate(newUpdate);
//   } catch (error) {
//     console.error("Eroare la preluarea produselor:", error);
//   }
// }
//   const toggleExpand = (id) => {
//     setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
//   };
//   const handleSearch = (e) => {
//     const term = e.target.value;
//     setSearchTerm(term);
//     setTimeout(() => {
//       setProduse(JSON.parse(localStorage.getItem("produse") || "[]").filter(produs =>
//         produs.a_marca_model.toLowerCase().includes(term.toLowerCase()) ||
//         produs.cod.toLowerCase().includes(term.toLowerCase())
//       ));
//     }, 300);
//   };
//   return (
//     <div>
//       <input
//         type="text"
//         className="search-bar"
//         value={searchTerm}
//         placeholder="🔍 Caută produs..."
//         onChange={handleSearch}
//         onClick={() => {
//           setSearchTerm(""); // Resetează bara de căutare
//           setProduse(JSON.parse(localStorage.getItem("produse") || "[]")); // Resetează lista la produsele inițiale
//         }}
//       />
//       {produse.length > 0 ? (
//         <ul>
//           {produse.map(produs => (
//             <li 
//               key={produs.pa_id}
//               className={expanded[produs.pa_id] ? "expanded" : ""}
//               onClick={() => toggleExpand(produs.pa_id)}
//               onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleExpand(produs.pa_id); }}
//               tabIndex="0"
//             >
//               <strong>{produs.a_marca_model}</strong> - {produs.cod}
//               {expanded[produs.pa_id] && (
//                 <div className="extra-info">
//                   <p>Celula: {produs.nume_celula}</p>
//                   <p>Stoc: {produs.p_count}</p>
//                   <p>Preț: {produs.p_price} MDL</p>
//                   <p>{produs.is_updated}</p>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p style={{ textAlign: "center" }}>⏳ Se încarcă produsele...</p>
//       )}
// {showScrollBtn && (
//   <button 
//     id="scrollTopBtn" 
//     onClick={scrollToTop}
//     style={{ opacity: 1, pointerEvents: "auto" }} // Stiluri inline pentru a face butonul vizibil
//   >
//     ↑
//   </button>
// )}
//     </div>
//   );
// }
// export default App;


import { useState, useEffect } from "react";
import "./App.css"; // Importă stilurile

function App() {
  const [produse, setProduse] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [lastUpdate, setLastUpdate] = useState(0);
  const [popupProduct, setPopupProduct] = useState(null); // State pentru detaliile produsului selectat
  const backendURL = "http://192.168.15.254:5000/api/products";
 
  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
      return lastUpdate;
    }
  }

  async function fetchProduse(forceUpdate = false) {
    try {
      let cachedData = localStorage.getItem("produse");
      let cachedTimestamp = Number(localStorage.getItem("lastUpdate")) || 0;

      if (cachedData && !forceUpdate) {
        setProduse(JSON.parse(cachedData));
        setLastUpdate(cachedTimestamp);
      }

      const newUpdate = await fetchLastUpdate();
      if (newUpdate <= lastUpdate && !forceUpdate) return;

      console.log("🔄 Date noi găsite, actualizăm produsele...");
      const url = searchTerm
        ? `${backendURL}?search=${encodeURIComponent(searchTerm)}`
        : backendURL;

      const response = await fetch(url);
      const data = await response.json();

      let newProduse = data.map(produs => ({
        ...produs,
        expanded: expanded[produs.pa_id] || false
      }));

      setProduse(newProduse);
      localStorage.setItem("produse", JSON.stringify(newProduse));
      localStorage.setItem("lastUpdate", newUpdate);
      setLastUpdate(newUpdate);
    } catch (error) {
      console.error("Eroare la preluarea produselor:", error);
    }
  }

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setTimeout(() => {
      setProduse(JSON.parse(localStorage.getItem("produse") || "[]").filter(produs =>
        produs.a_marca_model.toLowerCase().includes(term.toLowerCase()) ||
        produs.cod.toLowerCase().includes(term.toLowerCase())
      ));
    }, 300);
  };

  const showPopup = (produs) => {
    setPopupProduct(produs);  // Setează produsul în starea popupProduct
  };

  const closePopup = () => {
    setPopupProduct(null);
  };

  return (
    <div>
      <input
        type="text"
        className="search-bar"
        value={searchTerm}
        placeholder="🔍 Caută produs..."
        onChange={handleSearch}
        onClick={() => {
          setSearchTerm(""); // Resetează bara de căutare
          setProduse(JSON.parse(localStorage.getItem("produse") || "[]")); // Resetează lista la produsele inițiale
        }}
      />

      {produse.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Marca / Model</th>
              <th>Celula</th>
              <th>Stoc</th>
              <th>Preț</th>
              <th>Preț Actualizat</th>
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
          <div className="popup-overlay show" onClick={closePopup}></div> {/* Fundalul semi-transparent */}
          <div id="popup" className="popup show">
            <h2 id="popupTitle">{popupProduct.a_marca_model}</h2>
            <p><strong>Cod produs:</strong> {popupProduct.cod}</p>
            <p><strong>Stoc:</strong> {popupProduct.p_count}</p>
            <p><strong>Preț:</strong> {popupProduct.p_price} MDL</p>
            <p><strong>Pret Actualizat?</strong> {popupProduct.is_updated}</p>
            <button onClick={closePopup}>Închide</button>
          </div>
        </>
      )}


      {showScrollBtn && (
        <button
          id="scrollTopBtn"
          onClick={scrollToTop}
          style={{ opacity: 1, pointerEvents: "auto" }} // Stiluri inline pentru a face butonul vizibil
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default App;
