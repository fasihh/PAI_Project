import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import format_feature from "../utils/formatFeatures";

interface SingleLevelDropdownMenuProps {
  buttonLabel: string;
  titles: string[];
  setTitle: (title: string) => void;
}

export const SingleLevelDropdownMenu = ({
  buttonLabel,
  titles,
  setTitle,
}: SingleLevelDropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex items-center justify-between rounded-sm text-[10px] pl-[6px] w-[100px] shadow-sm transition duration-150 ease-in-out"
        onClick={handleToggle}
      >
        {buttonLabel}
        <span className="ml-2">
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      {open && (
        <div className="absolute left-[57px] -translate-x-[32%] top-6">
          <ul className="w-48 max-h-48 overflow-y-auto shadow-md rounded-md p-1 border bg-white">
            {titles.map((title, index) => (
              <li
                key={index}
                className="relative flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 rounded-md"
                onClick={() => {
                  setTitle(title);
                  setOpen(false);
                }}
              >
                {format_feature(title)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
