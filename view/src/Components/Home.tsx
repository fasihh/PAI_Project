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
            <h1 className="text-[70px] ">PAI Project</h1>
            <h2 className="text-[30px]">Adult Census</h2>
            <div className="flex justify-between w-1/3 text-[20px] mt-6">
                <Link to='/eda' className="bg-orange-300 w-1/3 border-0 rounded-lg box-border text-gray-900 font-semibold text-sm leading-5 py-3 px-4 text-center no-underline shadow-sm cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-offset-2 hover:bg-orange-200">
                    EDA
                </Link>
                <Link to='/knn' className="bg-orange-300 w-1/3 border-0 rounded-lg box-border text-gray-900 font-semibold text-sm leading-5 py-3 px-4 text-center no-underline shadow-sm cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-transparent focus-visible:ring-offset-2 hover:bg-orange-200">
                    KNN
                </Link>
            </div>
            {!dataSet ? error ? <Loading /> : <div>Error</div> : <DatasetGrid data={dataSet} />}
        </div>
    );
}

export default Home;