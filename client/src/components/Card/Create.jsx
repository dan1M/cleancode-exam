import {Box, Button, Input, Textarea, VStack} from "@chakra-ui/react";
import {useState} from "react";

const Create = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleSubmit = () => {
        console.log('Creating flashcard:', { question, answer });
        // Logique pour créer la fiche
    };
    return (
        <>
            <Box p={4}>
                <VStack spacing={4} align="stretch">
                    <Input
                        placeholder="Question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <Textarea
                        placeholder="Réponse"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                    <Button colorScheme="teal" onClick={handleSubmit}>Créer la Fiche</Button>
                </VStack>
            </Box>
        </>
    )
}

export default Create;