"use client";

import React, { useState } from "react";
import * as z from "zod";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import axios from "axios";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";

const PDF_API_URL = "https://butterbot-ml2y.onrender.com/api/v1/prediction/88e6f717-db04-40bc-a3d5-753a7582b37d";

const botNameFormSchema = z.object({
  botName: z.string(),
});

const PDFSubmitterPage = () => {
  const [file, setFile] = useState(null);
  const [botName, setBotName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onSubmit = async (data) => {
    if (!file || !data.botName) {
      alert("Please select a file and enter a bot name");
      return;
    }

    setLoading(true);
    setBotName(data.botName);  // Store the bot name when the form is submitted

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("pineconeNamespace", data.botName);  // Use the bot name from the form data

      const response = await axios.post(PDF_API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle the response as needed
      console.log(response.data);

      setLoading(false);
    } catch (error) {
      console.error("Error uploading file", error);
      setLoading(false);
    }
  };


  return (
    <div className="px-4 lg:px-8">
      <AutoForm
        formSchema={botNameFormSchema}
        onSubmit={onSubmit}
        fieldConfig={{
          botName: {
            inputProps: {
              placeholder: "Name your Bot"
            }
          },
        }}
      >
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".pdf" 
          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
          placeholder="Upload PDF"
        />
        <AutoFormSubmit>{loading ? "Uploading..." : "Upload PDF"}</AutoFormSubmit>
      </AutoForm>
      {loading && (
        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default PDFSubmitterPage;
