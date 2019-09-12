import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ScrollView, Vibration, Dimensions } from 'react-native'
import SliderItem from './SliderItem'
import colors from '../theme.json'
import { isPortrait } from '../responsivenessHelpers'

const VIBRATION_DURATION = 120

const slideColors = {
  1: 'red',
  2: 'gold',
  3: 'palegreen'
}

export class Slider extends Component {
  _isMounted = false
  _timer

  state = {
    selectedColor: colors.palegreen
  }

  componentDidMount() {
    this._isMounted = true
    const width = Dimensions.get('window').width

    const value = value => {
      switch (value) {
        case 1:
          return 2
        case 2:
          return 1
        case 3:
          return 0
        default:
          return 0
      }
    }

    if (value(this.props.value)) {
      this._timer = setTimeout(() => {
        if (this.scrollView) {
          this.scrollView.scrollTo({
            x: (width - (1 / 10) * width) * value(this.props.value),
            animated: true
          })
        }
      }, 1)
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timer)
    this._isMounted = false
  }

  onSlidePress = slide => {
    this.vibrate()
    this.props.selectAnswer(slide.value)
    if (this._isMounted) {
      this.setState({
        selectedColor: colors[slideColors[slide.value]]
      })
    }
  }

  vibrate = () => {
    Vibration.vibrate(VIBRATION_DURATION)
  }

  render() {
    const { width, height } = Dimensions.get('window')
    return (
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          snapToInterval={width - (1 / 10) * width}
          contentContainerStyle={{
            width: isPortrait({ width, height }) ? '280%' : '90%',
            flexGrow: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: '0.66%'
          }}
          ref={ref => {
            this.scrollView = ref
          }}
        >
          {this.props.slides.map((slide, i) => (
            <View
              key={i}
              style={{
                width: '33%',
                backgroundColor: colors[slideColors[slide.value]]
              }}
            >
              <SliderItem
                slide={slide}
                onPress={() => this.onSlidePress(slide)}
                value={this.props.value}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }
}

Slider.propTypes = {
  slides: PropTypes.array.isRequired,
  value: PropTypes.number,
  selectAnswer: PropTypes.func.isRequired
}

export default Slider
