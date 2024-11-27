import { useHistory } from "react-router-dom";

const BackButton = () => {
  const history = useHistory();

  return (
    <div className="absolute top-2 left-2 ">
        <button
        onClick={() => history.push('/')}
        className="flex justify-center items-center text-gray-900 p-3 rounded-full shadow-md hover:bg-gray-300 focus:outline-none"
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
        >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
            />
        </svg>
        </button>
    </div>
  );
};

export default BackButton;
