import {Box, Button, Input, Text} from "@chakra-ui/react";
import {useEffect, useState} from "react";

const Quiz = () => {
    const [quiz, setQuiz] = useState([]);
    const [showQuiz, setShowQuiz] = useState(false);
    const [userResponses, setUserResponses] = useState({});
    const [userId, setUserId] = useState();
    const [validatedQuestions, setValidatedQuestions] = useState({});
    const date = new Date().toISOString();

    useEffect(() => {
        setUserId(localStorage.getItem("userId"));
    }, []);

    const generateQuizz = async () => {
        const response = await fetch(`http://localhost:3000/cards/quizz?userId=${userId}&date=${date}`);
        return await response.json();
    }

    const handleGenerateQUiz = async () => {
        const generatedQuiz = await generateQuizz()
        setQuiz(generatedQuiz);
        setShowQuiz(true);
        const initialResponses = generatedQuiz.reduce((acc, item) => {
            acc[item.id] = "";
            return acc;
        }, {});
        setUserResponses(initialResponses);
    }

    const handleValidateAnswer = async (id, userAnswer) => {
        const correctAnswer = quiz.find((q) => q.id === id)?.answer;
        if (userAnswer === correctAnswer) {
            alert("La réponse a été validée avec succès")
        } else {
            alert("La réponse est incorrecte");
        }
        await fetch(`http://localhost:3000/cards/${id}/answer`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId: 1, isValid: userAnswer === correctAnswer}),
        });
        setValidatedQuestions((prevValidatedQuestions) => ({
            ...prevValidatedQuestions,
            [id]: true,
        }));
    }

    const handleForceValidateAnswer = async (id) => {
        await fetch(`http://localhost:3000/cards/${id}/answer`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId: 1, isValid: true}),
        });
        alert("La réponse a été validée avec succès");
        setValidatedQuestions((prevValidatedQuestions) => ({
            ...prevValidatedQuestions,
            [id]: true,
        }));
    }

    return (
        <Box mx={"auto"} minWidth={"1600px"} minHeight={"80vh"}>
            {!showQuiz ? (
                <Button onClick={() => handleGenerateQUiz()}>Lancer le Quiz</Button>
            ) : (
                <Button onClick={() => setShowQuiz(false)}>Fermer le Quiz</Button>
            )}
            {showQuiz && (
                <Box>
                    <Text>Votre quizz</Text>
                    {quiz.map((question) => (
                        <Box key={question.id}>
                            <Text>{question.question}</Text>
                            <Text>Réponse :</Text>
                            <Input
                                type="text"
                                value={userResponses[question.id]}
                                id={question.id}
                                isDisabled={validatedQuestions[question.id]}
                                onChange={(e) => setUserResponses((prevResponses) => ({
                                    ...prevResponses,
                                    [question.id]: e.target.value,
                                }))}
                            />
                            {validatedQuestions[question.id] && <Text color={
                                userResponses[question.id] === question.answer ? "green" : "red"
                            }>La réponse correcte est : {question.answer}</Text>}
                            {!validatedQuestions[question.id] && (
                            <Button
                                onClick={() => handleValidateAnswer(question.id, userResponses[question.id])}
                            >Valider</Button>
                            )}
                            {validatedQuestions[question.id] && <Button
                                onClick={() => handleForceValidateAnswer(question.id)}
                            >Forcer la validation</Button>}
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    )
}

export default Quiz;