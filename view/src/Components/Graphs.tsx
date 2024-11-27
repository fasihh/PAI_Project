import { useEffect, useState } from "react";
import { SingleLevelDropdownMenu } from "./DropDown";
import { error } from "console";
import format_features from '../utils/formatFeatures'
import { Features } from "../types/global";
import EdaImage from "./EdaImage";
import KnnImage from "./KnnImage";

const Graphs = () => {
    const [features, setFeatures] = useState<Features>({"numeric": [], "nonnumeric": []});
    const knnValues: string[] = Array.from({ length: 10 }, (_, i) => String(i + 1));

    useEffect(() => {
        (async() => {
            const res = await fetch(`${process.env.REACT_APP_API}/data/features`);
            setFeatures(await res.json() as Features) 
        })().catch(console.error);
    },[])

    return ( 
        <div className="flex items-center justify-center py-7 bg-[url('srcImages/background.png')]">
            <div className="bg-[#FAFAFA] flex">  
                <div className="flex flex-col my-4">
                    <div className="flex mb-6">
                        <EdaImage features={features.nonnumeric} graphType="countplots" graphTitle="workclass" />
                        <EdaImage features={features.nonnumeric} graphType="splitplots" graphTitle="workclass" />
                    </div>
                    <div className="flex mb-6">
                        <EdaImage features={features.numeric} graphType="boxplots" graphTitle="age" />
                        <EdaImage features={features.numeric} graphType="histplots" graphTitle="education_num" />
                    </div>
                    <div className="flex mb-6">
                        <KnnImage features={knnValues} graphTitle="confusion" />
                        <KnnImage features={knnValues} graphTitle="classification" />
                    </div>
                    <div className="flex mb-6">
                        <KnnImage features={knnValues} graphTitle="roc" />
                        <KnnImage features={knnValues} graphTitle="acc_vs_k" />
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Graphs;