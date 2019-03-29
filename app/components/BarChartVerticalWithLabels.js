import React from 'react'
import { View } from 'react-native'
import { BarChart, XAxis } from 'react-native-svg-charts'
import { Text } from 'react-native-svg'
import * as scale from 'd3-scale'

export default class BarChartVerticalWithLabels extends React.PureComponent {
  render() {
    const data = [ 10, 5, 25, 15, 20 ]

    const CUT_OFF = 20
    const Labels = ({ x, y, bandwidth, data }) => (
      data.map((value, index) => (
          <Text
              key={ index }
              x={ x(index) + (bandwidth / 2) }
              y={ value < CUT_OFF ? y(value) - 10 : y(value) + 15 }
              fontSize={ 14 }
              fill={ value >= CUT_OFF ? 'white' : 'black' }
              alignmentBaseline={ 'middle' }
              textAnchor={ 'middle' }
          >
              {value}
          </Text>
      ))
    )

    return (
      <View style={{ height: 200, paddingVertical: 16 }}>
          <BarChart
              style={{ flex: 1 }}
              data={data}
              svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
              contentInset={{ top: 10, bottom: 10 }}
              spacing={0.2}
              gridMin={0}
          >
              <Labels/>
          </BarChart>
          <XAxis
              style={{ marginTop: 10 }}
              data={ data }
              scale={scale.scaleBand}
              formatLabel={ (value, index) => index }
              labelStyle={ { color: 'black' } }
          />
      </View>
    )
  }
}
