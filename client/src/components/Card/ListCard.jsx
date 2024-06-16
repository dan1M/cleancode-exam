import { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

const ListCard = () => {
    const [userId, setUserId] = useState(1);
    const [cards, setCards] = useState([]);
    const [selectedTag, setSelectedTag] = useState();

    useEffect(() => {
        fetch(`http://localhost:3000/cards`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((response) => response.json())
            .then((data) => setCards(data));
    }, [selectedTag]);

    return (
        <Box>
            {cards.map((card) => (
                <Box key={card.id}>
                    <Text>Question: {card.question}</Text>
                    <Text>Réponse: {card.answer}</Text>
                    <Text>Catégorie: {card.category}</Text>
                </Box>
            ))}
        </Box>
    );
};

export default ListCard;