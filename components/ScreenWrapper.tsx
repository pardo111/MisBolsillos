import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  edges?: Edge[];
  contentStyle?: ViewStyle;
};

export default function ScreenWrapper({ children, edges = ['top', 'bottom'], contentStyle }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }} edges={edges}>
      <View style={[{ flex: 1, backgroundColor: '#fff' }, contentStyle]}>
        {children}
      </View>
    </SafeAreaView>
  );
}