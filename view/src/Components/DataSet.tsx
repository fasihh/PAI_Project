import React from "react";
import { DataType } from "../types/global";

const DatasetGrid = ({ data }: { data: DataType }) => {
  const { description, head } = data;

  return (
    <div className="flex flex-col p-6 bg-orange-50 my-4 shadow-md">
      <h1 className="text-xl font-bold mb-4">Dataset Overview</h1>

      <div className="flex flex-wrap justify-center gap-4">
        {Object.entries(description).map(([key, value]) => (
          <div
            key={key}
            className="p-6 rounded-lg shadow-md bg-orange-200 flex flex-col items-start space-y-2 transform transition duration-300 hover:scale-105 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold">{key}</h3>
            <p className="text-sm text-gray-800">
              <span className="font-bold text-gray-900">Mean:</span> {value.mean.toFixed(2)}
            </p>
            <p className="text-sm text-gray-800">
              <span className="font-bold text-gray-900">Min:</span> {value.min}
            </p>
            <p className="text-sm text-gray-800">
              <span className="font-bold text-gray-900">Max:</span> {value.max}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center my-4">
        <img
          className="w-fit h-fit shadow-md rounded-md"
          src={`${process.env.REACT_APP_API}/graphs/eda/heatmap`}
          alt="Heatmap"
        />
      </div>

      <div className="max-h-[80vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border p-4 rounded shadow-sm bg-white col-span-1 md:col-span-2 lg:col-span-3">
            <h2 className="text-lg font-semibold mb-2">Sample Data (100)</h2>
            <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
              <table className="table-auto w-full border-collapse border border-gray-200 text-sm">
                <thead>
                  <tr>
                    {Object.keys(head).map((column, index) => (
                      <th
                        key={index}
                        className="border border-gray-200 px-2 py-1 bg-orange-300"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(head[Object.keys(head)[0]]).map(([key]) => (
                    <tr key={key} className="odd:bg-orange-100">
                      {Object.keys(head).map((column, index) => (
                        <td
                          key={index}
                          className="border border-gray-200 px-2 py-1 text-center"
                        >
                          {head[column][key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetGrid;