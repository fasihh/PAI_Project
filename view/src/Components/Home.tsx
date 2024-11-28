import { useEffect, useState } from "react";
import { DataType } from "../types/global";
import Loading from "./Loading";
import DatasetGrid from "./DataSet";
import { Link } from "react-router-dom";

const Home = () => {
    const [dataSet, setDataSet] = useState<DataType | undefined>(undefined);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            console.log(process.env.REACT_APP_API);
            const res = await fetch(`${process.env.REACT_APP_API}/data/summary`);
            setDataSet(await res.json() as DataType);
        })().catch(error => {
            console.error(error);
            setError(true);
        });
    }, []);

    return (
        <div className="flex flex-col justify-center items-center font-[Roboto]">
            <h1 className="text-[60px] font-bold text-gray-800">
                PAI Project
            </h1>


            <a target='_blank' href='https://www.kaggle.com/datasets/uciml/adult-census-income/data' className="text-[25px] text-gray-500">Adult Census Dataset</a>
            <div className="flex justify-between w-1/3 text-[20px] mt-6 gap-4">
                <Link
                    to="/eda"
                    className="w-1/2 bg-gradient-to-r from-orange-400 to-orange-300 text-white font-semibold text-sm leading-5 py-3 px-4 rounded-lg shadow-md text-center no-underline hover:from-orange-500 hover:to-orange-300 transition duration-300"
                >
                    EDA
                </Link>
                <Link
                    to="/knn"
                    className="w-1/2 bg-gradient-to-r from-orange-400 to-orange-300 text-white font-semibold text-sm leading-5 py-3 px-4 rounded-lg shadow-md text-center no-underline hover:from-orange-500 hover:to-orange-300 transition duration-300"
                >
                    KNN
                </Link>
            </div>

            {!dataSet ? error ? <Loading /> : <div>Error</div> : <DatasetGrid data={dataSet} />}
        </div>
    );
}

export default Home;