import styled from '@emotion/styled'
import { FaCircleCheck } from 'react-icons/fa6'

export const Certificate = styled.li`
  width: 500px;
  height: 120px;
  border: 1px solid;
  display: grid;
  grid-template-columns: 100px 1fr;
  justify-content: stretch;
  align-items: center;
  padding: 10px 30px;
  gap: 20px;
  border-radius: 20px;
  background-color: var(--bg-primary);
  color: var(--text-secondary);
  position: relative;
`

interface CompletedProps {
  completed: boolean
}
export const Completed = styled(FaCircleCheck)<CompletedProps>`
  color: ${(_) => (_.completed ? 'green' : 'var(--text-muted)')};
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 1.4rem;
`

export const CertificateImg = styled.figure`
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  border-radius: 20px;

  img {
    width: 100%;
    height: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    object-fit: cover;
  }

  a {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    color: transparent;
    bottom: -100%;
    left: 0;
    width: 100%;
    height: 50%;
    font-weight: bold;
    text-decoration: none;
    letter-spacing: 2px;
    gap: 3px;
    transition: 200ms;

    &:hover {
      text-decoration: underline 2px;
    }
  }

  &:hover {
    a {
      color: white;
      bottom: 0;
      background-color: var(--bg-primary);
      opacity: 0.5;
    }
  }
`

export const Title = styled.h3`
  color: var(--text-primary);
  font-size: 1.2rem;
  letter-spacing: 2px;
`

export const Subtitle = styled.p`
  color: var(--text-muted);
  font-size: 0.9rem;
  letter-spacing: 1px;
`

export const Tag = styled.span`
  &.react {
    background-color: #dbeafe;
    color: #2563eb;
  }

  &.nextjs {
    background-color: #111827;
    color: #f3f4f6;
  }

  &.springboot {
    background-color: #86efac;
    color: #047857;
  }

  &.java {
    background-color: #fca5a5;
    color: #dc2626;
  }

  &.rust {
    background-color: #9ca3af;
    color: #374151;
  }

  &.golang {
    background-color: #93c5fd;
    color: #2563eb;
  }

  &.firebase {
    background-color: #fde047;
    color: #ca8a04;
  }

  &.postgresql {
    background-color: #93c5fd;
    color: #2563eb;
  }

  &.mongodb {
    background-color: #86efac;
    color: #047857;
  }

  &.tailwindcss {
    background-color: #67e8f9;
    color: #0891b2;
  }
`
