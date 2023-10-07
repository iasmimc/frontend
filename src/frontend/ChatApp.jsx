import React, { useState, useEffect } from "react";
import styles from "../Styles/ChatApp.modules.css"
import moment from "moment";

export default function ChatApp() {
    const [usernameInput, setUsernameInput] = useState("");
    const [username, setUsername] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [messageContent, setMessageContent] = useState("");
    const [messages, setMessages] = useState([]);
    const [chattedUsers, setChattedUsers] = useState([]);

    const loadMessages = async (user) => {
        try {
            const response = await fetch(`/api/messages/${user}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data);


                const users = data.map((message) => message.from);
                setChattedUsers([...new Set(users)]);
            } else {
                console.error("Erro ao carregar mensagens:", response.statusText);
            }
        } catch (error) {
            console.error("Erro ao carregar mensagens:", error);
        }
    };




    const sendMessage = async () => {
        try {
            const response = await fetch(`/api/messages/send/${usernameInput}/${selectedUser}`, {
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
        <div className="talbody">
            <header className="talmain">
                <h1>OT@l Chat</h1>
            </header>
            <h2>Chat App</h2>
            <div className="input-container">
                <input
                    className="whatsapp-input"
                    type="text"
                    placeholder="Seu nome de usuário"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                />
                <button disabled={!usernameInput.length} className="whatsapp-button" onClick={() => setUsername(usernameInput)}>Escolher</button>
            </div>
            {username && (
                <div>
                    <div className="talOutrasCoisas">
                        <h3>Conversa com:</h3>
                        <input
                            type="text"
                            placeholder="Nome do destinatário"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        />
                        <div className="talUsers">

                            {chattedUsers.map((user) => (
                                <div key={user} onClick={() => setSelectedUser(user)}>
                                    {user}
                                </div>
                            ))}
                        </div>
                    </div>
                    {selectedUser && (
                        <div className="talpai">
                            {messages
                                .filter(message => (message.from === usernameInput && message.to === selectedUser) || (message.from === selectedUser && message.to === usernameInput))
                                .map((message, index) => (
                                    <div key={index} className={`whatsapp-chat ${message.from === username ? "sent" : "received"}`}>
                                        <p className="talData">
                                            {moment(new Date(message.dateInMs)).fromNow()}
                                            {/* {new Date(message.dateInMs).toLocaleDateString("pt-PT", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "numeric"
                                            })} */}
                                        </p>
                                        <span>{message.from}</span>: {message.content}
                                    </div>
                                ))}
                        </div>
                    )}
                    <div className="talcaixa">
                        <input
                            className="whatsapp-input"
                            type="text"
                            placeholder="Digite sua mensagem"
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                        />

                        <button className="whatsapp-button" onClick={sendMessage}>Enviar</button>
                    </div>
                </div>
            )}
            <footer className="talfooter">
                <p>&copy;All rights reserved: Frederico Mamede, Iasmim Capra e Silvia Moura </p>
            </footer>
        </div>

    );
}

