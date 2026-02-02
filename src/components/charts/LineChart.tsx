import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart as GiftedLineChart } from 'react-native-gifted-charts';
import { useTheme } from '../../hooks';
import { colors, spacing } from '../../theme';

interface LineChartProps {
  data: { value: number; label?: string }[];
  height?: number;
  showLabels?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 120,
  showLabels = false,
}) => {
  const { isDark, currentColors } = useTheme();

  return (
    <View style={styles.container}>
      <GiftedLineChart
        data={data}
        height={height}
        width={Dimensions.get('window').width - 80}
        spacing={40}
        initialSpacing={10}
        endSpacing={10}
        color={colors.primary.cyan}
        thickness={3}
        hideDataPoints={false}
        dataPointsColor={colors.primary.cyan}
        dataPointsRadius={4}
        startFillColor={colors.primary.cyan}
        endFillColor={colors.primary.cyan}
        startOpacity={0.3}
        endOpacity={0.05}
        areaChart
        hideYAxisText
        hideAxesAndRules
        curved
        showXAxisIndices={false}
        xAxisLabelTextStyle={{
          color: currentColors.text.muted,
          fontSize: 10,
        }}
        showXAxisLabelTexts={showLabels}
        animateOnDataChange
        animationDuration={1000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing[2],
  },
});
