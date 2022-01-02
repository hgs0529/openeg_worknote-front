import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Time from "./Time";

const Input = styled.input`
  height: 50px;
  width: 300px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 0 20px;
  margin-top: 10px;
  color: rgba(0, 0, 0, 0.8);
  font-size: 16px;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
  }
`;

function Regi() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("uid");
  const [ip, setIp] = useState("");
  const inputRef = useRef(null);

  const getData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    setIp(res.data.IPv4);
  };

  useEffect(() => {
    if (userId) {
      navigate("/");
      console.log(userId);
    } else {
      getData();
    }
  }, []);

  const regiUser = async (username) => {
    console.log(username);
    const url = "http://localhost:8090/regi";
    const res = await axios.post(url, { username, userip: ip });
    if (res.data === "NO") {
      alert("등록되지 않은 사원명 입니다. 관리자에게 문의하십시오.");
    } else if (res.data === "FAIL") {
      alert("사원등록이 실패하였습니다. 관리자에게 문의하십시오.");
    } else {
      localStorage.setItem("uid", res.data);
      navigate("/");
    }
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      regiUser(inputRef.current.value);
    }
  };

  return (
    <>
      <Time />
      <div>
        <div>안녕하세요! 오픈이지 출퇴근 관리 시스템입니다</div>
        <Input
          ref={inputRef}
          type="text"
          placeholder="사원명을 입력해주세요"
          onKeyPress={onKeyPress}
        />
      </div>
    </>
  );
}

export default Regi;
