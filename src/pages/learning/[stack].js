import stacks from "@/data/stacks.json"
import Image from "next/image"
import Header from "@/components/Header"
import Message from "@/components/Message"
import Prompt from "@/components/Prompt"
import { useRef, useState, useEffect } from "react"
import axios from "axios"

export default function Stack({ stack, stackKey }) {
    const [messages, setMessages] = useState([])
    const [activeSession, setActiveSession] = useState("")
    const chatRef = useRef(null)

    const SESSION_KEYS = [
        "u1-2023-04-13T15:36:20.424Z",
        "u2-2023-04-13T15:36:20.123Z",
        "u3-2023-04-13T15:36:20.421Z",
        "u4-2023-04-13T15:36:20.999Z",
    ];



    useEffect(() => {
        chatRef.current.scrollTo(0, chatRef.current.scrollHeight)
    }, [messages])

    const onSubmit = async (prompt) => {
        if (prompt.trim().length === 0) {
            return;
        }
        setMessages((messages) => {
            return [
                ...messages,
                {
                    id: new Date().toISOString(),
                    author: "human",
                    avatar: "https://thrangra.sirv.com/Avatar2.png",
                    text: prompt
                }
            ]
        })
        console.log(prompt)
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/completion`, { body: { prompt } })
        console.log(response)
        if (response.status === 200) {
            setMessages((messages) => {
                return [
                    ...messages,
                    {
                        id: new Date().toISOString(),
                        author: "ai",
                        avatar: "/logo-open-ai.png",
                        text: response.data.message
                    }
                ]
            })
        } else {
            console.error(json?.error?.message)
        }
    }

    const handleSessionChange = async (e) => {
        const session = e.target.value
        if (!session) {
            console.log("Not valid session!")
            return;
        }
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/completion?session=${session}`)
        setActiveSession(session)
    }



    return (
        <div className="h-full flex flex-col">
            <Header logo={stack.logo} info={stack.info} />
            <div className='mt-4'>Active Session: {activeSession}</div>
            <select
                onChange={handleSessionChange}
                value={activeSession !== ""}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[200px] p-2.5 mt-5">
                <option value={""} disabled={true}>Choose session</option>
                {SESSION_KEYS.map((sk) =>
                    <option key={sk} value={sk}>
                        {sk}
                    </option>
                )}
            </select>
            <hr className='my-4'></hr>

            <div ref={chatRef} className='chat flex flex-col h-full overflow-scroll'>
                {messages.length === 0 &&
                    <div className="bg-yellow-200 p-4 rounded-2xl">
                        No messages yet. Ask me something.
                    </div>
                }
                {messages.map((message, i) =>
                    <Message
                        key={message.id}
                        idx={i}
                        author={message.author}
                        avatar={message.avatar}
                        text={message.text}
                    />
                )}
            </div>
            <div className="flex p-4">
                <Prompt onSubmit={onSubmit} />
            </div>
        </div>
    )
}

export async function getStaticPaths() {
    const paths = Object.keys(stacks).map((key) => ({ params: { stack: key } }))

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    return {
        props: {
            stack: stacks[params.stack],
            stackKey: params.stack
        }
    }
}