import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface SingleLevelDropdownMenuProps {
  buttonLabel: string;
  items: {
    title: string;
    url?: string;
    icon?: JSX.Element;
    action?: () => void;
  }[];
}

export const SingleLevelDropdownMenu = ({
  buttonLabel,
  items,
}: SingleLevelDropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md text-sm border border-[#e4e4e7] h-10 px-4 py-2"
        onClick={handleToggle}
      >
        {buttonLabel}
        <span className="ml-2">
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-[32%] top-10">
          <ul className="w-48 h-auto shadow-md rounded-md p-1 border bg-white">
            {items.map((item, index) => (
              <li
                key={index}
                className={`relative flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 rounded-md`}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};