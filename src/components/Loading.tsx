import React from 'react';
import styled from 'styled-components';

interface LoaderProps {
  isLight?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLight = false }) => {
  const primaryColor = isLight ? '#fff' : '#000';
  const secondaryColor = '#F2AE30';

  return (
    <StyledWrapper>
      <svg viewBox="0 0 240 240" height={240} width={240} className="pl">
        <circle
          strokeLinecap="round"
          strokeDashoffset={-330}
          strokeDasharray="0 660"
          strokeWidth={20}
          stroke={primaryColor}
          fill="none"
          r={105}
          cy={120}
          cx={120}
          className="pl__ring pl__ring--a"
        />
        <circle
          strokeLinecap="round"
          strokeDashoffset={-110}
          strokeDasharray="0 220"
          strokeWidth={20}
          stroke={secondaryColor}
          fill="none"
          r={35}
          cy={120}
          cx={120}
          className="pl__ring pl__ring--b"
        />
        <circle
          strokeLinecap="round"
          strokeDasharray="0 440"
          strokeWidth={20}
          stroke={secondaryColor}
          fill="none"
          r={70}
          cy={120}
          cx={85}
          className="pl__ring pl__ring--c"
        />
        <circle
          strokeLinecap="round"
          strokeDasharray="0 440"
          strokeWidth={20}
          stroke={primaryColor}
          fill="none"
          r={70}
          cy={120}
          cx={155}
          className="pl__ring pl__ring--d"
        />
      </svg>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .pl {
    width: 6em;
    height: 6em;
  }

  .pl__ring {
    animation: ringA 2s linear infinite;
  }

  /* Animations */
  @keyframes ringA {
    from,
    4% {
      stroke-dasharray: 0 660;
      stroke-width: 20;
      stroke-dashoffset: -330;
    }

    12% {
      stroke-dasharray: 60 600;
      stroke-width: 30;
      stroke-dashoffset: -335;
    }

    32% {
      stroke-dasharray: 60 600;
      stroke-width: 30;
      stroke-dashoffset: -595;
    }

    40%,
    54% {
      stroke-dasharray: 0 660;
      stroke-width: 20;
      stroke-dashoffset: -660;
    }

    62% {
      stroke-dasharray: 60 600;
      stroke-width: 30;
      stroke-dashoffset: -665;
    }

    82% {
      stroke-dasharray: 60 600;
      stroke-width: 30;
      stroke-dashoffset: -925;
    }

    90%,
    to {
      stroke-dasharray: 0 660;
      stroke-width: 20;
      stroke-dashoffset: -990;
    }
  }
`;

export default Loader;
