import React, { useState, useEffect } from "react";

export default function ChatApp() {
    const [username, setUsername] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [messageContent, setMessageContent] = useState("");
    const [messages, setMessages] = useState([]);

    const loadMessages = async (user) => {
        try {
            const response = await fetch(`/api/messages/${user}`);
            if (response.ok) {
                const data = await response.json();

                setMessages(data);
            } else {
                console.error("Erro ao carregar mensagens:", response.statusText);
            }
        } catch (error) {
            console.error("Erro ao carregar mensagens:", error);
        }
    };



    const sendMessage = async () => {
        try {
            const response = await fetch(`/api/messages/send/${username}/${selectedUser}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: messageContent,
                    dateInMs: Date.now(),
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setMessages([...messages, data]);
                setMessageContent("");
            } else {
                console.error("Erro ao enviar mensagem:", response.statusText);
            }
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    };

    useEffect(() => {
        if (username) {
            loadMessages(username);
        }
    }, [username, selectedUser]);

    return (
        <div>
            <h2>Chat App</h2>
            <div>
                <input
                    type="text"
                    placeholder="Seu nome de usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            {username && (
                <div>
                    <h3>Conversa com:</h3>
                    <input
                        type="text"
                        placeholder="Nome do destinatário"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    />
                    <div>
                        {messages.map((message, index) => (
                            <div key={index}>
                                {message.from}: {message.content}
                            </div>
                        ))}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Digite sua mensagem"
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                        />
                        <button onClick={sendMessage}>Enviar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

