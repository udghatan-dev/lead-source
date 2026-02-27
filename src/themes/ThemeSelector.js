import React from 'react';

import Preloader from './../Components/Loaders/Preloader';
/**
 * The theme components only imports it's theme CSS-file. These components are lazy
 * loaded, to enable "code splitting" (in order to avoid the themes being bundled together)
 */
// const MaterialTheme = React.lazy(() => import("./MaterialApp.js"));
// const MinimalTheme = React.lazy(() => import("./MinimalApp.js"));
// const SaaSTheme = React.lazy(() => import("./SaaSApp.js"));
// const CreativeTheme = React.lazy(() => import("./CreativeApp.js"));
// const ModernTheme = React.lazy(() => import("./ModernApp.js"));
// const InteractiveTheme = React.lazy(() => import("./InteractiveApp.js"));
// const DefaultTheme = React.lazy(() => import("./DefaultApp.js"));

const ThemeSelector = ({ data, children }) => {
  const [loading, setLoading] = React.useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 1000);

  return (
    <>
      {/* Conditionally render theme, based on the current client context */}
      {/* <React.Suspense fallback={() => null}>
        {data === "minimal" && <MinimalTheme />}
        {data === "material" && <MaterialTheme />}
        {data === "saas" && <SaaSTheme />}
        {data === "creative" && <CreativeTheme />}
        {data === "modern" && <ModernTheme />}
        {data === "interactive" && <InteractiveTheme />}
        {data === "default" && <DefaultTheme />}
      </React.Suspense> */}
      {/* Render children immediately! */}
      {!loading ? children : <Preloader />}
    </>
  );
};

export default ThemeSelector;
