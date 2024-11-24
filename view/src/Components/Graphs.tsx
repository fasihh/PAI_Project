const Graphs = () => {
    return ( 
        <div className="flex flex-col items-center justify-center bg-slate-500 py-7">
            <div className="py-6 rounded-2xl">
                <img src="/images/longgraph.png" className="rounded-lg" />
            </div>
            <div>
                <div className="flex">
                    <div className="max-w-[500px] max-h-[500px] mx-6"><img src="/images/graph2.png" className="rounded-xl" /></div>
                    <div className="max-w-[500px] max-h-[500px] mx-6"><img src="/images/graph1.png" className="rounded-xl" /></div>
                </div>
            </div>
        </div>
     );
}
 
export default Graphs;