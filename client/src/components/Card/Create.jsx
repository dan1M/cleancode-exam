import {Box, Button, Input, Modal, Select, Textarea, VStack} from "@chakra-ui/react";
import {useEffect, useState} from "react";

const Create = () => {
    const [userId, setUserId] = useState(1);
    const [tags, setTags] = useState(['']);
    const [tag, setTag] = useState("");
    const [card, setCard] = useState({
        category: "FIRST",
        question: "",
        answer: "",
        userId: 1,
    });

    useEffect(() => {
        const response = fetch(`http://localhost:3000/tags/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        response.then((res) => res.json()).then((data) => {
        setTags(tags.concat(data));
        });
    }, [userId]);

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
                const data = await response.json();
                if(tag){
                    handleAddTag(data.id, parseInt(tag))
                }
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

    const handleAddTag = (card, tag) => {
        const response = fetch("http://localhost:3000/cards/add-card-tag", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cardId: card, tagId: tag }),
        });
        response.then((res) => res.json()).then((data) => {
            setTags([...tags, data]);
        });
        alert("Tag ajouté")
    }

    const handleCreateTag = () => {
        const newTag = prompt("Enter the tag name");
        if (newTag) {
            const response = fetch("http://localhost:3000/tags", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newTag, userId }),
            });
            response.then((res) => res.json()).then((data) => {
                setTags([...tags, data]);
            });
        }
    }

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
                    <Button onClick={() => handleCreateTag()}>Créer un tag</Button>
                    <Select
                        onChange={(e) => setTag(e.target.value)}
                    >
                        {tags.map((tag) => (
                            <option key={tag.id} value={tag.id}>
                                {tag.name}
                            </option>
                        ))}
                    </Select>
                    <Button onClick={() => handleAddTag()}>Ajouter un tag</Button>
                    <Button colorScheme="teal" onClick={handleSubmit}>Créer la Fiche</Button>
                </VStack>
            </Box>

        </>
    )
}

export default Create;