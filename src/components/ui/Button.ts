import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

const buttonAnimation = keyframes`
  to {
    transform: rotate(360deg);
  }
`
export const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 30px;
  font-size: 16px;
  color: var(--text-primary);
  gap: 10px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  min-width: 40%;
  background: transparent;
  position: relative;
  z-index: 1;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    height: 500px;
    width: 110%;
    border-radius: 50px;
    background: linear-gradient(
      230deg,
      var(--accent-primary),
      var(--bg-primary)
    );
  }
  &:hover {
    &::before {
      animation: ${buttonAnimation} 500ms infinite linear;
    }
  }
`
