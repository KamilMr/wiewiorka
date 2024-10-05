import {useEffect, useState} from 'react';
import {Image} from 'react-native';

const FullWidthImage = ({uri}: {uri: string}) => {
  const [ratio, setRatio] = useState(1);
  useEffect(() => {
    if (uri) {
      Image.getSize(uri, (width, height) => {
        setRatio(width / height);
      });
    }
  }, [uri]);

  return (
    <Image
      style={{width: '100%', aspectRatio: ratio}}
      resizeMode="contain"
      source={{uri}}
    />
  );
};

export default FullWidthImage;
