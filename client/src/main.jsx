import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ChakraProvider } from '@chakra-ui/react';
import './index.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Home} from "@/components/Home/Home.jsx";
import Create from "@/components/Card/Create.jsx";
import Quiz from "@/components/Quiz.jsx";
import ListCard from "@/components/Card/ListCard.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ChakraProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} >
                        <Route index element={<Home />} />
                        <Route path={"create-card"} element={<Create />} />
                        <Route path="quiz" element={<Quiz />} />
                        <Route path={"cards"} element={<ListCard />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    </React.StrictMode>
);
