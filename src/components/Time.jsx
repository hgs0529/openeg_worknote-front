import { useState } from "react";
import styled from "styled-components";
import useInterval from "../util/useInterval";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  div {
    font-size: 85px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.5);
    margin-bottom: 80px;
  }
  img {
    width: 300px;
    object-fit: corver;
    margin-bottom: 50px;
  }
`;

function Time({ username, position }) {
  const getTime = () => {
    const now = new Date();
    let hours = now.getHours();
    if (hours < 10) {
      hours = "0" + hours;
    }
    let minutes = now.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    let seconds = now.getSeconds();
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return `${hours}:${minutes}:${seconds}`;
  };

  const [realTime, setRealTime] = useState(getTime);

  useInterval(() => {
    setRealTime(getTime);
  }, 1000);

  return (
    <Wrapper>
      <div>{realTime}</div>
      <img src="/logo.png" />
    </Wrapper>
  );
}

export default Time;
