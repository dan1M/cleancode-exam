import {Box, Flex, Switch, Text} from '@chakra-ui/react';
import {Outlet, Route, Router, Routes} from 'react-router-dom';
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import {Home} from "@/components/Home/Home.jsx";

function App() {
    localStorage.setItem("userId", 1)

    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
}

export default App;
