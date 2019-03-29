import React from 'react'
import { View } from 'react-native';
import { Text as HText} from  'react-native-elements';
import { PieChart } from 'react-native-svg-charts';
import { Circle, G, Line, Text } from 'react-native-svg';

class PieChartWithCenteredLabels extends React.PureComponent {

    randDarkColor() {
        var lum = -0.25;
        var hex = String('#' + Math.random().toString(16).slice(2, 8).toUpperCase()).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        var rgb = "#",
            c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }
        return rgb;
    }

    render() {

        const data = [ 
            {
                amount: 10,
                label: "Aaron"
            },
            {
                amount: 40,
                label: "Bill"
            },
            {
                amount: 95,
                label: "Carol"
            },
            {
                amount: 50,
                label: "Dave"
            },
            {
                amount: -4,
                label: "Eve"
            },
            {
                amount: -24,
                label: "Mary"
            }
        ];

        const pieData = data
            .filter(value => value.amount > 0)
            .map(value => ({
                value: value.amount,
                label: value.label,
                svg: { fill: this.randDarkColor() },
                key: `pie-${value.label}`,
            }))

        const Labels = ({ slices }) => {
            return slices.map((slice, index) => {
                const { labelCentroid, pieCentroid, data } = slice;
                return (
                    <G key={ index }>
                        <Line
                            x1={ labelCentroid[ 0 ] }
                            y1={ labelCentroid[ 1 ] }
                            x2={ pieCentroid[ 0 ] }
                            y2={ pieCentroid[ 1 ] }
                            stroke={ data.svg.fill }
                        />
                        <Circle
                            cx={ labelCentroid[ 0 ] }
                            cy={ labelCentroid[ 1 ] }
                            r={ 35 }
                            fill={ data.svg.fill }
                        />
                        <Text
                            key={index}
                            x={labelCentroid[ 0 ]}
                            y={labelCentroid[ 1 ]}
                            fill={'white'}
                            textAnchor={'middle'}
                            alignmentBaseline={'middle'}
                            fontSize={20}
                            stroke={'black'}
                            strokeWidth={0.2}
                        >
                            {data.label}
                        </Text>
                    </G>
                )
            })
        }

        return (
            <View>
                <HText h4>
                    Positive interactions per person
                </HText>
                <PieChart
                    style={ { height: 400 } }
                    data={ pieData }
                    innerRadius={ 40 }
                    outerRadius={ 85 }
                    labelRadius={ 130 }
                >
                    <Labels/>
                </PieChart>
            </View>
        )
    }
}

export default PieChartWithCenteredLabels