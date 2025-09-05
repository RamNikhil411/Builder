import { BarChart3, FileText, Plus, Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Field } from "~/lib/interfaces/types";
import { FormContext } from "../context/formContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RippleButton } from "./ui/shadcn-io/ripple-button";
import FormCard from "./FormCard";

const Dashboard = () => {
  const { forms, setForms } = useContext(FormContext);
  const [search, setSearch] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  const filteredForms = forms.filter((form) => form?.title.includes(search));

  const handleAddNewForm = () => {
    const newForm = {
      id: uuidv4(),
      title: `Form ${forms.length + 1}`,
      fields: [] as Field[],
      isPublished: false,
      description: "Form Description",
      createdAt: new Date(),
      answers: [],
      updatedAt: new Date(),
    };
    setForms([...forms, newForm]);
  };

  const handleDuplicateForm = (id: string) => {
    const formToDuplicate = forms.find((form) => form.id === id);
    if (formToDuplicate) {
      const newForm = { ...formToDuplicate, id: uuidv4() };
      setForms([...forms, newForm]);
    }
  };

  const handleDeleteForm = (id: string) => {
    const updatedForms = forms.filter((form) => form.id !== id);
    setForms(updatedForms);
  };

  return (
    <div className="p-6 min-h-screen bg-bg-[linear-gradient(215deg,#f0fcff,#f1fbfe,#f1fafd,#f2f9fb,#f3f9fa,#f3f8f9,#f4f7f8,#f4f6f6,#f5f5f5)] h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl tracking-wide font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            FormCraft Pro
          </h1>
          <p className="mt-2">
            Build beautiful forms with React RND drag & drop ✨{" "}
          </p>
        </div>
        <div>
          <RippleButton className="bg-blue-700 p-1" onClick={handleAddNewForm}>
            {" "}
            <Plus /> Create New Form
          </RippleButton>
        </div>
      </div>
      <div className="flex  items-center gap-4 mt-4">
        <Input className="w-[500px]" placeholder="Search Forms ..." />
        <Select defaultValue="all_forms">
          <SelectTrigger>
            <SelectValue placeholder="Select a Form" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_forms">All Forms</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4"
      >
        <motion.div variants={itemVariants} className="">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Total Forms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-4xl font-bold"
              >
                {forms.length}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Published Forms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="text-4xl font-bold"
              >
                {forms.filter((f) => f.isPublished).length}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Draft Forms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="text-4xl font-bold"
              >
                {forms.filter((f) => !f.isPublished).length}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredForms.map((form, index) => (
            <motion.div
              key={form.id}
              variants={itemVariants}
              layout
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300 },
              }}
              className="group"
            >
              <FormCard
                Form={form}
                index={index}
                handleDuplicateForm={handleDuplicateForm}
                handleDeleteForm={handleDeleteForm}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
