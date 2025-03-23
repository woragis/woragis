import styled from '@emotion/styled'

export const CertificationsWrapper = styled.section`
  mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 1) 15% 85%,
    rgba(0, 0, 0, 0)
  );
`

interface CertificatesProps {
  reverse: boolean
  rows: number
  quantity: number
}

export const Certificates = styled.ul<CertificatesProps>`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  position: relative;
  overflow-x: hidden;
  --certificate-height: 120px;
  --certificate-width: 240px;
  --rows: ${(_) => _.rows};
  --certificates-height: calc(var(--certificate-height) * var(--rows));
  --certificates-quantity: ${(_) => _.quantity};

  height: var(--certificates-height);
  width: 100%;
  min-width: calc(var(--certificate-width) * var(--certificates-quantity));

  & .certificate {
    transition: filter 500ms;
  }
  & .certificate {
    animation-direction: ${(_) => (_.reverse ? 'reverse' : 'normal')};
  }

  &:hover .certificate {
    animation-play-state: paused !important;
    filter: grayscale(1);
  }
  & .certificate:hover {
    filter: grayscale(0);
  }
`
