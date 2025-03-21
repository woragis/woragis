import styled from '@emotion/styled'

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  min-height: 12rem;
  padding-inline: 2rem;
  padding-block: 3rem;
  padding-bottom: 8rem;
  background-color: var(--bg-tertiary);
  color: var(--text-muted);
`

export const FooterNav = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
`

export const BasicInformation = FooterNav
export const QuickLinks = FooterNav

export const Socials = styled.ul`
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
  font-size: 1.6rem;
`

export const Social = styled.li`
  list-style-type: none;
  font-size: 15px;

  a {
    color: var(--text-muted);
  }
`

export const MyPicture = styled.img`
  width: 100px;
  border-radius: 50%;
`

export const Copy = styled.span`
  display: block;
  position: absolute;
  bottom: 0;
  padding-block: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  text-align: center;
  background-color: var(--bg-primary);
`

export const ButtonCTA = styled.button`
  transition: 200ms;
  font-weight: bold;
  font-size: 16px;
  border: 3px solid var(--accent-primary);
  height: 3rem;
  border-radius: 10px;
  width: 120px;
  background-color: var(--accent-primary);
  color: var(--text-primary);

  &:hover {
    background-color: var(--text-primary);
    color: var(--accent-primary);
  }
`
