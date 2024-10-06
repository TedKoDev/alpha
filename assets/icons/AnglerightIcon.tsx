import { SvgXml } from 'react-native-svg';

const AngleRightIcon = ({ width = 24, height = 24, color = '#B227D4' }) => {
  const xml = `
  <svg xmlns="http://www.w3.org/2000/svg" id="Bold" viewBox="0 0 24 24" width="${width}" height="${height}">
    <path d="M15.75,9.525,11.164,4.939A1.5,1.5,0,0,0,9.043,7.061l4.586,4.585a.5.5,0,0,1,0,.708L9.043,16.939a1.5,1.5,0,0,0,2.121,2.122l4.586-4.586A3.505,3.505,0,0,0,15.75,9.525Z" fill="${color}"/>
  </svg>
  `;
  return <SvgXml xml={xml} width={width} height={height} />;
};

export default AngleRightIcon;
