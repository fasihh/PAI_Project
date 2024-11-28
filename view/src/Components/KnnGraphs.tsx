import BackButton from "./BackButton";
import KnnImage from "./KnnImage";

const KnnGraphs = () => {
    const knnValues: string[] = Array.from({ length: 10 }, (_, i) => String(i + 1));

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-orange-50 min-h-screen">
            <BackButton />

            <h2 className="text-4xl font-bold text-gray-800 mb-8">KNN Analysis</h2>
            <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6">
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <KnnImage features={knnValues} graphTitle="confusion" available />
                        <KnnImage features={knnValues} graphTitle="classification" available />
                    </div>
                </div>

                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <KnnImage features={knnValues} graphTitle="roc" available />
                        <KnnImage features={knnValues} graphTitle="acc_vs_k" available={false} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KnnGraphs;
