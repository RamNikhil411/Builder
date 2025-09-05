import { ArrowLeft, Calendar, Download, Eye } from "lucide-react";
import React, { useContext, useMemo } from "react";
import { FormContext } from "~/context/formContext";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import dayjs from "dayjs";

import FormResponsesTable from "./FormResponseable";

const FormResponses = () => {
  const { forms } = useContext(FormContext);
  const { form_id } = useParams({ strict: false });
  const form = forms.find((form) => form.id === form_id);
  const navigate = useNavigate();
  const submissions = form?.answers || [];

  // Build unique columns once (used for CSV too)
  const columns = useMemo(() => {
    if (submissions.length === 0) return [];

    const labels = Array.from(
      new Set(submissions.flatMap((s) => s.answers.map((a) => a.label)))
    );

    return [
      { id: "submittedAt", header: "Submitted At" },
      ...labels.map((label) => ({ id: label, header: label })),
    ];
  }, [submissions]);

  const exportCSV = () => {
    if (submissions.length === 0) return;

    const headers = columns.map((c) => c.header);

    const rows = submissions.map((s) =>
      columns.map((c) => {
        if (c.id === "submittedAt") {
          return dayjs(s.submittedAt).format("YYYY-MM-DD HH:mm");
        }
        const ans = s.answers.find((a) => a.label === c.id);
        if (ans?.type === "date_picker")
          return dayjs(ans?.value as string).format("YYYY-MM-DD");
        if (!ans) return "";
        return Array.isArray(ans.value) ? ans.value.join(", ") : ans.value;
      })
    );

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `form_responses_${dayjs().format("YYYYMMDD_HHmmss")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen">
      <div className="flex items-center justify-between mb-4 p-2 px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate({ to: "/" })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{form?.title}</h1>
            <p className="text-gray-600">Form Responses</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate({ to: `/preview/${form_id}` })}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Form
          </Button>
          <Button onClick={exportCSV} disabled={submissions.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 max-w-5xl gap-6 mb-8 p-4">
        <Card className="py-3 gap-3">
          <CardHeader className="pb-0 gap-0">
            <CardTitle className="text-lg font-medium">
              Total Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {submissions.length}
            </div>
          </CardContent>
        </Card>

        <Card className="py-3 gap-3">
          <CardHeader className="pb-0 gap-0">
            <CardTitle className="text-lg font-medium">Form Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={form?.isPublished ? "default" : "secondary"}>
              {form?.isPublished ? "Published" : "Draft"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="py-3 gap-3">
          <CardHeader className="pb-0 gap-0">
            <CardTitle className="text-lg font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              {dayjs(form?.updatedAt).format("MMM DD, YYYY")}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-4 h-[calc(100vh-260px)] ">
        <FormResponsesTable submissions={submissions} />
      </div>
    </div>
  );
};

export default FormResponses;
