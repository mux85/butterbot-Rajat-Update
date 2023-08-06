"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/loader";
import { Label } from "@/components/ui/label";
import { Heading } from "@/components/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CheckCheck, Bot, ChevronRight, UploadCloud, MessageSquare } from "lucide-react"
import axios from "axios";
import { useUser } from "@clerk/nextjs"; // import auth from Clerk
import { Switch } from "@/components/ui/switch";



const BotCreationPage = () => {
  const [loading, setLoading] = useState(false);
  const [botName, setBotName] = useState("");
  const [botNameError, setBotNameError] = useState("");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [file, setFile] = useState(null);
  const [bots, setBots] = useState([]);
  const [submittedBotName, setSubmittedBotName] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);  // new state variable
  
  const { user } = useUser();

  const SCRAPING_API_URL = "https://gnoo.onrender.com/api/v1/prediction/1b5ba2b2-40a4-4413-b75c-012609b5e7fb";
  const PDF_API_URL = "https://butterbot-ml2y.onrender.com/api/v1/prediction/88e6f717-db04-40bc-a3d5-753a7582b37d";


  function isValidURL(string) {
    var res = string.match(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/);
    return (res !== null);
  };

  const handleFileChange = (event) => {
    const chosenFile = event.target.files[0];
    // file size is in bytes, so we convert 10mb to bytes
    if (chosenFile && chosenFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      setFile(null);
    } else {
      setFile(chosenFile);
    }
  };

  const handleBotNameChange = (event) => {
    setBotName(event.target.value);
    setBotNameError('');  
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
    setUrlError('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const userId = user.id;
    setFormSubmitted(false);
    setSubmittedBotName(botName);  

    if (botName === '') {
      setBotNameError("Bot name is required");
      return;
    }

    if (url === '' && file === null) {
      setUrlError("Either a URL or a file is required");
      return;
    }

    // URL validation
    if (url !== '' && !isValidURL(url)) {
      setUrlError("Oops, invalid URL! Make sure your URL starts with \"http\" or \"https\", includes a domain and for best results, just copy it straight from your address bar.");
    return;
      return;
    }

    if (botName !== '' && (url !== '' || file !== null)) {
      setLoading(true);
      const payload = {
        "question": "Hey, how are you?",
        "overrideConfig": {
          "url": url,
          "pineconeNamespace": botName,
          "pineconeIndex": "keeko",
          "pineconeEnv": "northamerica-northeast1-gcp",
          "webScrap": true,
        },
      };

      try {
        let res;
        if (url !== '') {
          res = await axios.post(SCRAPING_API_URL, payload);
        } else if (file !== null) {
          const formData = new FormData();
          formData.append("files", file);
          formData.append("pineconeNamespace", botName);  // Use the bot name from the form data
          res = await axios.post(PDF_API_URL, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        if (res.status === 200) {
          setBots(prevBots => [...prevBots, { botName: botName, url: url, file: file }]);
          setLoading(false);
          setBotName(botName);
          setUrl("");
         setFile(null);
         setFormSubmitted(true); 
        
         // New: Now that the bot is created, save it to the database
        try {
          const botRes = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              botName,
              url,
              file: file ? file.name : '',  // Store the file name in the database
              userId,
            }),
          });

          // If the bot was saved successfully, show a success message
          if (botRes.ok) {
            toast.success("Bot saved successfully!");
          } else {
            // If there was an error, show an error message
            const errorMessage = await botRes.text();
            toast.error(`Failed to save bot: ${errorMessage}`);
          }
        } catch (error) {
          console.error('Failed to save bot:', error);
          toast.error('Failed to save bot');
        } 

        } else {
          setLoading(false);
          console.error(`An error occurred while processing the input. Status code: ${res.status}`);
        }
      } catch (error) {
        console.error(error);
        
        // Check if the error message contains the specific error string
        if (error.response && error.response.data.includes("Vector dimension 0 does not match the dimension of the index 1536")) {
            setBots(prevBots => [...prevBots, { botName: botName, url: url, file: file }]);
            setBotName(botName);
            setUrl("");
            setFile(null);
            setFormSubmitted(true);


        } else {
          // For any other error, display a toast
          toast.error("Invalid URL details. Please check your submission again.");
      }
    } finally {
        setLoading(false);
    }
    }
  };

  return (
    <div className="px-4 lg:px-8 space-y-4">
     {formSubmitted && (
  <Badge variant="outline" className="mx-auto mb-4">
    ButterBot Name: {submittedBotName}
  </Badge>
)}
      
      <div className="flex justify-between items-center">
      <Heading
  title={formSubmitted ? "Upload Successful" : "Upload your data"}
  description="Add your files for ButterBot to learn"
  icon={formSubmitted ? CheckCheck : UploadCloud}
  iconColor={formSubmitted ? "text-green-500" : "text-violet-500"}
  bgColor={formSubmitted ? "bg-green-500/10" : "bg-violet-500/10"}
/>
        {formSubmitted && (
    <Link href={`/conversation?botName=${botName}`} passHref>
      <Button as="a" className="bg-green-500 px-6 text-white hover:bg-green-600">
        <div className="flex items-center">
          <MessageSquare className="mr-2 h-4 w-4" />
          Test the bot
        </div>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </Link>
  )}
</div>
      <form className="grid w-full ml-0 items-start space-y-6" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="botName" className="font-bold">Enter Bot Name*</Label>
          <Input 
            id="botName"
            type="text" 
            onChange={handleBotNameChange} 
            placeholder="Enter a unique name for your bot"
            className="w-full"
            disabled={formSubmitted}
          />
          {botNameError && <p className="text-xs font-bold text-red-500">{botNameError}</p>}

        </div>
        <div className="space-y-2">
          <Label htmlFor="url" className="font-bold">Enter Website Address</Label>
          <Input 
            id="url"
            type="text" 
            onChange={handleUrlChange} 
            placeholder="Enter website URL : https://"
            className="w-full"
            disabled={formSubmitted}
          />
          {urlError && <p className="text-xs font-bold text-red-500">{urlError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="pdfFile" className="font-bold">Upload PDF file (max 5 MB per file)</Label>
          <Input 
            id="pdfFile"
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            className="w-full"
            disabled={formSubmitted}
          />
        </div>
        <Button type="submit" className="w-full mt-4">{loading ? "Processing..." : "Submit"}</Button>
      </form>
      {loading && (
        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
          <Loader />
        </div>
      )}
      {bots.length > 0 && bots.map((bot, index) => (
        <Card key={index} className="mt-4">
          <CardHeader className="flex justify-between items-start py-2"> 
            <div className="flex items-center">
              <CardTitle className="text-green-600 text-left font-bold text-2xl">Analysis Complete</CardTitle>  
              <Check className="text-green-600 ml-2"/>  
            </div>
            
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white shadow-md">
              <p className="text-blue-700 font-semibold text-md">Bot Name:</p> 
              <p className="text-gray-600 text-sm">{bot.botName}</p>
            </div>
            <div className="p-4 bg-white shadow-md">
              <p className="text-blue-700 font-semibold text-md">Website analysed:</p>
              <p className="text-gray-600 text-sm">{bot.url}</p>
            </div>
            <div className="p-4 bg-white shadow-md">
              <p className="text-blue-700 font-semibold text-md">PDF analysed:</p>
              <p className="text-gray-600 text-sm">{bot.file ? bot.file.name : "No file uploaded"}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
  };
  
  export default BotCreationPage;
  