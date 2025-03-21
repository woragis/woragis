import { css } from '@emotion/react'

export const styles = css`
  :root {
    /* Background Colors */
    --bg-primary: #f8f9fa;
    --bg-secondary: #e9ecef;
    --bg-tertiary: #dee2e6;

    /* Text Colors */
    --text-primary: #212529;
    --text-secondary: #495057;
    --text-muted: #6c757d;

    /* Accent Colors */
    --accent-primary: #0d6efd;
    --accent-secondary: #6c757d;
    --accent-tertiary: #198754;

    /* Border Colors */
    --border-light: #ced4da;
    --border-dark: #adb5bd;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      /* Dark Mode Background Colors */
      --bg-primary: #121212;
      --bg-secondary: #1e1e1e;
      --bg-tertiary: #2c2c2c;

      /* Dark Mode Text Colors */
      --text-primary: #f8f9fa;
      --text-secondary: #dee2e6;
      --text-muted: #adb5bd;

      /* Dark Mode Accent Colors */
      --accent-primary: #539bf5;
      --accent-secondary: #868e96;
      --accent-tertiary: #25a65b;

      /* Dark Mode Border Colors */
      --border-light: #3a3f45;
      --border-dark: #6c757d;
    }
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }
  body {
    scroll-behavior: smooth;
  }
`
