import styled from '@emotion/styled'

export const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: space-evenly;
  align-items: center;
  min-height: 500px;
  background-color: var(--bg-primary);
  @media (max-width: 800px) {
    & {
      grid-template-columns: 1fr;
    }
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 20px;
  width: max-content;
  margin: 40px auto;
  padding: 20px;
  @media (max-width: 800px) {
    & {
      width: 100%;
      margin-inline: auto;
    }
  }
`

export const Title = styled.h2`
  text-align: left;
  display: inline-block;
  position: relative;
  color: var(--accent-secondary);
  font-weight: 600;
  font-size: 40px;
  margin-bottom: 25px;
  position: relative;
  z-index: 2;
  color: transparent;

  background: linear-gradient(
    270deg,
    var(--accent-primary),
    var(--accent-secondary)
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  &::after {
    content: '';
    background: linear-gradient(
      270deg,
      var(--accent-primary),
      var(--accent-secondary)
    );
    width: 120px;
    height: 5px;
    border-radius: 10px;
    position: absolute;
    bottom: -10px;
    left: 0;
  }
`

export const Field = styled.input`
  width: 400px;
  height: 50px;
  border: 2px solid var(--bg-secondary);
  outline: none;
  padding-inline: 25px;
  font-weight: 500;
  color: var(--text-primary);
  background-color: var(--bg-secondary);
  border-radius: 50px;
  font-size: 16px;
  transition: 300ms;

  &:focus {
    border-color: var(--accent-primary);
  }
  &::placeholder {
    color: var(--text-muted);
  }

  @media (max-width: 800px) {
    & {
      width: 100%;
    }
  }
`

export const Message = styled.textarea`
  height: 140px;
  padding-top: 15px;
  border-radius: 20px;
  width: 400px;
  border: 2px solid var(--bg-secondary);
  outline: none;
  padding-inline: 25px;
  font-weight: 500;
  color: var(--text-primary);
  background-color: var(--bg-secondary);
  font-size: 16px;
  transition: 300ms;
  resize: none;

  &:focus {
    border-color: var(--accent-primary);
  }
  &::placeholder {
    color: var(--text-muted);
  }

  @media (max-width: 800px) {
    & {
      width: 100%;
    }
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
    height: 400%;
    width: 100%;
    border-radius: 50px;
    background: linear-gradient(
      230deg,
      var(--accent-primary),
      var(--bg-primary)
    );
    transition: 200ms;
  }
  &:hover {
    &::before {
      transform: rotate(260deg);
    }
  }
`

export const SectionImg = styled.img`
  width: 300px;
  border-radius: 30px;
  margin-inline: auto;

  @media (max-width: 800px) {
    & {
      display: none;
    }
  }
`
