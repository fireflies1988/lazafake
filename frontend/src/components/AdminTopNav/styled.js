import styled from "styled-components";

export const StyledAdminTopNav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1;
  width: 100%;
  background-image: linear-gradient(#389e0d, #95de64);
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 2rem;

  .logo {
    color: white;
    font-family: "Nunito", sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;
