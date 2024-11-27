import BackButton from "./BackButton";
import KnnImage from "./KnnImage";

const KnnGraphs = () => {
    const knnValues: string[] = Array.from({ length: 10 }, (_, i) => String(i + 1));

    return ( 
        <div className="flex flex-col items-center justify-center">
            <BackButton />
            <h2 className="text-[40px] mb-4">KNN</h2>
            <div className="bg-[#FAFAFA] flex">  
                <div className="flex flex-col justify-between h-[90%] py-4 bg-orange-50">
                    <div className="flex justify-between w-full mb-4">
                        <KnnImage features={knnValues} graphTitle="confusion" />
                        <KnnImage features={knnValues} graphTitle="classification" />
                    </div>
                    <div className="flex justify-between w-full">
                        <KnnImage features={knnValues} graphTitle="roc" />
                        <KnnImage features={knnValues} graphTitle="acc_vs_k" />
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default KnnGraphs;