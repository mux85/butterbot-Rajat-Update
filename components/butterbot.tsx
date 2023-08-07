"use client";

import { BubbleChat } from 'flowise-embed-react'

const Butterbot = () => {
    return (
        <BubbleChat
            chatflowid="5d7bf40b-1100-4b1c-bf80-ee6119ff1fa7"
            apiHost="https://gnoo.onrender.com"
            chatflowConfig={{ /* topK: 2 */ }}
            theme={{
                button: {
                    backgroundColor: "#341964",
                    right: 20,
                    bottom: 20,
                    size: "large",
                    iconColor: "white",
                    customIconSrc: "https://cdn.shopify.com/s/files/1/0793/8418/3092/files/bblogo.png?v=1690918654",
                },
                chatWindow: {
                    welcomeMessage: "Welcome to ButterBot! How can I assist you today?",
                    backgroundColor: "#ffffff",
                    height: 600,
                    width: 400,
                    fontSize: 14,
                    poweredByTextColor: "#ffffff",
                    botMessage: {
                        backgroundColor: "#f7f8ff",
                        textColor: "#303235",
                        showAvatar: true,
                        avatarSrc: "https://cdn.shopify.com/s/files/1/0793/8418/3092/files/bblogo.png?v=1690918654",
                    },
                    userMessage: {
                        backgroundColor: "#3B81F6",
                        textColor: "#ffffff",
                        showAvatar: true,
                        avatarSrc: "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png",
                    },
                    textInput: {
                        placeholder: "Type your question",
                        backgroundColor: "#ffffff",
                        textColor: "#303235",
                        sendButtonColor: "#3B81F6",
                    }
                }
            }}
        />
    );
};

export default Butterbot;

