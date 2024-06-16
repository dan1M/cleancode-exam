import { Box, Flex, Heading, Button, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
    return (
        <Box bg="teal.500" p={4} color="white">
            <Flex justify="space-between" align="center">
                <Heading size="md">Leitner System</Heading>
                <Flex>
                    <Button as={RouterLink} to="/" colorScheme="white" variant="outline" mr={2}>
                        Accueil
                    </Button>
                    <Button as={RouterLink} to="/create-card" colorScheme="white" variant="outline" mr={2}>
                        Créer Fiche
                    </Button>
                    <Button as={RouterLink} to="/quiz" colorScheme="white" variant="outline" mr={2}>
                        Questionnaire
                    </Button>
                    <Button as={RouterLink} to="/view-card" colorScheme="white" variant="outline">
                        Voir Fiches
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;
