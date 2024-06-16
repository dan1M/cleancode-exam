import {Box, Button, Input, Textarea, VStack} from "@chakra-ui/react";
import {useState} from "react";

const Create = () => {
    const [card, setCard] = useState({
        category: "FIRST",
        question: "",
        answer: "",
        userId: 1,
    });

    const createCard = async (card) => {
        try{
            const response = await fetch("http://localhost:3000/cards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(card),
            });
            if (response.ok) {
                console.log("Card created");
            } else {
                console.error("Error creating card");
            }
        } catch (error) {
            console.error("Error creating card", error);
        }
    }

    const handleSubmit = () => {
        createCard(card);
        setCard({ ...card, question: "", answer: "" });
    };
    return (
        <>
            <Box p={4}>
                <VStack spacing={4} align="stretch">
                    <Input
                        type="text"
                        placeholder="Question"
                        value={card.question}
                        onChange={(e) => setCard({ ...card, question: e.target.value })}
                    />
                    <Textarea
                        placeholder="Réponse"
                        value={card.answer}
                        onChange={(e) => setCard({ ...card, answer: e.target.value })}
                    />
                    <Button colorScheme="teal" onClick={handleSubmit}>Créer la Fiche</Button>
                </VStack>
            </Box>
        </>
    )
}

export default Create;