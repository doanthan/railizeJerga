import { OpenAI } from "openai"
import { withNextSession } from "@/lib/session";
import { dbConnect } from "@/lib/lowDb";



export default withNextSession(async (req, res) => {
    if (req.method === "POST") {
        const { body } = req.body
        const prompt = body.prompt || ""

        const { user } = req.session
        if (!user) {
            return res.status(500).json({ error: { message: "Session is missing!" } })
        }
        try {


            const openai = new OpenAI(
                { apiKey: process.env.CHATGPT_API_KEY }
            );

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo-1106",
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 1024
            });

            const aiResponse = (completion.choices[0].message.content).trim();




            return res.status(200).json({ message: aiResponse });
        } catch (e) {
            console.log(e.message);
            return res.status(500).json({ error: { message: e.message } });
        }

    } else if (req.method = "PUT") {
        const { session } = req.query
        if (!session) {
            return res.status(500).json({ error: { message: "Invalid session provided!" } })
        }
        req.session.user = {
            session
        }

        await req.session.save()

        res.status(200).json(session)
    }
    else {
        return res.status(500).json({ error: { message: "Invalid API Route" } })
    }
})