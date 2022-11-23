import React from "react";
import { StyledContent } from "./styled";

function Content({ children }) {
  return (
    <StyledContent>
      <div className="container">{children}</div>
    </StyledContent>
  );
}

export default Content;
