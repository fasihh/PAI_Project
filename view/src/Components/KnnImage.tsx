import { SingleLevelDropdownMenu } from "./DropDown";
import { Features } from "../types/global";
import format_feature from "../utils/formatFeatures";
import { useState } from "react";

type PropType = {
    features: string[]
    graphTitle: string
    available: boolean
}

const KnnImage = ({ features, graphTitle, available=true }: PropType) => {
    const [currentKnn, setCurrentKnn] = useState<string>("1");

    return ( 
        <div className="w-[400px] max-w-[500px] max-h-[500px] mx-6 bg-white rounded-md pb-1 px-1 shadow-sm">
            <div className="relative w-full h-7">
                {available && 
                <div className="absolute top-0">
                    <SingleLevelDropdownMenu 
                        buttonLabel={currentKnn}
                        titles={features}
                        setTitle={setCurrentKnn}
                    />
                </div>}
            </div>
            <img src={`${process.env.REACT_APP_API}/graphs/knn/${graphTitle}?k=${currentKnn}`} className="w-fit h-fit" />
        </div>
     );
}
 
export default KnnImage;