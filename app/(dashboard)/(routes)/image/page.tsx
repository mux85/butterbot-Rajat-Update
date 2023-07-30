"use client";

import React, { useState } from "react";
import * as z from "zod";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Loader } from "@/components/loader";
import axios from "axios";

// Define your form schema using zod
const formSchema = z.object({
  botName: z.string(),
  url: z.string(),
});

const YourNewPage = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const SCRAPING_API_URL = "https://gnoo.onrender.com/api/v1/prediction/1b5ba2b2-40a4-4413-b75c-012609b5e7fb";
  const CHATBOT_API_URL = "https://gnoo.onrender.com/api/v1/prediction/1e32e22f-c9e9-46f2-a7cd-435b3580183f";

  const onSubmit = async (data) => {
    if (data.url !== '' && data.botName !== '') {
      setLoading(true);
      const payload = {
        "question": "Hey, how are you?",
        "overrideConfig": {
          "url": data.url,
          "pineconeNamespace": data.botName,
          "pineconeIndex": "keeko",
          "pineconeEnv": "northamerica-northeast1-gcp",
          "webScrap": true,
        },
      };

      try {
        const res = await axios.post(SCRAPING_API_URL, payload);
        if (res.status === 200) {
          setMessages([res.data]);
          setLoading(false);
        } else {
          setLoading(false);
          console.error(`An error occurred while processing the website URL. Status code: ${res.status}`);
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
  };

  const sendUserMessage = async (data) => {
    if (data.message !== '') {
      setLoading(true);
      const payload = {
        "question": data.message,
        "overrideConfig": {
          "pineconeNamespace": data.botName,
        },
      };

      try {
        const res = await axios.post(CHATBOT_API_URL, payload);
        if (res.status === 200) {
          // treat the response as a string
          const botMessage = res.data;
          setMessages([...messages, {message: data.message, role: 'user'}, {message: botMessage, role: 'bot'}]);
          setLoading(false);
        } else {
          setLoading(false);
          console.error(`An error occurred while processing the message. Status code: ${res.status}`);
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
  };

  return (
    <div className="px-4 lg:px-8">
      <AutoForm
        formSchema={formSchema}
        onSubmit={onSubmit}
        fieldConfig={{
          botName: {
            inputProps: {
              placeholder: "Name your Bot"
            }
          },
          url: {
            inputProps: {
              placeholder: "Enter URL"
            }
          }
        }}
      >
        <AutoFormSubmit>Submit</AutoFormSubmit>
      </AutoForm>
      <div className="space-y-4 mt-4">
        {loading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <Loader />
          </div>
        )}
        {messages.length > 0 && (
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div 
                key={index}
                className="p-8 w-full flex items-start gap-x-8 rounded-lg bg-white border border-black/10"
              >
                <p className="text-sm">
                  {message.message}
                </p>
              </div>
            ))}
            <AutoForm
              formSchema={z.object({ message: z.string() })}
              onSubmit={sendUserMessage}
              fieldConfig={{
                message: {
                  inputProps: {
                    placeholder: "Type your message...",
                    disabled: loading
                  }
                }
              }}
            >
              <AutoFormSubmit disabled={loading}>Send</AutoFormSubmit>
            </AutoForm>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourNewPage;
