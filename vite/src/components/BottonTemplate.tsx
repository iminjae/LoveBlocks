import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column; /* Arrange text and button vertically */
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full screen height */
  background-color: #282c34; /* Added a background color to enhance visibility */
`;

const Button3D = styled.button`
  position: relative;
  padding: 25px 50px; /* Increased padding */
  font-size: 24px; /* Increased font size */
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 35px; /* Increased border-radius for a bigger button */
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 7px 0 #0056b3; /* Adjusted shadow for a larger button */

  &:hover {
    background-color: #0069d9;
  }

  &:active {
    top: 7px; /* Adjusted for a larger button */
    box-shadow: none;
    background-color: #0062cc;
  }
`;

interface Props {
  onClick?: () => void;
}

const ButtonTemplate: React.FC<Props> = ({ onClick }) => {
  return (
    <Container>
      <Button3D onClick={onClick}>Click Me</Button3D>
    </Container>
  );
};

export default ButtonTemplate;