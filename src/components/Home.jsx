import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useCurrentLocation from "../util/useCurrentLocation";
import Time from "./Time";

const Input = styled.input`
  height: 50px;
  width: 300px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 0 20px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
  background-color: transparent;
  margin-bottom: 20px;
  margin-top: 10px;
  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  height: 50px;
  width: 300px;
  border: 1px solid ${(props) => props.color};
  color: ${(props) => props.color};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: ${(props) => props.color};
    color: white;
  }
`;

const Msg = styled.div``;

const geolocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
  maximumAge: 1000 * 3600 * 24, // 24 hour
};

const BASE_URL = "http://localhost:8090";

function Home() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { location, error } = useCurrentLocation(geolocationOptions);
  const uid = localStorage.getItem("uid");
  const [address, setAddress] = useState("");
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if (!uid) {
      navigate("/regi");
    }
  }, [uid]);

  useState(() => {
    axios
      .get(`${BASE_URL}/status/${uid}`)
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  useEffect(() => {
    if (!location || address !== "") return;
    const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${location.longitude}&y=${location.latitude}&input_coord=WGS84`;
    axios
      .get(url, {
        headers: { Authorization: `KakaoAK 36fd69ad8eee60290b9a13dcdf87418f` },
      })
      .then((response) => {
        setAddress(response.data.documents[0].address.address_name);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [location, address]);

  const handleClick = (e) => {
    if (e.target.innerText === "퇴근") {
      if (window.confirm("퇴근처리 하시겠습니까?")) {
        axios
          .post(`${BASE_URL}/end`, { userid: uid, endLocation: address })
          .then((res) => {
            if (res.data === "ALREADY") {
              alert("이미 퇴근처리 되었습니다.");
            } else if (res.data === "NO") {
              alert("오늘 출근 이력이 없습니다.");
            } else if (res.data === "FAIL") {
              alert("퇴근 등록에 실패하였습니다. 관리자에게 문의 바랍니다.");
            } else {
              setUserInfo((prev) => {
                const newInfo = { ...prev, status: 1 };
                return newInfo;
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else if (e.target.innerText === "출근") {
      if (window.confirm("출근처리 하시겠습니까?")) {
        axios
          .post(`${BASE_URL}/start`, { userid: uid, startLocation: address })
          .then((res) => {
            if (res.data === "ALREADY") {
              alert("이미 출근처리 되었습니다.");
            } else if (res.data === "FAIL") {
              alert("출근 등록에 실패하였습니다. 관리자에게 문의 바랍니다.");
            } else {
              setUserInfo((prev) => {
                const newInfo = { ...prev, status: 2 };
                return newInfo;
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };
  console.log(userInfo);

  return (
    <>
      <Time username={userInfo.username} position={userInfo.userPosition} />
      <div>
        <div>
          안녕하세요, {userInfo.username + " " + userInfo.userPosition}님
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder="사원명"
          value={uid}
          readOnly
        />
      </div>
      <div>
        {address ? (
          userInfo.status === 1 ? (
            <p>퇴근처리되었습니다, 오늘도 고생하셨습니다.</p>
          ) : userInfo.status === 2 ? (
            <Button onClick={handleClick} color="#e17055">
              퇴근
            </Button>
          ) : (
            <Button onClick={handleClick} color="#74b9ff">
              출근
            </Button>
          )
        ) : (
          "위치정보 로딩중..."
        )}
      </div>
    </>
  );
}

export default Home;
