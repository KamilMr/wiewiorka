import {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

import {
  ActivityIndicator,
  Icon,
  Menu,
  TouchableRipple,
} from 'react-native-paper';
import {useAppDispatch} from '@/hooks';
import {uploadFile} from '@/redux/main/thunks';

const isPDF = ({url = ''}: {url: string}) =>
  getExtension(url).toLowerCase() === 'pdf';
const initState = (url: string) => ({url: url ?? ''});

const getExtension = (url: string = '') => {
  const parts = url.split('.');
  return parts[parts.length - 1] || '';
};

const ImageThumbnail = ({image, onPress}) => {
  const isPdf = isPDF(image);

  console.log('imageThumbnail', image);
  return (
    <TouchableRipple style={styles.img} onPress={onPress}>
      {isPdf ? (
        <View style={styles.updBtn}>
          <Icon size={80} source="file-pdf-box" color="blue" />
        </View>
      ) : (
        <Image style={styles.image} source={{uri: image.url}} />
      )}
    </TouchableRipple>
  );
};

const UploadButton = ({
  disabled,
  onPress,
}: {
  onPress: () => void;
  disabled: boolean;
}) => {
  return (
    <TouchableRipple
      onPress={onPress}
      style={styles.updBtn}
      disabled={disabled}>
      {disabled ? (
        <ActivityIndicator size={40} animating color="blue" />
      ) : (
        <Icon size={48} source="file-upload-outline" color="blue" />
      )}
    </TouchableRipple>
  );
};

const CustomImage = ({
  imageSrc,
  editable,
}: {
  imageSrc: string;
  editable: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [image, setImage] = useState(initState(imageSrc));
  const [isSaving, setIsSaving] = useState(false);
  const [isVisibleMenu, setIsVisibleMenu] = useState(false);

  const handleOpenMenu = (isOpen: boolean) => () => {
    setIsVisibleMenu(isOpen);
  };

  const handleViewImage = (isVisible: boolean) => () => {
    handleOpenMenu(false)();
  };

  const handleUploadFile = async () => {
    setIsSaving(true);
    handleOpenMenu(false)();
    const docResult = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'],
    });
    if (docResult.canceled) return;

    const [file] = docResult.assets;

    const data: FormData = new FormData();
    data.append('image', {
      name: file.name,
      mimeType: file.mimeType,
      type: file.mimeType,
      size: file.size,
      uri: file.uri,
    });

    dispatch(uploadFile({file: data}))
      .unwrap()
      .then((resp) => {
        setImage(initState(resp.url));
        setIsSaving(false);
      })
      .catch(() => {
        setIsSaving(false);
      });
  };

  console.log('image', image);
  return (
    <View style={styles.root}>
      <Menu
        visible={isVisibleMenu}
        anchorPosition="bottom"
        onDismiss={handleOpenMenu(false)}
        anchor={
          image.url ? (
            <ImageThumbnail image={image} onPress={handleOpenMenu(true)} />
          ) : (
            <UploadButton onPress={handleOpenMenu(true)} disabled={isSaving} />
          )
        }>
        {image.url && (
          <Menu.Item
            onPress={handleViewImage(true)}
            leadingIcon="open-in-new"
            title="View the image"
          />
        )}
        {editable && (
          <Menu.Item
            onPress={handleUploadFile}
            leadingIcon="file"
            title={'Pick a file'}
          />
        )}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginVertical: 16,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    marginTop: 16,
    borderRadius: 8,
  },
  header: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  updBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    maxWidth: '100%',
    aspectRatio: '1',
    borderWidth: 2,
  },
  img: {
    width: 100,
    maxWidth: '100%',
    aspectRatio: '1',
  },
});

export default CustomImage;
