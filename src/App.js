import './App.css';
import { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import '@mantine/core/styles.css';
import Core from './pages/Core';
import ShoppingKeywordSearch from './pages/ShoppingKeywordSearch';
import Library from './pages/Library';
import Folder from './pages/Folder';
import DetailPageAnalysis from './pages/DetailPageAnalysis';
import Planning from './pages/Planning';
import Usage from './pages/Usage';
import Home from './pages/Home';

import { baseUrl } from './shared';

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';


export const LoginContext = createContext();

function App() {

  useEffect(() => {
    async function login(e) {
      const response = await fetch(baseUrl + "api/token/", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({ username: "admin", password: "xc@12#@r" })
      })

      const data = await response.json();
      if (data.access && data.refresh) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
      }
    }

    function refreshTokens() {
      if (localStorage.refresh) {
        const url = baseUrl + "api/token/refresh/";
        fetch(url, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json", 
          }, 
          body: JSON.stringify({ refresh: localStorage.refresh }),
        })
        .then(response => response.json())
        .then((data) => {
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
        })
      }
    }    
    const minutes = 1000 * 60; 
    login();
    refreshTokens(); 
    setInterval(refreshTokens, minutes * 30); // Refresh every 30 minutes
  }, []);

  const [loggedIn, setLoggedIn] = useState(
      localStorage?.access ? true : false
  );

  function changeLoggedIn(value) {
      setLoggedIn(value);
      if (value == false) {
          localStorage.clear();
      }
  }

  return (
    <MantineProvider>
      <LoginContext.Provider value={{ loggedIn, changeLoggedIn }}>
        <BrowserRouter>
          <Routes>
            <Route element={<Core showHeaderIcon={false} headerText={"Home"} />}>
              <Route path="/home" element={<Home />} />
            </Route>
            <Route element={<Core showHeaderIcon={false} headerText={"쇼핑 키워드 리서치"} subText={"채널 별 경쟁사를 손쉽게 검색하여 지속적으로 관리 할 수 있습니다."} />}>
              <Route path="/search" element={<ShoppingKeywordSearch />} />
            </Route>
            <Route element={<Core showHeaderIcon={false} headerText={"라이브러리 관리"} />}>
              <Route path="/library" element={<Library />} />
            </Route>
            <Route element={<Core showNavigation={true} showHeaderIcon={true} headerText={"장어 경쟁사 리스트"} icon={"IconFolder"} />}>
              <Route path="/folder" element={<Folder />} />
            </Route>
            <Route element={<Core showNavigation={true} showHeaderIcon={true} headerText={"장어 경쟁사 리스트"} icon={"IconFolder"} />}>
              <Route path="/folder/:folder_id" element={<Folder />} />
            </Route>
            <Route element={<Core showNavigation={true} showHeaderIcon={true} headerText={"장어 경쟁사 리스트"} icon={"IconFile"}/>}>
              <Route path="/analysis" element={<DetailPageAnalysis />} />
            </Route>
            <Route element={<Core showNavigation={true} showHeaderIcon={true} headerText={"장어 경쟁사 리스트"} icon={"IconFile"}/>}>
              <Route path="/analysis/:analysis_id" element={<DetailPageAnalysis />} />
            </Route>
            <Route element={<Core showNavigation={true} showHeaderIcon={true} headerText={""} icon={""}/>}>
              <Route path="/planning" element={<Planning />} />
            </Route>
            <Route element={<Core showNavigation={true} showHeaderIcon={true} headerText={""} icon={""}/>}>
              <Route path="/usage" element={<Usage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LoginContext.Provider>
    </MantineProvider>
  );
}

export default App;

