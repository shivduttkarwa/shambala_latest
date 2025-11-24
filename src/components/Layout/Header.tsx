import React from "react";
import { StaggeredMenu } from "./StaggeredMenu";
import { SiteSettings } from "../../services/api";

interface HeaderProps {
  settings: SiteSettings | null;
}

const Header: React.FC<HeaderProps> = ({ settings }) => {
  const publicUrl = import.meta.env.BASE_URL || "/";

  function normPath(path: string) {
    if (!path) return publicUrl;
    if (path === "/") return publicUrl;
    if (path.startsWith("/")) {
      // avoid double-slash
      return publicUrl.endsWith("/")
        ? publicUrl + path.slice(1)
        : publicUrl + path;
    }
    return path;
  }

  // Debug: Log the paths being generated
  console.log('🔍 DEBUG Menu paths:', {
    publicUrl,
    homeLink: normPath("/"),
    projectsLink: normPath("/projects"),
    servicesLink: normPath("/services"),
    aboutLink: normPath("/about"),
    contactLink: normPath("/#contact"),
  });

  // Fixed menu items with proper routing
  const menuItems = [
    {
      label: "HOME",
      ariaLabel: "Go to home page",
      link: normPath("/"),
    },
    {
      label: "PROJECTS",
      ariaLabel: "View our projects",
      link: normPath("/projects"),
    },
    {
      label: "SERVICES",
      ariaLabel: "View our services",
      link: normPath("/services"),
    },
    {
      label: "ABOUT",
      ariaLabel: "Learn about us",
      link: normPath("/about"),
    },
    {
      label: "CONTACT US",
      ariaLabel: "Get in touch",
      link: normPath("/#contact"),
    },
  ];

  return (
    <StaggeredMenu
      position="left"
      items={menuItems}
      logoText="Shambala Homes"
      logoAlt="Shambala Homes"
      displayItemNumbering={true}
      menuButtonColor="#2C2C2C"
      openMenuButtonColor="#FAF8F3"
      changeMenuColorOnOpen={true}
      colors={["#5B7C4F", "#2C2C2C"]}
      accentColor="#5B7C4F"
      isFixed={true}
      onMenuOpen={() => {}}
      onMenuClose={() => {}}
    />
  );
};

export default Header;
