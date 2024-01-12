import KartverketLogoFull from './logo/kartverket-dev.svg'
import React from 'react';

const LogoFull = (props: React.JSX.IntrinsicAttributes & React.ClassAttributes<HTMLImageElement> & React.ImgHTMLAttributes<HTMLImageElement>) => {
  return <img src={KartverketLogoFull} alt="Kartverket logo" {...props} />;
};

export default LogoFull;
