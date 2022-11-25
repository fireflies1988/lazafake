import React from "react";
import Container from "../Container";
import { StyledContent } from "./styled";

function Content({ children }) {
  return (
    <StyledContent>
      <Container>{children}</Container>
    </StyledContent>
  );
}

export default Content;
