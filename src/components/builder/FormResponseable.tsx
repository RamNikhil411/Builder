import React, { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";

interface Answer {
  id: string;
  label: string;
  value: string | string[];
  type: string;
}

interface Submission {
  answers: Answer[];
  submittedAt: Date;
}

interface Props {
  submissions: Submission[];
}

const FormResponsesTable: React.FC<Props> = ({ submissions }) => {
  const columns = useMemo<ColumnDef<Submission>[]>(() => {
    if (submissions.length === 0) return [];

    const answerLabels = Array.from(
      new Set(submissions.flatMap((s) => s.answers.map((a) => a.label)))
    );

    const baseCols: ColumnDef<Submission>[] = [
      {
        accessorKey: "submittedAt",
        header: "Submitted At",
        cell: ({ row }) =>
          dayjs(row.original.submittedAt).format("MMM DD, YYYY HH:mm"),
      },
    ];

    const answerCols: ColumnDef<Submission>[] = answerLabels.map((label) => ({
      id: label,
      header: label,
      cell: ({ row }) => {
        const answer = row.original.answers.find((a) => a.label === label);
        if (!answer) return "";
        if (answer.type === "date_picker")
          return dayjs(answer?.value as string).format("MMM DD, YYYY");
        return Array.isArray(answer.value)
          ? answer.value.join(", ")
          : answer.value;
      },
    }));

    return [...baseCols, ...answerCols];
  }, [submissions]);

  const table = useReactTable({
    data: submissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (submissions.length === 0) {
    return <div className="text-gray-500 text-sm">No responses yet</div>;
  }

  return (
    <div className=" h-full overflow-auto border rounded-md">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-2 text-left text-sm font-semibold border-b"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="odd:bg-white even:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 text-sm border-b">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormResponsesTable;
