import KartverketLogoFull from './logo/kartverket-dev.svg';
import KartverketLogoFullLight from './logo/kartverket-dev-light.svg';

type Props = {
  type: undefined | 'light' | 'dark';
} & React.JSX.IntrinsicAttributes &
  React.ClassAttributes<HTMLImageElement> &
  React.ImgHTMLAttributes<HTMLImageElement>;

const LogoFull = (props: Props) => {
  const logo =
    props.type === 'dark' ? KartverketLogoFull : KartverketLogoFullLight;
  return <img src={logo} alt="Kartverket logo" {...props} />;
};

export default LogoFull;
