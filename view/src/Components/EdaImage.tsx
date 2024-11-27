import { SingleLevelDropdownMenu } from "./DropDown";
import { Features } from "../types/global";
import format_feature from "../utils/formatFeatures";
import { useState } from "react";

type PropType = {
  features: string[];
  graphType: string;
  graphTitle: string;
};

const EdaImage = ({ features, graphType, graphTitle }: PropType) => {
  const [title, setTitle] = useState<string>(graphTitle);

  return (
    <div className="w-[400px] max-w-[500px] max-h-[500px] mx-6 bg-white rounded-md pb-1 px-1 shadow-sm">
      <div className="relative w-full h-7">
        <div className="absolute top-0">
          <SingleLevelDropdownMenu
            buttonLabel={format_feature(title)}
            titles={features}
            setTitle={setTitle}
          />
        </div>
      </div>
      <img
        src={`${process.env.REACT_APP_API}/graphs/eda/${graphType}/${title}`}
        className="w-fit h-fit"
        alt="EDA Graph"
      />
    </div>
  );
};

export default EdaImage;