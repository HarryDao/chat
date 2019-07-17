import React from 'react';
import { Transition } from 'react-transition-group';

const AnimateOneItem = ({ in: inProp }, componentCreator, options = {}) => {
    const {
        duration,
        defaultStyle,
        entering,
        entered,
        exiting,
    } = options;

    const transitionStyles = {
        entering: entering || {},
        entered: entered || {},
        exiting: exiting || {},
    };


    const createComponent = (state) => {
        let component = componentCreator({
            ...defaultStyle || {},
            ...transitionStyles[state]
        });

        return component;

    }

    return (
        <Transition in={inProp ? true : false} timeout={duration || 200}>
            {state => createComponent(state)}
        </Transition>
    );
}

export { AnimateOneItem };