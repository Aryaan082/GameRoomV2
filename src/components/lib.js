import styled from '@emotion/styled';
import {keyframes} from '@emotion/react';

const word = keyframes({
    '0%': {transform: 'backgrond-position:0% 50%'},
    '50%' : {transform: 'background-position:100% 50%'},
    '100%' : {transform: 'background-position:0% 50%'}
})

const Flashy = styled.h3({
    background: 'linear-gradient(270deg, #00b3ff, #5b00ff, #ff00e4, #ff0000, #fff500, #1dff00)',
    animation: `${word} 9s ease infinite`
})



export {Flashy};