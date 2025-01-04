import Text from '@/components/CustomText';
import { useAppTheme } from '@/constants/theme';
import { View } from 'react-native';

const NoData = () => {
    const t = useAppTheme();
    return (
        <View
            style={{
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: t.colors.white,
            }}>
            <Text variant="titleLarge">Brak danych</Text>
        </View>
    );
};

export default NoData;



