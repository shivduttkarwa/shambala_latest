import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components/Layout";
import HomePage from "./pages/HomePage";
import HouseDesignsRoute from "./pages/HouseDesignsRoute";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ServicePage from "./components/Services/ServicePage";
import { useSiteSettings } from "./hooks/useSiteSettings";
import ScrollToTop from "./components/UI/ScrollToTop";

function App() {
  const { settings } = useSiteSettings();

  return (
    <>
      <Router basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <div className="App">
          <Header settings={settings} />
          <main>
            <Routes>
              <Route path="/" element={<HomePage settings={settings} />} />
              <Route path="/house-designs" element={<HouseDesignsRoute />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/services" element={<ServicePage />} />
              <Route
                path="/projects/:projectId"
                element={<ProjectDetailPage />}
              />
              <Route path="/blog" element={<div>Blog page coming soon</div>} />
              <Route path="/contact" element={<div>Contact page coming soon</div>} />
            </Routes>
          </main>
          <Footer settings={settings} />
        </div>
      </Router>
    </>
  );
}

export default App;
