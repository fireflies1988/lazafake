import styled from "styled-components";

export const StyledTopNav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1;
  width: 100%;
  background-image: linear-gradient(#389e0d, #95de64);
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;

  .container {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .logo {
    color: white;
    font-family: "Nunito", sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;
