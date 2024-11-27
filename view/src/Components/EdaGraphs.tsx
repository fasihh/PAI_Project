import { useEffect, useState } from "react";
import { Features } from "../types/global";
import EdaImage from "./EdaImage";
import BackButton from "./BackButton";

const EdaGraphs = () => {
    const [features, setFeatures] = useState<Features>({ "numeric": [], "nonnumeric": [] });

    useEffect(() => {
        (async () => {
            const res = await fetch(`${process.env.REACT_APP_API}/data/features`);
            setFeatures(await res.json() as Features)
        })().catch(console.error);
    }, [])

    return (
        <div className="flex flex-col items-center justify-center mb-4">
            <BackButton />
            <h2 className="text-[40px] mb-4">EDA</h2>
            <div className="bg-[#FAFAFA] flex h-[90%]">
                <div className="flex flex-col justify-between h-[90%] py-4 bg-orange-50">
                    <div className="flex justify-between w-full mb-4">
                        <EdaImage features={features.nonnumeric} graphType="countplots" graphTitle="workclass" />
                        <EdaImage features={features.nonnumeric} graphType="splitplots" graphTitle="workclass" />
                    </div>
                    <div className="flex justify-between w-full">
                        <EdaImage features={features.numeric} graphType="boxplots" graphTitle="age" />
                        <EdaImage features={features.numeric} graphType="histplots" graphTitle="education_num" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EdaGraphs;