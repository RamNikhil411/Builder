import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Forms } from "~/lib/interfaces/types";

import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { BarChart3, Copy, Eye, Settings, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "@tanstack/react-router";

const FormCard = ({
  Form,
  index,
  handleDuplicateForm,
  handleDeleteForm,
}: {
  Form: Forms;
  index: number;
  handleDuplicateForm: (id: string) => void;
  handleDeleteForm: (id: string) => void;
}) => {
  const navigate = useNavigate;
  return (
    <div>
      <Card className="">
        <CardHeader className="px-3">
          <div className="flex justify-between ">
            <div className="space-y-2">
              <CardTitle>{Form.title}</CardTitle>
              <CardDescription>{Form.description}</CardDescription>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Badge
                variant={Form.isPublished ? "default" : "secondary"}
                className={`ml-2 ${Form.isPublished ? "bg-green-500 hover:bg-green-600" : ""}`}
              >
                {Form.isPublished ? "🟢 Published" : "🟡 Draft"}
              </Badge>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="px-3">
          <div className="flex justify-between">
            <div className="text-sm text-gray-500">
              📝 {Form.fields.length} fields
            </div>
            <div className="text-sm text-gray-500">
              📅 {Form.createdAt.toDateString()}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full group-hover:border-blue-300"
              >
                <Link to={`/builder/$form_id`} params={{ form_id: Form.id }}>
                  <Settings className="w-4 h-4 mr-1" />
                  Edit
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => handleDuplicateForm(Form.id)}
                variant="outline"
                size="sm"
                className="w-full group-hover:border-purple-300"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </motion.div>

            {Form.isPublished && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:border-green-300"
                >
                  <Link to={`/preview/$form_id`} params={{ form_id: Form.id }}>
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Link>
                </Button>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full group-hover:border-indigo-300"
              >
                <Link to={`/responses/$form_id`} params={{ form_id: Form.id }}>
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Data
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="col-span-2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteForm(Form.id)}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete Form
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormCard;
