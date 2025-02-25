import React from 'react';
import styled from 'styled-components';
import { Env } from '../types';

interface IProps {
    onChange: (env: Env, val: string) => void;
}

export default function InputsForEnvs({ onChange }: IProps) {
  return (
    <Frame>
      <StyledInput onChange={onChange} env={'sandbox'} />
      <StyledInput onChange={onChange} env={'dev'} />
      <StyledInput onChange={onChange} env={'prod'} />
    </Frame>
  );
}

function StyledInput(props: { env: Env } & IProps) {
  const isDark = window.localStorage.getItem('theme') === 'dark';
  return (
    <InputFrame>
      <InputTitleText isdark={isDark}>{props.env}</InputTitleText>
      <Input onChange={e => props.onChange(props.env, e.target.value)} isdark={isDark} />
    </InputFrame>
  );
}

const InputTitleText = styled.p<{ isdark: boolean }>`
  position: absolute;
  bottom: 22px;
  left: 20px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 10px;
  background-color: ${props => (props.isdark ? '#333' : '#F8F8F8')};
`;

const InputFrame = styled.div`
  position: relative;
  margin-top: 20px;
`;

export const Input = styled.input<{ isdark: boolean }>`
  padding: 14px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 10px;
  border: none;
  background-color: ${props => (props.isdark ? '#333' : '#F8F8F8')};
  border: 1px solid #999999;
  color: ${props => (props.isdark ? '#F8F8F8' : '#333')};
  margin-right: 20px;
  width: 200px;
`;

const Frame = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
