import React from "react";

function Container({ children }) {
  return (
    <div style={{ width: "100%", maxWidth: "1600px", margin: "auto" }}>
      {children}
    </div>
  );
}

export default Container;
