import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { Radio, Slider as AntSlider } from 'antd';
import USDDisplay from '../Utils/USDDisplay';
import './Slider.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@injectIntl
export default class Slider extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    value: PropTypes.number,
    voteWorth: PropTypes.number,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: 100,
    voteWorth: 0,
    onChange: () => {},
  };

  state = {
    value: 100,
  };

  componentWillMount() {
    if (this.props.value) {
      this.setState({
        value: this.props.value,
      });
    }
  }

  componentDidMount() {
    this.props.onChange(this.state.value);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  getCurrentValue = () => this.props.voteWorth;

  getCurrentFormattedValue = () =>
    this.props.intl.formatNumber(this.getCurrentValue(), {
      style: 'currency',
      currency: 'USD',
    });

  marks = {
    0: '0%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%',
  };

  handlePresetChange = (event) => {
    this.setState({ value: event.target.value }, () => {
      this.props.onChange(event.target.value);
    });
  };

  handleChange = (value) => {
    this.setState({ value }, () => {
      this.props.onChange(value);
    });
  };

  formatTip = value => (
    <div>
      <FormattedNumber
        style="percent" // eslint-disable-line react/style-prop-object
        value={value / 100}
      />
      <span style={{ opacity: '0.5' }}>
        {' '}
        <USDDisplay value={this.getCurrentValue()} />
      </span>
    </div>
  );

  render() {
    const { value } = this.state;

    return (
      <div className="Slider">
        <AntSlider
          value={value}
          marks={this.marks}
          tipFormatter={this.formatTip}
          onChange={this.handleChange}
        />
        <div className="Slider__presets">
          <RadioGroup value={value} size="large" onChange={this.handlePresetChange}>
            <RadioButton value={1}>1%</RadioButton>
            <RadioButton value={25}>25%</RadioButton>
            <RadioButton value={50}>50%</RadioButton>
            <RadioButton value={75}>75%</RadioButton>
            <RadioButton value={100}>100%</RadioButton>
          </RadioGroup>
        </div>
        <div className="Slider__info">
          <h3>
            <FormattedMessage
              id="like_slider_info"
              defaultMessage="Your vote will be worth {amount}."
              values={{
                amount: (
                  <span className="Slider__info__amount">{this.getCurrentFormattedValue()}</span>
                ),
              }}
            />
          </h3>
        </div>
      </div>
    );
  }
}
