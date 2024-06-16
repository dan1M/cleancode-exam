import {Box, Button, Flex, Text} from "@chakra-ui/react";
import {Link as RouterLink} from "react-router-dom";

export const Home = () => {
    return (
        <>
            <Flex flexDir="column" h={'full'} mx={"auto"} maxWidth={"1600px"} minHeight={"1000px"}>
                <Box p={4}>
                    <Text fontSize="xl">Bienvenue sur l'application de réservation de studio photo.</Text>
                </Box>
                <Box p={4} textAlign="center">
                    <Text fontSize="xl" mb={4}>Bienvenue sur le système de répétition espacée Leitner.</Text>
                    <Button as={RouterLink} to="/create-card" colorScheme="teal" m={2}>Créer une Fiche</Button>
                    <Button as={RouterLink} to="/quiz" colorScheme="teal" m={2}>Démarrer un Questionnaire</Button>
                </Box>
            </Flex>
        </>
    )
}