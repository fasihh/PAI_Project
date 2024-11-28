import { useEffect, useState } from "react";
import { Features } from "../types/global";
import EdaImage from "./EdaImage";
import BackButton from "./BackButton";

const EdaGraphs = () => {
  const [features, setFeatures] = useState<Features>({ numeric: [], nonnumeric: [] });

  useEffect(() => {
    (async () => {
      const res = await fetch(`${process.env.REACT_APP_API}/data/features`);
      setFeatures((await res.json()) as Features);
    })().catch(console.error);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-orange-50 min-h-screen">
      <BackButton />

      <h2 className="text-4xl font-bold text-gray-800 mb-8">Exploratory Data Analysis (EDA)</h2>
      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Non-Numeric Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EdaImage features={features.nonnumeric} graphType="countplots" graphTitle="workclass" />
            <EdaImage features={features.nonnumeric} graphType="splitplots" graphTitle="workclass" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Numeric Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EdaImage features={features.numeric} graphType="boxplots" graphTitle="age" />
            <EdaImage features={features.numeric} graphType="histplots" graphTitle="education_num" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EdaGraphs;
