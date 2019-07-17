import React from 'react';
import {
  HashLoader,
  BarLoader,
  BeatLoader
} from 'react-spinners';
import { Fade } from '../../styles/animations';

export default class Spinner extends React.PureComponent {
  render() {
    const { loading, bar, beat, size, color } = this.props;
    let Loader = HashLoader;

    if (bar) {
      Loader = BarLoader;
    }

    if (beat) {
      Loader = BeatLoader;
    }

    return Fade({ in: loading }, (style) => {
      return (
        <div
          className='Spinner'
          style={style}
        >
          <div className='inner'>
            <Loader 
              color={color || '#00d367'}
              sizeUnit='px'
              size={size || 50}
            />
          </div>
        </div>
      );
    });
  }
}