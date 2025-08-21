import React from 'react';
import './ShoppingKeywordSearch.css';
import { useState, useEffect } from 'react';
import { Modal, Button, Input, NativeSelect, SemiCircleProgress, Box, LoadingOverlay, TextInput } from '@mantine/core';
import { 
  IconSearch,
  IconSquareLetterP,
    IconFolderFilled, 
} from '@tabler/icons-react';
import TableComponent from '../components/TableComponent';
import { baseUrl } from '../shared';
import { useDisclosure } from '@mantine/hooks';

export default function ShoppingKeywordSearch() {
    const [searchFormData, setSearchFormData] = useState({
        channel: '',
        keyword: '',
        result_count: 5,
    });
    const [searchId, setSearchId] = useState(null);
    const [searchResultId, setSearchResultId] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const [libraryModalOpened, { open: openLibraryModal, close: closeLibraryModal }] = useDisclosure(false);
    const [libraries, setLibraries] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState(1);

    const [selectedRecords, setSelectedRecords] = useState([]);

    const searchButtonHandler = async () => {
        try {
            if (!searchFormData.channel || !searchFormData.keyword || !searchFormData.result_count) {
                return;
            }

            const response = await fetch(baseUrl + 'api/searches/', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }, 
                body: JSON.stringify({
                    channel: searchFormData?.channel, 
                    keyword: searchFormData?.keyword, 
                    result_count: searchFormData?.result_count,  
                })
            });

            const data = await response.json(); 

            if (response.ok) {
                setSearchId(data.id);
                setLoading(true);
            }


        } catch (error) {
            console.error("Error during search:", error);
        }
    }

    useEffect(() => {
        let isCancelled = false;

        const pollSearchResults = async () => {
            while (!isCancelled && searchResultId === null) {
                await fetchSearchResults();
                await new Promise(resolve => setTimeout(resolve, 1000)); // sleep 1s
            }
        };

        const fetchSearchResults = async () => {
            if (searchId) {
                try {
                    const response = await fetch(baseUrl + `api/searches/${searchId}/results/`, {
                        method: 'GET', 
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('access')}`
                        }
                    }); 

                    const data = await response.json();
                    if (response.ok) {
                        setSearchResultId(data[0]?.id || null);
                    }
                } catch (error) {
                    console.error("Error fetching search results:", error);
                }
            }
        };

        pollSearchResults();

        return () => { isCancelled = true };
    }, [searchId, searchResultId]);

    const getResultDetail = async () => {
        try {
            const response = await fetch(baseUrl + `api/results/${searchResultId}/`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('access')}`
                }
            }); 

            const data = await response.json();

            if (response.ok) {
                setSearchResults(data);
            }
        } catch (error) {
            console.error("Error fetching search result by ID:", error);    
        }     
    }

    
    useEffect(() => {
        if (searchResultId) {
            setInterval(() => {
                getResultDetail();
                setLoading(false);
            }, 1000);
            // getResultDetsail();
        }        
    }, [searchResultId]);

    

    const getLibraries = async () => {
        try {
            const response = await fetch(baseUrl + 'api/libraries/', {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access')
                }
            });

            const data = await response.json();

            if (response.ok) {
                setLibraries(data?.results || []);
            }
        } catch (error) {
            console.error("Error fetching libraries:", error);  
        }
    }

    useEffect(() => {
        getLibraries();
    }, []);

    const saveToLibraryButtonHandler = async () => {
        try {
            const response = await fetch(baseUrl + `api/libraries/${selectedLibrary}/add_item/`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': 'Bearer ' + localStorage.getItem('access')
                }, 
                body: JSON.stringify({
                    result: selectedRecords.map(record => record.result_id)[0],  
                })
            });

            const data = await response.json(); 

            if (response.ok) {
                alert("Saved to library successfully");
            }
        } catch (error) {
            console.error("Error saving to library:", error);
        }
    }    

    return (
        <div className="shopping-keyword-search">
            <Modal opened={libraryModalOpened} onClose={closeLibraryModal} title={
                <div className="add-folder-modal-header">
                    <IconFolderFilled size="1.5rem" color="#000"/>
                    <span className="add-folder-modal-title">저장하기</span>
                </div>
            }>
                <div className="add-folder-modal-content">
                    <hr className="add-folder-modal-separator"/>
                    <div className="add-folder-modal-item">
                        <span className="add-folder-modal-item-label">폴더</span>
                        <NativeSelect 
                            variant="filled"
                            placeholder="상위 5개"
                            data={libraries?.map(library => ({ value: library.id, label: library.name }))}
                            value={selectedLibrary}
                            onChange={(e) => setSelectedLibrary(e.target.value)}
                        />
                    </div>
                    <Button variant="filled" color="rgba(0,0,0,1)" className="add-folder-modal-button" onClick={() => saveToLibraryButtonHandler()}>
                        저장
                    </Button>
                </div>
            </Modal>
            {/* <div className="top"> */}
                {/* <div className="header">
                    <h1>쇼핑 키워드 리서치</h1>
                    <h2>채널 별 경쟁사를 손쉽게 검색하여 지속적으로 관리 할 수 있습니다.</h2>
                </div>                 */}
            {/* </div> */}
            <div className="scrollable-div">
                <div className="filter">
                    <div className="filter-header">
                        <div className="filter-header-header">
                            <IconSearch size="1.5rem" />
                            <span className="filter-header-title">검색 방법을 선택하세요</span>
                        </div>
                        <div className="filter-header-sub">
                            <span className="filter-header-sub-title">리서치 채널을 선택하고 키워드를 입력해주세요.</span>
                        </div>
                    </div>
                    <div className="filter-content">
                        <div className="filter-item">
                            <NativeSelect 
                                variant="filled"
                                label="채널 선택" 
                                placeholder="Select channel"
                                data={["", "naver", "coupang"]} 
                                onChange={(e) => {
                                    setSearchFormData({ ...searchFormData, channel: e.target.value });
                                }}
                            />
                        </div>
                        <div className="filter-item">
                            <Input.Wrapper label="키워드 검색">
                                <Input placeholder="러닝화, 커피 등 키워드를 입력하세요" variant="filled" onChange={(e) => setSearchFormData({ ...searchFormData, keyword: e.target.value })} />
                            </Input.Wrapper>
                        </div>
                        <div className="filter-item">
                            <NativeSelect 
                                variant="filled"
                                label="불러오기 개수" 
                                placeholder="상위 5개"
                                data={["5", "10", "15", "20"]}
                                onChange={(e) => setSearchFormData({ ...searchFormData, result_count: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="filter-action">
                        <span className="filter-action-text">예상 사용 토큰 수 n건</span>
                        <Button
                            leftSection={<IconSearch size="1rem" />}
                            variant="filled"
                            color="rgba(0,0,0,1)"
                            className="filter-action-button"
                            onClick={() => searchButtonHandler()}
                        >상품 불러오기</Button>
                    </div>
                </div>
                <Box pos="relative">
                    <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{color: '#000'}} />
                    <div className="result">
                        <TableComponent showRecords={true} showSubtitle={true} searchResults={searchResults} showLibrary={true} openLibraryModal={openLibraryModal} tableType={"search"} setSelectedRecords={setSelectedRecords} />
                    </div>
                </Box>
            </div>
        </div>
    );
}