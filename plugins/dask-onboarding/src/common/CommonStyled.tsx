import styled from "styled-components";

export const Content = styled.div`
    position: relative;
    padding-left: 12.5%;
    padding-right: 12%;
    width: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
    overflow: auto;
`;

type SelectColor = {
    themecolor: string;
  }
export const Select = styled.select<SelectColor>`
    color: ${props => props.themecolor};
    border-color: ${props => props.themecolor === "white" ? "#666" : "#bababa"};
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    width: 200px;
    border-radius: 20px;
    -moz-appearance:none; /* Firefox */
    -webkit-appearance:none; /* Safari and Chrome */
    appearance:none;
    background: transparent;
    background-image: url("data:image/svg+xml;utf8,<svg fill='${props => props.themecolor}' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
    background-repeat: no-repeat;
    background-position-x: 95%;
    background-position-y: 5px;
`;

export const Spinner = styled.span`
    & {
        width: 32px;
        height: 32px;
        border-width: 3px;
        border-style: dashed solid  solid dotted;
        border-color: #FF3D00 #FF3D00 transparent #FF3D00;
        border-radius: 50%;
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
        }
        @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    } 
`;

export const h1Style = { color: '#fff', fontSize: '2rem', fontWeight: '400' };
export const h2Style = { marginTop: '3rem', fontWeight: '400', fontSize: '1.7rem' };
export const h3Style = { marginTop: '1rem', fontWeight: '400', fontSize: '1.3rem', marginBottom: "0.5rem" };
export const pStyle = { maxWidth: '70%', marginTop: "0.2rem" };