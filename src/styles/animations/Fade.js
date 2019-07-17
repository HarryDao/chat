import { AnimateOneItem } from './AnimateOneItem';

const Fade = ({ in: inProp }, componentCreator, options = {}) => {
    let {
        duration,
        defaultStyle,
        entering,
        entered,
        exiting,
        ease,
    } = options;

    ease = ease || 'ease-in-out';
    duration = duration || 200;
    defaultStyle = defaultStyle || {
        transition: `opacity ${duration}ms ${ease}`,
        opacity: 0,
        display: 'none'
    };
    entering = entering || { opacity: 0, display: 'block' }
    entered = entered || { opacity: 1, display: 'block' }
    exiting = exiting || { opacity: 0, display: 'block' }

    return AnimateOneItem(
        { in: inProp },
        componentCreator,
        { duration, defaultStyle, entering, entered, exiting }
    );
}

export { Fade };