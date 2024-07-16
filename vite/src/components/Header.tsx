import { FC } from "react";
import { useNavigate } from 'react-router-dom';

const Header: FC = ({ }) => {

    const navigate = useNavigate();

    return (

        <div className="container-style h-20 flex justify-between items-center p-10 bg-blue-200">
            <button
              onClick={() => navigate("/hyeonyong")}
            >
                현용
            </button>

            <button
              onClick={() => navigate("/seongwoo")}
            >
                성우
            </button>

            <button
              onClick={() => navigate("/daehwan")}
            >
                대환
            </button>

            <button
              onClick={() => navigate("/minjae")}
            >
                민재
            </button>
        </div>
    );
};

export default Header;