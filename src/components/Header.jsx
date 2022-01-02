import styled from "styled-components";

const Wrapper = styled.div`
  padding: 30px 0;
  background-color: #2691d1;
  color: white;
  font-size: 26px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 100px;
`;

function Header() {
  return (
    <Wrapper>
      <div>출퇴근 관리 시스템</div>
    </Wrapper>
  );
}

export default Header;
