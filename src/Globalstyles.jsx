import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', sans-serif;
    background-color: #0f172a; /* fundo escuro elegante */
    color: #f1f5f9;
    -webkit-font-smoothing: antialiased;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }

  input, textarea, select {
    outline: none;
    border: none;
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul {
    list-style: none;
  }
`;

export default GlobalStyles;