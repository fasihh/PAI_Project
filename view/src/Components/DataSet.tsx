import React from "react";
import { DataType } from "../types/global";

const DatasetGrid = ({ data }: { data: DataType }) => {
  const { description, head } = data;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dataset Overview</h1>

      <div className="max-h-[80vh] p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <div className="flex w-max justify-between">
              {Object.entries(description).map(([key, value]) => (
                <div
                  key={key}
                  className="border p-4 rounded shadow-sm bg-orange-100 mr-2 flex flex-col space-y-2"
                >
                  <strong className="text-sm">{key}</strong>
                  <p className="text-sm">
                    Mean - {value.mean.toFixed(2)}, Min - {value.min}, Max -{" "}
                    {value.max}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border p-4 rounded shadow-sm bg-white col-span-1 md:col-span-2 lg:col-span-3">
            <h2 className="text-lg font-semibold mb-2">Sample Data</h2>
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